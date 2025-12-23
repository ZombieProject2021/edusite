import { Controller, Get, Post, Put, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { SeoService } from './seo.service';
import { PrismaService } from '../../prisma/prisma.service';

@ApiTags('seo')
@Controller('api/seo')
export class SeoController {
  constructor(
    private seoService: SeoService,
    private prisma: PrismaService,
  ) {}

  @Get('settings')
  @ApiOperation({ summary: 'Получить SEO настройки сайта' })
  async getSettings() {
    let settings = await this.prisma.seoSettings.findFirst();

    if (!settings) {
      // Создать настройки по умолчанию
      settings = await this.prisma.seoSettings.create({
        data: {
          siteName: 'SEO-Master CMS',
          siteDescription: 'Современная CMS с полной SEO-оптимизацией',
          siteUrl: 'http://localhost:3000',
          defaultTitle: '%title% | SEO-Master CMS',
          sitemapEnabled: true,
          sitemapFrequency: 'weekly',
          sitemapPriority: 0.8,
        },
      });
    }

    return settings;
  }

  @Put('settings')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Обновить SEO настройки' })
  async updateSettings(@Body() data: any) {
    let settings = await this.prisma.seoSettings.findFirst();

    if (settings) {
      return this.prisma.seoSettings.update({
        where: { id: settings.id },
        data,
      });
    }

    return this.prisma.seoSettings.create({ data });
  }

  @Get('analyze/:postId')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Анализ SEO конкретного поста' })
  async analyzePost(@Body() postId: string) {
    const post = await this.prisma.post.findUnique({
      where: { id: postId },
      include: {
        author: true,
        images: { include: { media: true } },
      },
    });

    if (!post) {
      return { error: 'Пост не найден' };
    }

    return this.seoService.analyzePost(post);
  }

  @Post('schema/generate')
  @ApiOperation({ summary: 'Генерировать Schema.org разметку для поста' })
  async generateSchema(@Body() data: { postId: string; siteUrl: string }) {
    const [post, settings] = await Promise.all([
      this.prisma.post.findUnique({
        where: { id: data.postId },
        include: { author: true },
      }),
      this.seoController_getSettings(),
    ]);

    if (!post) {
      return { error: 'Пост не найден' };
    }

    const schema = this.seoService.generateSchemaLd(post, data.siteUrl, settings);
    return { jsonLd: schema };
  }

  // Вспомогательный метод для получения настроек
  private async seoController_getSettings() {
    let settings = await this.prisma.seoSettings.findFirst();
    if (!settings) {
      settings = await this.prisma.seoSettings.create({
        data: {
          siteName: 'SEO-Master CMS',
          siteDescription: 'Современная CMS',
          siteUrl: 'http://localhost:3000',
        },
      });
    }
    return settings;
  }
}
