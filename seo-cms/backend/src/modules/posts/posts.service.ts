import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePostDto, UpdatePostDto, PostQueryDto } from './dto/post.dto';
import { SeoService } from '../seo/seo.service';
import * as slugify from 'slugify';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class PostsService {
  constructor(
    private prisma: PrismaService,
    private seoService: SeoService,
  ) {}

  async create(dto: CreatePostDto, authorId: string) {
    // Генерация slug из заголовка если не предоставлен
    let slug = dto.slug || slugify(dto.title, { lower: true, strict: true });

    // Проверка уникальности slug
    const existingPost = await this.prisma.post.findUnique({ where: { slug } });
    if (existingPost) {
      slug = `${slug}-${uuidv4().slice(0, 8)}`;
    }

    // Автогенерация SEO полей если не предоставлены
    const seoData = this.seoService.generateSeoFields(dto);

    // Определение статуса и даты публикации
    const status = dto.status || 'draft';
    const publishedAt = status === 'published' && !dto.publishedAt
      ? new Date()
      : dto.publishedAt || null;

    const post = await this.prisma.post.create({
      data: {
        title: dto.title,
        slug,
        excerpt: dto.excerpt,
        content: dto.content,
        contentHtml: dto.contentHtml,

        metaTitle: dto.metaTitle || seoData.metaTitle,
        metaDescription: dto.metaDescription || seoData.metaDescription,
        metaKeywords: dto.metaKeywords,

        ogTitle: dto.ogTitle || seoData.ogTitle,
        ogDescription: dto.ogDescription || seoData.ogDescription,
        ogImage: dto.ogImage,

        twitterCard: dto.twitterCard,
        twitterSite: dto.twitterSite,

        canonicalUrl: dto.canonicalUrl,
        noIndex: dto.noIndex || false,
        noFollow: dto.noFollow || false,
        schemaType: dto.schemaType || 'Article',

        status,
        publishedAt,

        authorId,
        categoryId: dto.categoryId,
      },
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: true,
        tags: { include: { tag: true } },
        images: { include: { media: true } },
      },
    });

    // Добавление тегов
    if (dto.tagIds && dto.tagIds.length > 0) {
      await this.prisma.postTag.createMany({
        data: dto.tagIds.map((tagId) => ({
          postId: post.id,
          tagId,
        })),
      });
    }

    return this.findOne(post.id);
  }

  async findAll(query: PostQueryDto) {
    const {
      page = 1,
      limit = 10,
      status,
      categoryId,
      search,
      sortBy = 'createdAt',
      sortOrder = 'desc',
    } = query;

    const where: any = {};

    if (status) where.status = status;
    if (categoryId) where.categoryId = categoryId;
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
      ];
    }

    const [posts, total] = await Promise.all([
      this.prisma.post.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          author: { select: { id: true, name: true } },
          category: true,
          tags: { include: { tag: true } },
        },
      }),
      this.prisma.post.count({ where }),
    ]);

    return {
      data: posts,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, email: true } },
        category: true,
        tags: { include: { tag: true } },
        images: { include: { media: true }, orderBy: { sortOrder: 'asc' } },
        revisions: { orderBy: { createdAt: 'desc' }, take: 10 },
      },
    });

    if (!post) {
      throw new NotFoundException('Пост не найден');
    }

    return post;
  }

  async findBySlug(slug: string) {
    const post = await this.prisma.post.findUnique({
      where: { slug, status: 'published' },
      include: {
        author: { select: { id: true, name: true } },
        category: true,
        tags: { include: { tag: true } },
        images: { include: { media: true }, orderBy: { sortOrder: 'asc' } },
      },
    });

    if (!post) {
      throw new NotFoundException('Пост не найден');
    }

    return post;
  }

  async update(id: string, dto: UpdatePostDto, userId: string) {
    const existingPost = await this.findOne(id);

    // Сохранение ревизии перед обновлением
    await this.prisma.postRevision.create({
      data: {
        postId: id,
        title: existingPost.title,
        content: existingPost.content,
      },
    });

    // Обновление slug если изменился заголовок и slug не предоставлен
    let slug = existingPost.slug;
    if (dto.title && !dto.slug) {
      slug = slugify(dto.title, { lower: true, strict: true });
      const existingSlug = await this.prisma.post.findFirst({
        where: { slug, NOT: { id } },
      });
      if (existingSlug) {
        slug = `${slug}-${uuidv4().slice(0, 8)}`;
      }
    } else if (dto.slug) {
      slug = dto.slug;
    }

    // Автогенерация SEO если не предоставлены
    const seoData = this.seoService.generateSeoFields({
      ...dto,
      title: dto.title || existingPost.title,
    });

    // Обновление статуса и даты публикации
    const status = dto.status || existingPost.status;
    const publishedAt = status === 'published' && existingPost.status !== 'published'
      ? new Date()
      : dto.publishedAt || existingPost.publishedAt;

    const post = await this.prisma.post.update({
      where: { id },
      data: {
        title: dto.title || existingPost.title,
        slug,
        excerpt: dto.excerpt ?? existingPost.excerpt,
        content: dto.content ?? existingPost.content,
        contentHtml: dto.contentHtml ?? existingPost.contentHtml,

        metaTitle: dto.metaTitle ?? seoData.metaTitle,
        metaDescription: dto.metaDescription ?? seoData.metaDescription,
        metaKeywords: dto.metaKeywords ?? existingPost.metaKeywords,

        ogTitle: dto.ogTitle ?? seoData.ogTitle,
        ogDescription: dto.ogDescription ?? seoData.ogDescription,
        ogImage: dto.ogImage ?? existingPost.ogImage,

        twitterCard: dto.twitterCard ?? existingPost.twitterCard,
        twitterSite: dto.twitterSite ?? existingPost.twitterSite,

        canonicalUrl: dto.canonicalUrl ?? existingPost.canonicalUrl,
        noIndex: dto.noIndex ?? existingPost.noIndex,
        noFollow: dto.noFollow ?? existingPost.noFollow,
        schemaType: dto.schemaType ?? existingPost.schemaType,

        status,
        publishedAt,

        categoryId: dto.categoryId ?? existingPost.categoryId,
      },
    });

    // Обновление тегов
    if (dto.tagIds !== undefined) {
      await this.prisma.postTag.deleteMany({ where: { postId: id } });
      if (dto.tagIds.length > 0) {
        await this.prisma.postTag.createMany({
          data: dto.tagIds.map((tagId) => ({
            postId: id,
            tagId,
          })),
        });
      }
    }

    return this.findOne(id);
  }

  async delete(id: string) {
    await this.findOne(id); // Проверка существования
    await this.prisma.post.delete({ where: { id } });
    return { success: true, message: 'Пост удалён' };
  }

  async analyzeSeo(id: string) {
    const post = await this.findOne(id);
    return this.seoService.analyzePost(post);
  }
}
