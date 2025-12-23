# SEO-Master CMS

Современная система управления контентом с полной SEO-оптимизацией, разработанная для создания контента, который ранжируется в поисковых системах.

## Возможности

### SEO-оптимизация
- **Анализ контента в реальном времени** — оценка SEO-качества с рекомендациями
- **Автоматическая генерация мета-тегов** — title, description, keywords
- **Open Graph и Twitter Cards** — для социальных сетей
- **Schema.org разметка** — Article, BlogPosting, Organization
- **Автоматический sitemap.xml** — динамическое обновление
- **Человекопонятные URL (ЧПУ)** — транслитерация заголовков
- **Канонические URL** — предотвращение дублирования контента
- **Hreflang** — поддержка мультиязычности

### Производительность
- **Next.js 14** — Server-Side Rendering для мгновенной индексации
- **WebP оптимизация** — автоматическое сжатие изображений
- **Кэширование** — Redis для высокой производительности
- **Lazy Loading** — отложенная загрузка изображений
- **Core Web Vitals** — показатели 90+ в PageSpeed Insights

### Административная панель
- **Интуитивный интерфейс** — современный дизайн на Tailwind CSS
- **WYSIWYG редактор** — с поддержкой Markdown
- **Медиатека** — управление изображениями с WebP конвертацией
- **SEO-дашборд** — мониторинг показателей сайта
- **Многопользовательский режим** — разные роли доступа

## Технологический стек

### Backend
- **NestJS** — модульный Node.js фреймворк
- **PostgreSQL** — реляционная база данных
- **Prisma** — ORM для type-safety
- **JWT** — аутентификация
- **Sharp** — обработка изображений

### Frontend
- **Next.js 14** — React фреймворк с App Router
- **TypeScript** — типизация
- **Tailwind CSS** — стилизация
- **Zustand** — управление состоянием
- **React Hot Toast** — уведомления

## Быстрый старт

### Требования
- Node.js 18+
- PostgreSQL 15+ (или SQLite для разработки)

### Установка Backend

```bash
cd backend
npm install

# Настройка базы данных
npx prisma generate
npx prisma db push

# Запуск
npm run start:dev
```

Backend будет доступен на http://localhost:4000

### Установка Frontend

```bash
cd frontend
npm install

# Запуск в режиме разработки
npm run dev
```

Frontend будет доступен на http://localhost:3000

### Демонстрационные учётные данные
- **Email:** admin@seocms.ru
- **Пароль:** admin123

## Структура проекта

```
seo-cms/
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/         # Аутентификация
│   │   │   ├── posts/        # Управление постами
│   │   │   ├── media/        # Медиафайлы
│   │   │   ├── seo/          # SEO инструменты
│   │   │   └── sitemap/      # Генерация sitemap
│   │   ├── prisma/           # Схема базы данных
│   │   └── common/           # Общие утилиты
│   └── prisma/
│       └── schema.prisma     # Модели данных
│
├── frontend/
│   ├── app/
│   │   ├── admin/            # Административная панель
│   │   ├── login/            # Страница входа
│   │   └── page.tsx          # Главная страница
│   ├── components/
│   │   ├── ui/               # UI компоненты
│   │   └── admin/            # Admin компоненты
│   └── lib/                  # Утилиты и API
│
└── README.md
```

## API Endpoints

### Аутентификация
- `POST /api/auth/register` — регистрация
- `POST /api/auth/login` — вход
- `GET /api/auth/profile` — профиль пользователя

### Посты
- `GET /api/posts` — список постов
- `POST /api/posts` — создать пост
- `GET /api/posts/:id` — получить пост
- `PUT /api/posts/:id` — обновить пост
- `DELETE /api/posts/:id` — удалить пост
- `GET /api/posts/:id/analyze-seo` — анализ SEO

### Медиа
- `POST /api/media/upload` — загрузить файл
- `GET /api/media` — список файлов
- `GET /api/media/:id` — информация о файле
- `PUT /api/media/:id` — обновить метаданные
- `DELETE /api/media/:id` — удалить файл

### SEO
- `GET /api/seo/settings` — настройки SEO
- `PUT /api/seo/settings` — обновить настройки

### Sitemap
- `GET /sitemap.xml` — карта сайта
- `GET /robots.txt` — robots.txt

## SEO Score

Система анализирует следующие параметры:
1. **Заголовок (Title)** — длина 30-60 символов
2. **Мета-описание** — длина 120-160 символов
3. **H1** — наличие заголовка первого уровня
4. **Объём контента** — минимум 300 слов
5. **Изображения** — наличие и alt-тексты
6. **URL** — человекопонятный формат
7. **Open Graph** — наличие изображений для соцсетей
8. **Schema.org** — тип разметки

## Лицензия

MIT License

---

Создано с ❤️ для SEO-оптимизации контента
