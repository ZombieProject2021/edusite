'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/Layout';
import { Card, CardContent, Button, Input, Textarea, Select, Badge, SeoScore } from '@/components/ui';
import {
  Save,
  Send,
  Eye,
  Settings,
  Image,
  Tag,
  ChevronDown,
  ChevronUp,
  AlertCircle,
  CheckCircle,
  Info,
} from 'lucide-react';
import toast from 'react-hot-toast';

// Демонстрационные данные
const categories = [
  { value: '1', label: 'SEO' },
  { value: '2', label: 'Контент' },
  { value: '3', label: 'Технический SEO' },
  { value: '4', label: 'Ключевые слова' },
  { value: '5', label: 'Внешний SEO' },
];

const tags = [
  { id: '1', name: 'оптимизация' },
  { id: '2', name: 'ключевые слова' },
  { id: '3', name: 'мета-теги' },
  { id: '4', name: 'контент' },
  { id: '5', name: 'ссылки' },
];

export default function NewPostPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showSeoPanel, setShowSeoPanel] = useState(true);

  // Состояние формы
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    contentHtml: '',
    categoryId: '',
    tagIds: [] as string[],
    status: 'draft',
    metaTitle: '',
    metaDescription: '',
    metaKeywords: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterCard: 'summary_large_image',
    canonicalUrl: '',
    noIndex: false,
    noFollow: false,
    schemaType: 'Article',
  });

  // Анализ SEO в реальном времени
  const seoAnalysis = analyzeSeo(formData);

  function analyzeSeo(data: typeof formData) {
    const issues: string[] = [];
    const passed: string[] = [];
    const warnings: string[] = [];

    // Проверка title
    const titleLength = (data.metaTitle || data.title || '').length;
    if (titleLength === 0) {
      issues.push('Отсутствует заголовок страницы (title)');
    } else if (titleLength < 30) {
      warnings.push('Заголовок слишком короткий (рекомендуется 30-60 символов)');
    } else if (titleLength > 60) {
      warnings.push('Заголовок слишком длинный (рекомендуется не более 60 символов)');
    } else {
      passed.push(`Заголовок имеет оптимальную длину (${titleLength} символов)`);
    }

    // Проверка description
    const descLength = (data.metaDescription || '').length;
    if (descLength === 0) {
      issues.push('Отсутствует мета-описание');
    } else if (descLength < 120) {
      warnings.push('Мета-описание коротковато');
    } else if (descLength > 160) {
      warnings.push('Мета-описание слишком длинное');
    } else {
      passed.push(`Мета-описание имеет оптимальную длину (${descLength} символов)`);
    }

    // Проверка контента
    const wordCount = (data.content || '').split(/\s+/).filter(Boolean).length;
    if (wordCount < 300) {
      issues.push('Слишком мало контента (менее 300 слов)');
    } else if (wordCount < 600) {
      warnings.push('Контент среднего размера (рекомендуется 600+ слов)');
    } else {
      passed.push(`Достаточный объём контента (${wordCount} слов)`);
    }

    // Проверка slug
    const slugValid = data.slug && /^[a-z0-9-]+$/.test(data.slug);
    if (!data.slug) {
      warnings.push('URL будет сгенерирован автоматически');
    } else if (!slugValid) {
      issues.push('Некорректный URL');
    } else {
      passed.push('URL корректный и человекопонятный');
    }

    // Проверка H1
    if (data.title && data.title.length > 0) {
      passed.push('Заголовок H1 присутствует');
    } else {
      issues.push('Отсутствует заголовок H1');
    }

    // Проверка OG Image
    if (!data.ogImage) {
      warnings.push('Добавьте изображение для социальных сетей');
    } else {
      passed.push('Настроено изображение для соцсетей');
    }

    // Расчёт score
    const totalChecks = issues.length + warnings.length + passed.length;
    const score = Math.round((passed.length / totalChecks) * 100);

    return { score, grade: getGrade(score), issues, warnings, passed, wordCount };
  }

  function getGrade(score: number): string {
    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
  }

  const handleSave = async (status: string) => {
    setIsLoading(true);
    try {
      // Имитация сохранения
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success(status === 'published' ? 'Пост опубликован!' : 'Пост сохранён как черновик');
      router.push('/admin/posts');
    } catch {
      toast.error('Ошибка при сохранении');
    } finally {
      setIsLoading(false);
    }
  };

  // Предпросмотр сниппета Google
  const snippetPreview = `${formData.metaTitle || formData.title || 'Заголовок страницы'} - SEO-Master CMS`;
  const snippetDescription = formData.metaDescription || 'Добавьте мета-описание для лучшего отображения в поисковых системах...';

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Верхняя панель */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Новый пост</h1>
            <p className="text-gray-500">Создание статьи с SEO-оптимизацией</p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={() => handleSave('draft')} loading={isLoading}>
              <Save className="w-4 h-4 mr-2" />
              Сохранить
            </Button>
            <Button onClick={() => handleSave('published')} loading={isLoading}>
              <Send className="w-4 h-4 mr-2" />
              Опубликовать
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Основной контент */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardContent className="py-6 space-y-4">
                <Input
                  label="Заголовок"
                  placeholder="Введите заголовок статьи..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
                <Input
                  label="URL (slug)"
                  placeholder="url-statyi-dlya-seo"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                  helperText="Будет сгенерирован автоматически из заголовка"
                />
                <Textarea
                  label="Краткое описание"
                  placeholder="Введите краткое описание статьи..."
                  rows={3}
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                />
                <Textarea
                  label="Содержимое"
                  placeholder="Напишите вашу статью здесь... (поддерживается Markdown)"
                  rows={15}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                />
              </CardContent>
            </Card>

            {/* SEO настройки */}
            <Card>
              <button
                onClick={() => setShowSeoPanel(!showSeoPanel)}
                className="w-full px-6 py-4 flex items-center justify-between border-b border-gray-100 hover:bg-gray-50"
              >
                <div className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-gray-500" />
                  <h2 className="font-semibold text-gray-900">SEO Настройки</h2>
                </div>
                {showSeoPanel ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
              {showSeoPanel && (
                <CardContent className="py-6 space-y-6">
                  {/* Meta Title & Description */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Input
                        label="Meta Title"
                        placeholder="SEO оптимизация: полное руководство"
                        value={formData.metaTitle}
                        onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                        helperText={`${(formData.metaTitle || formData.title || '').length}/60 символов`}
                      />
                    </div>
                    <div>
                      <Input
                        label="Meta Keywords"
                        placeholder="seo, оптимизация, продвижение"
                        value={formData.metaKeywords}
                        onChange={(e) => setFormData({ ...formData, metaKeywords: e.target.value })}
                      />
                    </div>
                  </div>
                  <Textarea
                    label="Meta Description"
                    placeholder="Подробное описание вашей статьи для поисковых систем..."
                    rows={3}
                    value={formData.metaDescription}
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                    helperText={`${(formData.metaDescription || '').length}/160 символов`}
                  />

                  {/* Open Graph */}
                  <div className="pt-4 border-t">
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Open Graph (Социальные сети)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="OG Title"
                        placeholder="Заголовок для соцсетей"
                        value={formData.ogTitle}
                        onChange={(e) => setFormData({ ...formData, ogTitle: e.target.value })}
                      />
                      <Input
                        label="OG Image URL"
                        placeholder="/uploads/image.jpg"
                        value={formData.ogImage}
                        onChange={(e) => setFormData({ ...formData, ogImage: e.target.value })}
                      />
                    </div>
                    <Textarea
                      label="OG Description"
                      placeholder="Описание для превью в социальных сетях..."
                      rows={2}
                      className="mt-4"
                      value={formData.ogDescription}
                      onChange={(e) => setFormData({ ...formData, ogDescription: e.target.value })}
                    />
                  </div>

                  {/* Technical SEO */}
                  <div className="pt-4 border-t">
                    <h3 className="text-sm font-medium text-gray-900 mb-4">Техническое SEO</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Input
                        label="Canonical URL"
                        placeholder="https://example.com/original"
                        value={formData.canonicalUrl}
                        onChange={(e) => setFormData({ ...formData, canonicalUrl: e.target.value })}
                      />
                      <Select
                        label="Schema.org Type"
                        value={formData.schemaType}
                        onChange={(e) => setFormData({ ...formData, schemaType: e.target.value })}
                        options={[
                          { value: 'Article', label: 'Article' },
                          { value: 'BlogPosting', label: 'BlogPosting' },
                          { value: 'NewsArticle', label: 'NewsArticle' },
                          { value: 'TechArticle', label: 'TechArticle' },
                        ]}
                      />
                    </div>
                    <div className="flex gap-4 mt-4">
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.noIndex}
                          onChange={(e) => setFormData({ ...formData, noIndex: e.target.checked })}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">noindex</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={formData.noFollow}
                          onChange={(e) => setFormData({ ...formData, noFollow: e.target.checked })}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">nofollow</span>
                      </label>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>

          {/* Боковая панель - SEO анализ */}
          <div className="space-y-6">
            {/* SEO Score */}
            <Card className="sticky top-24">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900">SEO Анализ</h2>
              </div>
              <CardContent className="py-6">
                <div className="flex justify-center mb-6">
                  <SeoScore score={seoAnalysis.score} grade={seoAnalysis.grade} />
                </div>

                {/* Issues */}
                {seoAnalysis.issues.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-red-600 mb-2 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      Критические ошибки
                    </h3>
                    <ul className="space-y-1">
                      {seoAnalysis.issues.map((issue, i) => (
                        <li key={i} className="text-sm text-red-600 bg-red-50 px-2 py-1 rounded">
                          {issue}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Warnings */}
                {seoAnalysis.warnings.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-sm font-medium text-yellow-600 mb-2 flex items-center gap-1">
                      <Info className="w-4 h-4" />
                      Рекомендации
                    </h3>
                    <ul className="space-y-1">
                      {seoAnalysis.warnings.map((warning, i) => (
                        <li key={i} className="text-sm text-yellow-700 bg-yellow-50 px-2 py-1 rounded">
                          {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Passed */}
                {seoAnalysis.passed.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-green-600 mb-2 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Выполнено
                    </h3>
                    <ul className="space-y-1">
                      {seoAnalysis.passed.map((item, i) => (
                        <li key={i} className="text-sm text-green-700 bg-green-50 px-2 py-1 rounded">
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Google Preview */}
            <Card>
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900">Google Preview</h2>
              </div>
              <CardContent className="py-4">
                <div className="border border-gray-200 rounded-lg p-3 bg-white">
                  <p className="text-lg text-blue-600 hover:underline cursor-pointer truncate">
                    {snippetPreview}
                  </p>
                  <p className="text-sm text-green-700 mt-1">
                    https://example.com/{formData.slug || 'url-statii'}
                  </p>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                    {snippetDescription}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Категория и теги */}
            <Card>
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900">Категории и теги</h2>
              </div>
              <CardContent className="py-4 space-y-4">
                <Select
                  label="Категория"
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  options={[{ value: '', label: 'Выберите категорию' }, ...categories]}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Теги</label>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <button
                        key={tag.id}
                        onClick={() => {
                          const newTags = formData.tagIds.includes(tag.id)
                            ? formData.tagIds.filter((id) => id !== tag.id)
                            : [...formData.tagIds, tag.id];
                          setFormData({ ...formData, tagIds: newTags });
                        }}
                        className={`px-3 py-1 rounded-full text-sm transition-colors ${
                          formData.tagIds.includes(tag.id)
                            ? 'bg-primary-100 text-primary-700 border border-primary-300'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {tag.name}
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Статус публикации */}
            <Card>
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900">Публикация</h2>
              </div>
              <CardContent className="py-4">
                <Select
                  label="Статус"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  options={[
                    { value: 'draft', label: 'Черновик' },
                    { value: 'published', label: 'Опубликовано' },
                    { value: 'archived', label: 'Архив' },
                  ]}
                />
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-sm text-gray-500">Слов в статье:</span>
                  <Badge variant={seoAnalysis.wordCount >= 300 ? 'success' : 'warning'}>
                    {seoAnalysis.wordCount}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
