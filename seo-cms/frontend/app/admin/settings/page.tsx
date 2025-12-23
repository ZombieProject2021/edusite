'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/Layout';
import { Card, CardContent, Button, Input, Select, Badge } from '@/components/ui';
import { Save, User, Bell, Shield, Database, Globe } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [settings, setSettings] = useState({
    // General
    siteName: 'SEO-Master CMS',
    siteUrl: 'http://localhost:3000',
    language: 'ru',
    timezone: 'Europe/Moscow',

    // User
    userName: 'Администратор',
    userEmail: 'admin@seocms.ru',

    // Notifications
    emailNotifications: true,
    seoAlerts: true,
    weeklyReport: true,

    // Security
    twoFactorAuth: false,
    sessionTimeout: '24h',
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
            <h1 className="text-2xl font-bold text-gray-900">Настройки</h1>
            <p className="text-gray-500">Управление параметрами системы</p>
          </div>
          <Button onClick={handleSave} loading={isLoading}>
            <Save className="w-4 h-4 mr-2" />
            Сохранить
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Общие настройки */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <Globe className="w-5 h-5 text-gray-500" />
              <h2 className="font-semibold text-gray-900">Общие настройки</h2>
            </div>
            <CardContent className="py-6 space-y-4">
              <Input
                label="Название сайта"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              />
              <Input
                label="URL сайта"
                value={settings.siteUrl}
                onChange={(e) => setSettings({ ...settings, siteUrl: e.target.value })}
              />
              <Select
                label="Язык интерфейса"
                value={settings.language}
                onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                options={[
                  { value: 'ru', label: 'Русский' },
                  { value: 'en', label: 'English' },
                ]}
              />
              <Select
                label="Часовой пояс"
                value={settings.timezone}
                onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                options={[
                  { value: 'Europe/Moscow', label: 'Москва (UTC+3)' },
                  { value: 'Europe/Spb', label: 'Санкт-Петербург (UTC+3)' },
                  { value: 'Asia/Almaty', label: 'Алматы (UTC+6)' },
                ]}
              />
            </CardContent>
          </Card>

          {/* Профиль */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <User className="w-5 h-5 text-gray-500" />
              <h2 className="font-semibold text-gray-900">Профиль</h2>
            </div>
            <CardContent className="py-6 space-y-4">
              <Input
                label="Имя"
                value={settings.userName}
                onChange={(e) => setSettings({ ...settings, userName: e.target.value })}
              />
              <Input
                label="Email"
                type="email"
                value={settings.userEmail}
                onChange={(e) => setSettings({ ...settings, userEmail: e.target.value })}
              />
              <Input
                label="Новый пароль"
                type="password"
                placeholder="••••••••"
              />
              <Input
                label="Подтверждение пароля"
                type="password"
                placeholder="••••••••"
              />
            </CardContent>
          </Card>

          {/* Уведомления */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <Bell className="w-5 h-5 text-gray-500" />
              <h2 className="font-semibold text-gray-900">Уведомления</h2>
            </div>
            <CardContent className="py-6 space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-gray-900">Email уведомления</p>
                  <p className="text-sm text-gray-500">Получать важные уведомления на почту</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.emailNotifications}
                  onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-gray-900">SEO-оповещения</p>
                  <p className="text-sm text-gray-500">Уведомления о проблемах с индексацией</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.seoAlerts}
                  onChange={(e) => setSettings({ ...settings, seoAlerts: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-gray-900">Еженедельный отчёт</p>
                  <p className="text-sm text-gray-500">Получать статистику по SEO каждую неделю</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.weeklyReport}
                  onChange={(e) => setSettings({ ...settings, weeklyReport: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </div>
            </CardContent>
          </Card>

          {/* Безопасность */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <Shield className="w-5 h-5 text-gray-500" />
              <h2 className="font-semibold text-gray-900">Безопасность</h2>
            </div>
            <CardContent className="py-6 space-y-4">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-medium text-gray-900">Двухфакторная аутентификация</p>
                  <p className="text-sm text-gray-500">Дополнительная защита аккаунта</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.twoFactorAuth}
                  onChange={(e) => setSettings({ ...settings, twoFactorAuth: e.target.checked })}
                  className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </div>
              <Select
                label="Таймаут сессии"
                value={settings.sessionTimeout}
                onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })}
                options={[
                  { value: '1h', label: '1 час' },
                  { value: '8h', label: '8 часов' },
                  { value: '24h', label: '24 часа' },
                  { value: '7d', label: '7 дней' },
                ]}
              />
            </CardContent>
          </Card>

          {/* Системная информация */}
          <Card className="lg:col-span-2">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
              <Database className="w-5 h-5 text-gray-500" />
              <h2 className="font-semibold text-gray-900">Системная информация</h2>
            </div>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Версия CMS</p>
                  <p className="font-semibold text-gray-900">1.0.0</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Backend</p>
                  <p className="font-semibold text-gray-900">NestJS 10</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">Frontend</p>
                  <p className="font-semibold text-gray-900">Next.js 14</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500">База данных</p>
                  <p className="font-semibold text-gray-900">PostgreSQL 15</p>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center gap-2">
                  <Badge variant="success">Все системы работают</Badge>
                  <span className="text-sm text-gray-500">Последняя проверка: только что</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}
