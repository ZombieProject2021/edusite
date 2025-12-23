import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

interface CreatePostDto {
  title: string;
  metaTitle?: string;
  metaDescription?: string;
  ogTitle?: string;
  ogDescription?: string;
}

@Injectable()
export class SeoService {
  constructor(private prisma: PrismaService) {}

  // Генерация SEO полей из контента
  generateSeoFields(dto: CreatePostDto) {
    const title = dto.title || 'Без названия';

    // Генерация metaTitle из заголовка
    const metaTitle = dto.metaTitle || title;

    // Генерация metaDescription из контента (первые 160 символов)
    const metaDescription = dto.metaDescription || this.extractDescription(dto.title);

    // Open Graph
    const ogTitle = dto.ogTitle || title;
    const ogDescription = dto.ogDescription || this.extractDescription(dto.title);

    return {
      metaTitle,
      metaDescription,
      ogTitle,
      ogDescription,
    };
  }

  // Извлечение описания из текста
  private extractDescription(text: string): string {
    if (!text) return '';

    // Удаление markdown/html тегов
    const cleanText = text
      .replace(/#{1,6}\s/g, '') // Заголовки markdown
      .replace(/\*\*|__/g, '') // Жирный текст
      .replace(/\*|_/g, '') // Курсив
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Ссылки
      .replace(/`{1,3}[^`]*`{1,3}/g, '') // Код
      .replace(/\n+/g, ' ') // Переносы строк
      .trim();

    // Обрезка до 160 символов
    if (cleanText.length > 160) {
      return cleanText.substring(0, 157) + '...';
    }

    return cleanText;
  }

  // Анализ SEO поста
  async analyzePost(post: any) {
    const issues: string[] = [];
    const recommendations: string[] = [];
    const passed: string[] = [];

    // Проверка title
    const titleLength = (post.metaTitle || post.title || '').length;
    if (titleLength === 0) {
      issues.push('Отсутствует заголовок страницы (title)');
    } else if (titleLength < 30) {
      recommendations.push('Заголовок слишком короткий (рекомендуется 30-60 символов)');
    } else if (titleLength > 60) {
      recommendations.push('Заголовок слишком длинный (рекомендуется не более 60 символов)');
    } else {
      passed.push(`Заголовок имеет оптимальную длину (${titleLength} символов)`);
    }

    // Проверка description
    const descLength = (post.metaDescription || '').length;
    if (descLength === 0) {
      issues.push('Отсутствует мета-описание (description)');
    } else if (descLength < 120) {
      recommendations.push('Мета-описание коротковато (рекомендуется 120-160 символов)');
    } else if (descLength > 160) {
      recommendations.push('Мета-описание слишком длинное (рекомендуется не более 160 символов)');
    } else {
      passed.push(`Мета-описание имеет оптимальную длину (${descLength} символов)`);
    }

    // Проверка H1
    const hasH1 = post.title && post.title.length > 0;
    if (!hasH1) {
      issues.push('Отсутствует заголовок H1');
    } else {
      passed.push('Заголовок H1 присутствует');
    }

    // Проверка контента
    const contentLength = (post.content || '').length;
    const wordCount = (post.content || '').split(/\s+/).filter(Boolean).length;

    if (wordCount < 300) {
      issues.push('Слишком мало контента (менее 300 слов)');
    } else if (wordCount < 600) {
      recommendations.push('Контент среднего размера (рекомендуется 600+ слов для лучшего ранжирования)');
    } else {
      passed.push(`Достаточный объём контента (${wordCount} слов)`);
    }

    // Проверка изображений
    const imagesCount = post.images?.length || 0;
    if (imagesCount === 0) {
      recommendations.push('Добавьте изображения для улучшения привлекательности контента');
    } else {
      passed.push(`Добавлено ${imagesCount} изображений`);

      // Проверка alt-текстов
      const imagesWithoutAlt = post.images?.filter((img: any) => !img.media?.alt) || [];
      if (imagesWithoutAlt.length > 0) {
        recommendations.push(`${imagesWithoutAlt.length} изображений без alt-текста`);
      } else {
        passed.push('Все изображения имеют alt-текст');
      }
    }

    // Проверка slug
    const slugValid = post.slug && /^[a-z0-9-]+$/.test(post.slug);
    if (!slugValid) {
      issues.push('Некорректный URL (slug)');
    } else {
      passed.push('URL (slug) корректный и человекопонятный');
    }

    // Проверка OG Image
    if (!post.ogImage) {
      recommendations.push('Добавьте изображение для социальных сетей (Open Graph)');
    } else {
      passed.push('Настроено изображение для социальных сетей');
    }

    // Проверка Schema.org
    if (!post.schemaType) {
      recommendations.push('Настройте тип Schema.org разметки');
    } else {
      passed.push(`Настроена Schema.org разметка (${post.schemaType})`);
    }

    // Расчёт SEO Score
    const totalChecks = issues.length + recommendations.length + passed.length;
    const passedCount = passed.length;
    const score = Math.round((passedCount / totalChecks) * 100);

    // Группировка по важности
    const critical = issues.slice(0, 3);
    const warnings = issues.slice(3).concat(recommendations.filter(r => r.includes('рекомендуется')));
    const info = recommendations.filter(r => !r.includes('рекомендуется'));

    return {
      score,
      grade: this.getGrade(score),
      summary: {
        totalChecks,
        passed: passed.length,
        issues: issues.length,
        recommendations: recommendations.length,
      },
      checks: {
        critical,
        warnings,
        passed,
        info,
      },
    };
  }

  private getGrade(score: number): string {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
  }

  // Генерация Schema.org JSON-LD
  generateSchemaLd(post: any, siteUrl: string, settings: any) {
    const schema: any = {
      '@context': 'https://schema.org',
    };

    switch (post.schemaType) {
      case 'BlogPosting':
        schema['@type'] = 'BlogPosting';
        schema.headline = post.title;
        schema.description = post.metaDescription || post.excerpt;
        schema.image = post.ogImage ? `${siteUrl}${post.ogImage}` : null;
        schema.datePublished = post.publishedAt;
        schema.dateModified = post.updatedAt;
        schema.author = {
          '@type': 'Person',
          name: post.author?.name || settings.organizationName,
        };
        schema.publisher = {
          '@type': 'Organization',
          name: settings.organizationName || settings.siteName,
          logo: settings.organizationLogo ? {
            '@type': 'ImageObject',
            url: `${siteUrl}${settings.organizationLogo}`,
          } : null,
        };
        break;

      case 'Article':
        schema['@type'] = 'Article';
        schema.headline = post.title;
        schema.description = post.metaDescription || post.excerpt;
        schema.image = post.ogImage ? `${siteUrl}${post.ogImage}` : null;
        schema.datePublished = post.publishedAt;
        schema.dateModified = post.updatedAt;
        schema.author = {
          '@type': 'Person',
          name: post.author?.name || settings.organizationName,
        };
        break;

      default:
        schema['@type'] = post.schemaType || 'Article';
        schema.name = post.title;
        schema.description = post.metaDescription || post.excerpt;
    }

    // Удаляем null значения
    Object.keys(schema).forEach(key => {
      if (schema[key] === null) delete schema[key];
    });

    return schema;
  }

  // Генерация Organization Schema
  generateOrganizationSchema(settings: any) {
    if (!settings.organizationName) return null;

    return {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: settings.organizationName,
      url: settings.organizationUrl,
      logo: settings.organizationLogo ? `${settings.siteUrl}${settings.organizationLogo}` : null,
    };
  }

  // Генерация Breadcrumb Schema
  generateBreadcrumbSchema(breadcrumbs: any[]) {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: breadcrumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: crumb.url,
      })),
    };
  }
}
