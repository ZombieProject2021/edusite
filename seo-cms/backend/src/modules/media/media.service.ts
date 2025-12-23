import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { writeFile, mkdir } from 'fs/promises';
import * as path from 'path';
import * as sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class MediaService {
  private uploadPath = path.join(process.cwd(), 'uploads');

  constructor(private prisma: PrismaService) {}

  async upload(file: Express.Multer.File, alt?: string) {
    if (!file) {
      throw new BadRequestException('Файл не предоставлен');
    }

    // Валидация типа файла
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.mimetype)) {
      throw new BadRequestException('Недопустимый тип файла. Разрешены: JPEG, PNG, GIF, WebP, SVG');
    }

    // Создание директории для загрузок
    await mkdir(this.uploadPath, { recursive: true });
    await mkdir(path.join(this.uploadPath, 'thumbnails'), { recursive: true });

    // Генерация уникального имени файла
    const fileExt = path.extname(file.originalname);
    const fileName = `${uuidv4()}${fileExt}`;
    const filePath = path.join(this.uploadPath, fileName);

    // Определение alt-текста
    const altText = alt || path.basename(file.originalname, fileExt)
      .replace(/[-_]/g, ' ')
      .replace(/\.[^/.]+$/, '');

    // Сохранение оригинального файла
    await writeFile(filePath, file.buffer);

    let webpPath: string | null = null;
    let webpSize: number | null = null;
    let width: number | null = null;
    let height: number | null = null;

    // Конвертация в WebP и получение размеров для изображений
    if (file.mimetype.startsWith('image/') && file.mimetype !== 'image/svg+xml') {
      try {
        const image = sharp(file.buffer);
        const metadata = await image.metadata();

        width = metadata.width || null;
        height = metadata.height || null;

        // Создание WebP версии
        const webpFileName = `${uuidv4()}.webp`;
        webpPath = path.join(this.uploadPath, webpFileName);

        const webpBuffer = await image
          .resize(1920, 1920, { fit: 'inside', withoutEnlargement: true })
          .webp({ quality: 85 })
          .toBuffer();

        await writeFile(webpPath, webpBuffer);
        webpSize = webpBuffer.length;
      } catch (error) {
        console.error('Ошибка конвертации в WebP:', error);
      }
    }

    // Сохранение в базу данных
    const media = await this.prisma.media.create({
      data: {
        filename: fileName,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        path: `/uploads/${fileName}`,
        alt: altText,
        webpPath: webpPath ? `/uploads/${path.basename(webpPath)}` : null,
        webpSize,
        width,
        height,
      },
    });

    return {
      id: media.id,
      url: `/uploads/${fileName}`,
      webpUrl: media.webpPath,
      filename: media.filename,
      originalName: media.originalName,
      mimeType: media.mimeType,
      size: media.size,
      width: media.width,
      height: media.height,
      alt: media.alt,
    };
  }

  async findAll(query: { page?: number; limit?: number; search?: string }) {
    const { page = 1, limit = 20, search } = query;

    const where: any = {};
    if (search) {
      where.OR = [
        { filename: { contains: search } },
        { originalName: { contains: search } },
        { alt: { contains: search } },
      ];
    }

    const [media, total] = await Promise.all([
      this.prisma.media.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.media.count({ where }),
    ]);

    return {
      data: media.map((m) => ({
        id: m.id,
        url: m.path,
        webpUrl: m.webpPath,
        filename: m.filename,
        originalName: m.originalName,
        mimeType: m.mimeType,
        size: m.size,
        width: m.width,
        height: m.height,
        alt: m.alt,
        createdAt: m.createdAt,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const media = await this.prisma.media.findUnique({ where: { id } });

    if (!media) {
      throw new NotFoundException('Медиафайл не найден');
    }

    return media;
  }

  async update(id: string, data: { alt?: string; caption?: string; title?: string }) {
    await this.findOne(id); // Проверка существования

    return this.prisma.media.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    await this.findOne(id); // Проверка существования
    await this.prisma.media.delete({ where: { id } });
    return { success: true, message: 'Медиафайл удалён' };
  }
}
