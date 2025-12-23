import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class SitemapService {
  constructor(private prisma: PrismaService) {}

  async generateXml(siteUrl: string): Promise<string> {
    const settings = await this.prisma.seoSettings.findFirst();
    const baseUrl = settings?.siteUrl || siteUrl;

    // Получение всех опубликованных постов
    const posts = await this.prisma.post.findMany({
      where: { status: 'published' },
      orderBy: { publishedAt: 'desc' },
      take: 50000, // Лимит для одного sitemap
    });

    // Получение всех категорий
    const categories = await this.prisma.category.findMany();

    // Генерация XML
    const urls = [];

    // Главная страница
    urls.push({
      loc: baseUrl,
      changefreq: 'daily',
      priority: 1.0,
      lastmod: new Date().toISOString(),
    });

    // Посты
    for (const post of posts) {
      urls.push({
        loc: `${baseUrl}/post/${post.slug}`,
        changefreq: settings?.sitemapFrequency || 'weekly',
        priority: settings?.sitemapPriority || 0.8,
        lastmod: post.updatedAt.toISOString(),
      });
    }

    // Категории
    for (const category of categories) {
      urls.push({
        loc: `${baseUrl}/category/${category.slug}`,
        changefreq: 'weekly',
        priority: 0.6,
      });
    }

    return this.buildSitemapXml(urls);
  }

  private buildSitemapXml(urls: any[]): string {
    const urlElements = urls.map((url) => {
      let element = `  <url>\n    <loc>${this.escapeXml(url.loc)}</loc>`;

      if (url.lastmod) {
        element += `\n    <lastmod>${url.lastmod}</lastmod>`;
      }
      if (url.changefreq) {
        element += `\n    <changefreq>${url.changefreq}</changefreq>`;
      }
      if (url.priority) {
        element += `\n    <priority>${url.priority}</priority>`;
      }

      element += '\n  </url>';
      return element;
    });

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urlElements.join('\n')}
</urlset>`;
  }

  private escapeXml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }

  async generateRobotsTxt(siteUrl: string): Promise<string> {
    const settings = await this.prisma.seoSettings.findFirst();
    const baseUrl = settings?.siteUrl || siteUrl;

    let robotsTxt = `# SEO-Master CMS - Robots.txt
# Сгенерировано автоматически

User-agent: *
Allow: /

# CSS, JS, изображения
Allow: /*.css$
Allow: /*.js$
Allow: /*.png$
Allow: /*.jpg$
Allow: /*.jpeg$
Allow: /*.gif$
Allow: /*.webp$

# Карта сайта
Sitemap: ${baseUrl}/sitemap.xml

# robots.txt для админ-панели
Disallow: /api/
Disallow: /admin/
Disallow: /uploads/
`;

    // Добавление кастомных правил из настроек
    if (settings) {
      // Можно добавить кастомные правила в будущем
    }

    return robotsTxt;
  }
}
