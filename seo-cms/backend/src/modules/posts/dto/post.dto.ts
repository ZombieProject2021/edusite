import { IsString, IsOptional, IsArray, IsBoolean, IsDateString, IsIn, MaxLength, MinLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreatePostDto {
  @ApiProperty({ example: 'Как оптимизировать сайт для SEO в 2024 году' })
  @IsString()
  @MinLength(3)
  title: string;

  @ApiPropertyOptional({ example: 'kak-optimizirovat-sait-dlya-seo' })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({ example: 'Полное руководство по SEO-оптимизации...' })
  @IsOptional()
  @IsString()
  excerpt?: string;

  @ApiProperty({ example: '# Основы SEO\n\nSEO (Search Engine Optimization) — это...' })
  @IsString()
  content: string;

  @ApiPropertyOptional({ example: '<h1>Основы SEO</h1><p>SEO это...</p>' })
  @IsOptional()
  @IsString()
  contentHtml?: string;

  // SEO поля
  @ApiPropertyOptional({ example: 'SEO оптимизация сайта: полное руководство 2024' })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  metaTitle?: string;

  @ApiPropertyOptional({ example: 'Изучите все аспекты SEO-оптимизации: техническое SEO, контент-маркетинг, работа с ключевыми словами и многое другое.' })
  @IsOptional()
  @IsString()
  @MaxLength(160)
  metaDescription?: string;

  @ApiPropertyOptional({ example: 'seo, оптимизация, продвижение сайта, 2024' })
  @IsOptional()
  @IsString()
  metaKeywords?: string;

  // Open Graph
  @ApiPropertyOptional({ example: 'SEO оптимизация: полное руководство' })
  @IsOptional()
  @IsString()
  ogTitle?: string;

  @ApiPropertyOptional({ example: 'Узнайте, как вывести ваш сайт в топ поисковых систем.' })
  @IsOptional()
  @IsString()
  ogDescription?: string;

  @ApiPropertyOptional({ example: '/uploads/images/seo-guide.jpg' })
  @IsOptional()
  @IsString()
  ogImage?: string;

  // Twitter Card
  @ApiPropertyOptional({ example: 'summary_large_image' })
  @IsOptional()
  @IsIn(['summary', 'summary_large_image', 'app', 'player'])
  twitterCard?: string;

  @ApiPropertyOptional({ example: '@mycompany' })
  @IsOptional()
  @IsString()
  twitterSite?: string;

  // Technical SEO
  @ApiPropertyOptional({ example: 'https://example.com/original-article' })
  @IsOptional()
  @IsString()
  canonicalUrl?: string;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  noIndex?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsOptional()
  @IsBoolean()
  noFollow?: boolean;

  @ApiPropertyOptional({ example: 'Article' })
  @IsOptional()
  @IsIn(['Article', 'BlogPosting', 'NewsArticle', 'TechArticle', 'Review'])
  schemaType?: string;

  // Статус и связи
  @ApiPropertyOptional({ example: 'published', enum: ['draft', 'published', 'archived'] })
  @IsOptional()
  @IsIn(['draft', 'published', 'archived'])
  status?: string;

  @ApiPropertyOptional({ example: '2024-01-15T10:00:00Z' })
  @IsOptional()
  @IsDateString()
  publishedAt?: string;

  @ApiPropertyOptional({ example: 'uuid-category-id' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({ example: ['uuid-tag-1', 'uuid-tag-2'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tagIds?: string[];
}

export class UpdatePostDto extends CreatePostDto {}

export class PostQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsString()
  page?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsString()
  limit?: number;

  @ApiPropertyOptional({ example: 'published', enum: ['draft', 'published', 'archived'] })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ example: 'uuid-category-id' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({ example: 'SEO' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 'createdAt', enum: ['createdAt', 'title', 'publishedAt'] })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({ example: 'desc', enum: ['asc', 'desc'] })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc';
}
