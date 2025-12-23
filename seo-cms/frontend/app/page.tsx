import type { Metadata } from 'next';

// Главная страница сайта
export const metadata: Metadata = {
  title: 'SEO-Master CMS - Современная система управления контентом',
  description: 'Создавайте оптимизированный контент с помощью нашей современной CMS. Полная SEO-оптимизация, аналитика и удобный интерфейс.',
  keywords: ['CMS', 'SEO', 'Content Management', 'оптимизация сайта'],
  openGraph: {
    title: 'SEO-Master CMS - Современная система управления контентом',
    description: 'Создавайте оптимизированный контент с помощью нашей современной CMS',
    type: 'website',
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-600 via-primary-700 to-indigo-900">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <span className="text-2xl font-bold text-white">SEO-Master CMS</span>
          <div className="flex gap-4">
            <a
              href="/admin"
              className="px-4 py-2 text-white hover:text-gray-200 transition-colors"
            >
              Войти
            </a>
            <a
              href="/admin"
              className="px-4 py-2 bg-white text-primary-600 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Начать
            </a>
          </div>
        </nav>
      </header>

      <main className="container mx-auto px-4 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Создавайте контент,<br />который ранжируется
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Современная система управления контентом с полной SEO-оптимизацией.
            Анализируйте, оптимизируйте и публикуйте — всё в одном месте.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/admin"
              className="px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              Перейти в админ-панель
            </a>
            <a
              href="#features"
              className="px-8 py-4 border-2 border-white text-white rounded-lg font-semibold text-lg hover:bg-white/10 transition-colors"
            >
              Узнать больше
            </a>
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="py-20 mt-20">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Почему выбирают SEO-Master CMS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <div className="w-14 h-14 bg-primary-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">SEO-анализ в реальном времени</h3>
              <p className="text-gray-300">
                Получайте мгновенную обратную связь о качестве SEO-оптимизации вашего контента.
                Система анализирует заголовки, мета-теги, плотность ключевых слов и многое другое.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <div className="w-14 h-14 bg-primary-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Максимальная производительность</h3>
              <p className="text-gray-300">
                Страницы загружаются мгновенно благодаря оптимизации изображений, кэшированию и
                современной архитектуре. Core Web Vitals показатели 90+.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <div className="w-14 h-14 bg-primary-500 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Структурированные данные</h3>
              <p className="text-gray-300">
                Автоматическая генерация Schema.org разметки для лучшего понимания контента
                поисковыми системами и получения расширенных сниппетов.
              </p>
            </div>
          </div>
        </section>

        {/* Technical Features */}
        <section className="py-20">
          <div className="bg-white rounded-3xl p-12">
            <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
              Технические возможности
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl mb-4">📄</div>
                <h3 className="font-semibold text-gray-900">Автоматические Sitemap</h3>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🔗</div>
                <h3 className="font-semibold text-gray-900">Человекопонятные URL</h3>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🖼️</div>
                <h3 className="font-semibold text-gray-900">WebP оптимизация</h3>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🌐</div>
                <h3 className="font-semibold text-gray-900">Hreflang поддержка</h3>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">📱</div>
                <h3 className="font-semibold text-gray-900">Open Graph</h3>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🐦</div>
                <h3 className="font-semibold text-gray-900">Twitter Cards</h3>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="font-semibold text-gray-900">Lazy Loading</h3>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="font-semibold text-gray-900">Безопасность</h3>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 text-center">
          <div className="bg-gradient-to-r from-primary-500 to-indigo-600 rounded-3xl p-12">
            <h2 className="text-3xl font-bold text-white mb-4">
              Готовы улучшить свой SEO?
            </h2>
            <p className="text-xl text-gray-200 mb-8">
              Начните использовать SEO-Master CMS уже сегодня
            </p>
            <a
              href="/admin"
              className="inline-block px-8 py-4 bg-white text-primary-600 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              Перейти в админ-панель
            </a>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/20">
        <div className="container mx-auto px-4 py-8 text-center text-gray-400">
          <p>© 2024 SEO-Master CMS. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}
