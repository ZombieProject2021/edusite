'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/Layout';
import { Card, CardContent, Button, Input, Textarea, Select } from '@/components/ui';
import { Save, Globe, Share2, Shield, FileText, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SeoSettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    siteName: 'SEO-Master CMS',
    siteDescription: 'Современная система управления контентом с полной SEO-оптимизацией',
    siteUrl: 'http://localhost:3000',
    logo: '',
    ogDefaultImage: '',
    twitterHandle: '@seomaster',
    defaultTitle: '%title% | SEO-Master CMS',
    defaultDescription: 'Создавайте контент, который ранжируется в поисковых системах',
    organizationName: 'SEO-Master',
    organizationUrl: 'http://localhost:3000',
    organizationLogo: '',
    sitemapEnabled: true,
    sitemapFrequency: 'weekly',
    sitemapPriority: 0.8,
  });

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast.success('Настройки сохранены');
    } catch {
      toast.error('Ошибка при сохранении');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Заголовок */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">SEO Настройки</h1>
            <p className="text-gray-500">Глобальные настройки поисковой оптимизации</p>
          </div>
          <Button onClick={handleSave} loading={isLoading}>
            <Save className="w-4 h-4 mr-2" />
            Сохранить
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Основные настройки */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <Globe className="w-5 h-5 text-gray-500" />
              <h2 className="font-semibold text-gray-900">Основные настройки</h2>
            </div>
            <CardContent className="py-6 space-y-4">
              <Input
                label="Название сайта"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                placeholder="Название вашего сайта"
              />
              <Textarea
                label="Описание сайта"
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                placeholder="Краткое описание сайта"
                rows={3}
              />
              <Input
                label="URL сайта"
                value={settings.siteUrl}
                onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
                placeholder="https://example.com"
              />
              <Input
                label="Логотип"
                value={settings.logo}
                onChange={(e) => setSettings({ ...settings, logo: e.target.value })}
                placeholder="/uploads/logo.png"
              />
            </CardContent>
          </Card>

          {/* Социальные сети */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-gray-500" />
              <h2 className="font-semibold text-gray-900">Социальные сети</h2>
            </div>
            <CardContent className="py-6 space-y-4">
              <Input
                label="Twitter Handle"
                value={settings.twitterHandle}
                onChange={(e) => setSettings({ ...settings, twitterHandle: e.target.value })}
                placeholder="@yourcompany"
              />
              <Input
                label="Изображение по умолчанию (OG)"
                value={settings.ogDefaultImage}
                onChange={(e) => setSettings({ ...settings, ogDefaultImage: e.target.value })}
                placeholder="/uploads/og-default.jpg"
                helperText="Используется если у статьи нет своего изображения"
              />
            </CardContent>
          </Card>

          {/* Шаблоны meta-тегов */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-500" />
              <h2 className="font-semibold text-gray-900">Шаблоны мета-тегов</h2>
            </div>
            <CardContent className="py-6 space-y-4">
              <Input
                label="Шаблон Title"
                value={settings.defaultTitle}
                onChange={(e) => setSettings({ ...settings, defaultTitle: e.target.value })}
                placeholder="%title% | %sitename%"
                helperText="Доступные переменные: %title%, %sitename%, %category%"
              />
              <Textarea
                label="Шаблон Description"
                value={settings.defaultDescription}
                onChange={(e) => setSettings({ ...settings, defaultDescription: e.target.value })}
                placeholder="Описание по умолчанию..."
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Organization Schema */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <Shield className="w-5 h-5 text-gray-500" />
              <h2 className="font-semibold text-gray-900">Organization Schema</h2>
            </div>
            <CardContent className="py-6 space-y-4">
              <Input
                label="Название организации"
                value={settings.organizationName}
                onChange={(e) => setSettings({ ...settings, organizationName: e.target.value })}
                placeholder="Название вашей компании"
              />
              <Input
                label="URL организации"
                value={settings.organizationUrl}
                onChange={(e) => setSettings({ ...settings, organizationUrl: e.target.value })}
                placeholder="https://company.com"
              />
              <Input
                label="Логотип организации"
                value={settings.organizationLogo}
                onChange={(e) => setSettings({ ...settings, organizationLogo: e.target.value })}
                placeholder="/uploads/organization-logo.png"
              />
            </CardContent>
          </Card>

          {/* Sitemap настройки */}
          <Card className="lg:col-span-2">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-gray-500" />
              <h2 className="font-semibold text-gray-900">Настройки Sitemap</h2>
            </div>
            <CardContent className="py-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.sitemapEnabled}
                    onChange={(e) => setSettings({ ...settings, sitemapEnabled: e.target.checked })}
                    className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <div>
                    <p className="font-medium text-gray-900">Автогенерация sitemap</p>
                    <p className="text-sm text-gray-500">Автоматическое обновление карты сайта</p>
                  </div>
                </div>
                <Select
                  label="Частота обновления"
                  value={settings.sitemapFrequency}
                  onChange={(e) => setSettings({ ...settings, sitemapFrequency: e.target.value })}
                  options={[
                    { value: 'always', label: 'Всегда' },
                    { value: 'hourly', label: 'Ежечасно' },
                    { value: 'daily', label: 'Ежедневно' },
                    { value: 'weekly', label: 'Еженедельно' },
                    { value: 'monthly', label: 'Ежемесячно' },
                    { value: 'yearly', label: 'Ежегодно' },
                  ]}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Приоритет по умолчанию
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={settings.sitemapPriority}
                    onChange={(e) => setSettings({ ...settings, sitemapPriority: parseFloat(e.target.value) })}
                    className="w-full"
                  />
                  <p className="text-sm text-gray-500 mt-1">{settings.sitemapPriority}</p>
                </div>
              </div>

              {/* Robots.txt preview */}
              <div className="mt-6 pt-6 border-t">
                <h3 className="font-medium text-gray-900 mb-3">Предпросмотр robots.txt</h3>
                <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-green-400 text-sm font-mono">
{`# SEO-Master CMS - Robots.txt
User-agent: *
Allow: /

Sitemap: ${settings.siteUrl}/sitemap.xml

Disallow: /api/
Disallow: /admin/`}
                  </pre>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
