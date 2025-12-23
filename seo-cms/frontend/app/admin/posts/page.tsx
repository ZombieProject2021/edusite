'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/Layout';
import { Card, Button, Badge, Input, EmptyState } from '@/components/ui';
import { Plus, Search, Filter, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

// Демонстрационные данные
const initialPosts = [
  {
    id: '1',
    title: 'Полное руководство по SEO-оптимизации в 2024 году',
    slug: 'polnoe-rukovodstvo-po-seo-optimizatsii',
    status: 'published',
    author: 'Алексей Петров',
    category: 'SEO',
    createdAt: '2024-01-15T10:00:00Z',
    seoScore: 92,
    views: 1250,
  },
  {
    id: '2',
    title: 'Как выбрать ключевые слова для сайта',
    slug: 'kak-vybrat-klyuchevye-slova-dlya-saita',
    status: 'published',
    author: 'Мария Иванова',
    category: 'Ключевые слова',
    createdAt: '2024-01-14T14:30:00Z',
    seoScore: 85,
    views: 890,
  },
  {
    id: '3',
    title: 'Технический SEO: основы и лучшие практики',
    slug: 'tekhnicheskiy-seo-osnovy-i-luchshie-praktiki',
    status: 'draft',
    author: 'Алексей Петров',
    category: 'Технический SEO',
    createdAt: '2024-01-13T09:15:00Z',
    seoScore: 68,
    views: 0,
  },
  {
    id: '4',
    title: 'Создание контента, который ранжируется',
    slug: 'sozdanie-kontenta-kotoriy-rankiruetsya',
    status: 'published',
    author: 'Елена Смирнова',
    category: 'Контент',
    createdAt: '2024-01-12T16:45:00Z',
    seoScore: 78,
    views: 567,
  },
  {
    id: '5',
    title: 'Внешняя оптимизация: ссылочная стратегия',
    slug: 'vneshnyaya-optimizatsiya-ssylocnaya-strategiya',
    status: 'archived',
    author: 'Алексей Петров',
    category: 'Внешний SEO',
    createdAt: '2024-01-10T11:20:00Z',
    seoScore: 72,
    views: 320,
  },
];

export default function PostsPage() {
  const [posts, setPosts] = useState(initialPosts);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge variant="success">Опубликовано</Badge>;
      case 'draft':
        return <Badge variant="warning">Черновик</Badge>;
      case 'archived':
        return <Badge variant="error">Архив</Badge>;
      default:
        return null;
    }
  };

  const getSeoScoreClass = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-600';
    if (score >= 60) return 'bg-yellow-100 text-yellow-600';
    return 'bg-red-100 text-red-600';
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Заголовок */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Посты</h1>
            <p className="text-gray-500">Управление контентом сайта</p>
          </div>
          <Link href="/admin/posts/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Новый пост
            </Button>
          </Link>
        </div>

        {/* Фильтры */}
        <Card>
          <div className="p-4 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск постов..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
              >
                <option value="all">Все статусы</option>
                <option value="published">Опубликовано</option>
                <option value="draft">Черновики</option>
                <option value="archived">Архив</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Список постов */}
        {filteredPosts.length > 0 ? (
          <Card>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Пост
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Автор
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Статус
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SEO
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Дата
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Действия
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <Link
                            href={`/admin/posts/${post.id}`}
                            className="font-medium text-gray-900 hover:text-primary-600"
                          >
                            {post.title}
                          </Link>
                          <p className="text-sm text-gray-500">/{post.slug}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-900">{post.author}</span>
                      </td>
                      <td className="px-6 py-4">
                        {getStatusBadge(post.status)}
                      </td>
                      <td className="px-6 py-4">
                        <div className={`inline-flex items-center justify-center w-10 h-10 rounded-full text-sm font-bold ${getSeoScoreClass(post.seoScore)}`}>
                          {post.seoScore}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-500">
                          {format(new Date(post.createdAt), 'd MMM yyyy', { locale: ru })}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/admin/posts/${post.id}`}>
                            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                              <Edit className="w-4 h-4" />
                            </button>
                          </Link>
                          <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                            {post.status === 'published' ? (
                              <Eye className="w-4 h-4" />
                            ) : (
                              <EyeOff className="w-4 h-4" />
                            )}
                          </button>
                          <button
                            onClick={() => setPosts(posts.filter((p) => p.id !== post.id))}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        ) : (
          <Card>
            <EmptyState
              title="Посты не найдены"
              description={search ? 'Попробуйте изменить поисковый запрос' : 'Создайте свой первый пост'}
              action={
                <Link href="/admin/posts/new">
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Создать пост
                  </Button>
                </Link>
              }
            />
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
