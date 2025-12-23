'use client';

import React from 'react';
import AdminLayout from '@/components/admin/Layout';
import { Card, CardContent, Badge, SeoScore } from '@/components/ui';
import { FileText, Image, TrendingUp, Eye, Edit3, Calendar } from 'lucide-react';

// Демонстрационные данные
const stats = [
  { name: 'Всего постов', value: '156', change: '+12%', icon: FileText, color: 'blue' },
  { name: 'Опубликовано', value: '128', change: '+8%', icon: Edit3, color: 'green' },
  { name: 'Медиафайлов', value: '1,247', change: '+24%', icon: Image, color: 'purple' },
  { name: 'Просмотры', value: '45.2K', change: '+18%', icon: Eye, color: 'orange' },
];

const recentPosts = [
  {
    id: '1',
    title: 'Полное руководство по SEO-оптимизации в 2024 году',
    status: 'published',
    author: 'Алексей Петров',
    date: '2024-01-15',
    seoScore: 92,
  },
  {
    id: '2',
    title: 'Как выбрать ключевые слова для сайта',
    status: 'published',
    author: 'Мария Иванова',
    date: '2024-01-14',
    seoScore: 85,
  },
  {
    id: '3',
    title: 'Технический SEO: основы и лучшие практики',
    status: 'draft',
    author: 'Алексей Петров',
    date: '2024-01-13',
    seoScore: 68,
  },
  {
    id: '4',
    title: 'Создание контента, который ранжируется',
    status: 'published',
    author: 'Елена Смирнова',
    date: '2024-01-12',
    seoScore: 78,
  },
];

const topKeywords = [
  { keyword: 'seo оптимизация', position: 3, visits: 2450 },
  { keyword: 'как продвинуть сайт', position: 5, visits: 1890 },
  { keyword: 'ключевые слова', position: 7, visits: 1650 },
  { keyword: 'технический seo', position: 2, visits: 1420 },
  { keyword: 'внутренняя оптимизация', position: 8, visits: 980 },
];

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Заголовок */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Дашборд</h1>
          <p className="text-gray-500">Обзор показателей вашего сайта</p>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.name}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">{stat.name}</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                    <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                  </div>
                </div>
                <div className="flex items-center gap-1 mt-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-green-600">{stat.change}</span>
                  <span className="text-sm text-gray-400">за месяц</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Последние посты */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-semibold text-gray-900">Последние посты</h2>
              <a href="/admin/posts" className="text-sm text-primary-600 hover:text-primary-700">
                Смотреть все
              </a>
            </div>
            <div className="divide-y divide-gray-100">
              {recentPosts.map((post) => (
                <div key={post.id} className="px-6 py-4 flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{post.title}</p>
                    <div className="flex items-center gap-3 mt-1">
                      <Badge variant={post.status === 'published' ? 'success' : 'warning'}>
                        {post.status === 'published' ? 'Опубликовано' : 'Черновик'}
                      </Badge>
                      <span className="text-sm text-gray-400">{post.author}</span>
                      <span className="text-sm text-gray-400">{post.date}</span>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold ${
                      post.seoScore >= 80 ? 'bg-green-100 text-green-600' :
                      post.seoScore >= 60 ? 'bg-yellow-100 text-yellow-600' :
                      'bg-red-100 text-red-600'
                    }`}>
                      {post.seoScore}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Топ ключевых слов */}
          <Card>
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Топ ключевых слов</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ключевое слово
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Позиция
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Визиты
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {topKeywords.map((item, index) => (
                    <tr key={item.keyword} className="hover:bg-gray-50">
                      <td className="px-6 py-3">
                        <span className="text-sm text-gray-900">{item.keyword}</span>
                      </td>
                      <td className="px-6 py-3">
                        <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${
                          item.position <= 3 ? 'bg-green-100 text-green-800' :
                          item.position <= 10 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          #{item.position}
                        </span>
                      </td>
                      <td className="px-6 py-3">
                        <span className="text-sm text-gray-900">{item.visits.toLocaleString()}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* SEO Обзор */}
        <Card>
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">SEO Обзор</h2>
          </div>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <span className="text-xl font-bold text-green-600">92</span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Средний SEO Score</p>
                  <p className="text-lg font-semibold text-green-700">Отлично</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Проиндексировано</p>
                  <p className="text-lg font-semibold text-blue-700">128 страниц</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-purple-50 rounded-lg">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Последнее обновление</p>
                  <p className="text-lg font-semibold text-purple-700">Сегодня</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
