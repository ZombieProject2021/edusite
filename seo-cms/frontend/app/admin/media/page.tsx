'use client';

import React, { useState } from 'react';
import AdminLayout from '@/components/admin/Layout';
import { Card, Button, Badge, EmptyState } from '@/components/ui';
import { Upload, Search, Image, File, Trash2, Edit2 } from 'lucide-react';

// Демонстрационные данные медиафайлов
const initialMedia = [
  { id: '1', name: 'seo-guide-2024.jpg', size: '245 KB', type: 'image', dimensions: '1920x1080', uploadedAt: '2024-01-15' },
  { id: '2', name: 'keyword-research.png', size: '189 KB', type: 'image', dimensions: '1200x800', uploadedAt: '2024-01-14' },
  { id: '3', name: 'technical-seo-checklist.pdf', size: '1.2 MB', type: 'document', uploadedAt: '2024-01-13' },
  { id: '4', name: 'content-strategy-infographic.png', size: '456 KB', type: 'image', dimensions: '1600x900', uploadedAt: '2024-01-12' },
  { id: '5', name: 'backlink-building.jpg', size: '312 KB', type: 'image', dimensions: '1400x800', uploadedAt: '2024-01-11' },
  { id: '6', name: 'page-speed-optimization.webp', size: '98 KB', type: 'image', dimensions: '800x600', uploadedAt: '2024-01-10' },
];

export default function MediaPage() {
  const [media, setMedia] = useState(initialMedia);
  const [search, setSearch] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [showUploadModal, setShowUploadModal] = useState(false);

  const filteredMedia = media.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelection = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const deleteSelected = () => {
    setMedia((prev) => prev.filter((item) => !selectedItems.includes(item.id)));
    setSelectedItems([]);
  };

  const getTypeIcon = (type: string) => {
    if (type === 'image') return <Image className="w-8 h-8 text-green-500" />;
    return <File className="w-8 h-8 text-gray-400" />;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Заголовок */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Медиатека</h1>
            <p className="text-gray-500">Управление изображениями и файлами</p>
          </div>
          <Button onClick={() => setShowUploadModal(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Загрузить
          </Button>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <Card className="py-4 px-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Image className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Всего файлов</p>
                <p className="text-2xl font-bold text-gray-900">{media.length}</p>
              </div>
            </div>
          </Card>
          <Card className="py-4 px-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Image className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Изображений</p>
                <p className="text-2xl font-bold text-gray-900">
                  {media.filter((m) => m.type === 'image').length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="py-4 px-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-lg">
                <File className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Документов</p>
                <p className="text-2xl font-bold text-gray-900">
                  {media.filter((m) => m.type === 'document').length}
                </p>
              </div>
            </div>
          </Card>
          <Card className="py-4 px-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-lg">
                <Upload className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-500">Общий размер</p>
                <p className="text-2xl font-bold text-gray-900">2.4 MB</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Фильтры */}
        <Card>
          <div className="p-4 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Поиск файлов..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            {selectedItems.length > 0 && (
              <div className="flex gap-2">
                <Badge variant="info">{selectedItems.length} выбрано</Badge>
                <Button variant="danger" size="sm" onClick={deleteSelected}>
                  <Trash2 className="w-4 h-4 mr-1" />
                  Удалить
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Сетка медиафайлов */}
        {filteredMedia.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filteredMedia.map((item) => (
              <Card
                key={item.id}
                className={`cursor-pointer transition-all ${
                  selectedItems.includes(item.id) ? 'ring-2 ring-primary-500' : ''
                }`}
                onClick={() => toggleSelection(item.id)}
              >
                <div className="aspect-square flex items-center justify-center bg-gray-100 rounded-t-xl">
                  {item.type === 'image' ? (
                    <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-t-xl flex items-center justify-center">
                      <Image className="w-12 h-12 text-gray-400" />
                    </div>
                  ) : (
                    getTypeIcon(item.type)
                  )}
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">{item.size}</span>
                    {item.type === 'image' && (
                      <Badge variant="info" className="text-xs">
                        {item.dimensions}
                      </Badge>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <EmptyState
              title="Файлы не найдены"
              description="Загрузите изображения и файлы для вашего контента"
              icon={<Image className="w-12 h-12 text-gray-300" />}
              action={
                <Button onClick={() => setShowUploadModal(true)}>
                  <Upload className="w-4 h-4 mr-2" />
                  Загрузить файл
                </Button>
              }
            />
          </Card>
        )}

        {/* Upload Modal */}
        {showUploadModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Card className="w-full max-w-lg mx-4">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Загрузка файлов</h2>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center hover:border-primary-500 transition-colors cursor-pointer">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-2">
                    Перетащите файлы сюда или нажмите для выбора
                  </p>
                  <p className="text-sm text-gray-500">
                    Поддерживаются: JPEG, PNG, GIF, WebP, PDF (макс. 10MB)
                  </p>
                  <input type="file" className="hidden" multiple accept="image/*,.pdf" />
                </div>
                <div className="flex justify-end gap-2 mt-4">
                  <Button variant="secondary" onClick={() => setShowUploadModal(false)}>
                    Отмена
                  </Button>
                  <Button>Загрузить</Button>
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
