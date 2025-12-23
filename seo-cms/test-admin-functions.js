const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'https://u2gtiw1z1534.space.minimax.io';

async function testAdminPanel() {
    console.log('Начинаю тестирование админки SEO CMS...\n');

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();

    const results = {
        passed: 0,
        failed: 0,
        tests: []
    };

    function logTest(name, status, details = '') {
        const result = { name, status, details };
        results.tests.push(result);
        if (status === 'PASSED') {
            results.passed++;
            console.log(`✓ ${name}${details ? ': ' + details : ''}`);
        } else {
            results.failed++;
            console.log(`✗ ${name}${details ? ': ' + details : ''}`);
        }
    }

    try {
        // 1. Тест главной страницы админки
        console.log('\n=== Тест 1: Главная страница админки ===');
        await page.goto(`${BASE_URL}/admin/`, { waitUntil: 'networkidle' });
        const dashboardTitle = await page.textContent('h1');
        logTest('Главная страница админки загружается', dashboardTitle ? 'PASSED' : 'FAILED', `Заголовок: ${dashboardTitle || 'не найден'}`);

        // 2. Тест страницы постов
        console.log('\n=== Тест 2: Страница списка постов ===');
        await page.goto(`${BASE_URL}/admin/posts/`, { waitUntil: 'networkidle' });
        const postsTitle = await page.textContent('h1');
        logTest('Страница постов загружается', postsTitle ? 'PASSED' : 'FAILED', `Заголовок: ${postsTitle || 'не найден'}`);

        // Проверка наличия кнопки добавления
        const addButton = await page.$('a[href="/admin/posts/new/"]');
        logTest('Кнопка добавления поста присутствует', addButton ? 'PASSED' : 'FAILED');

        // 3. Тест страницы добавления поста
        console.log('\n=== Тест 3: Страница добавления поста ===');
        await page.goto(`${BASE_URL}/admin/posts/new/`, { waitUntil: 'networkidle' });
        const newPostTitle = await page.textContent('h1');
        logTest('Страница добавления поста загружается', newPostTitle ? 'PASSED' : 'FAILED', `Заголовок: ${newPostTitle || 'не найден'}`);

        // Проверка полей формы
        const titleInput = await page.$('input[name="title"]');
        const contentEditor = await page.$('.content-editor');
        const seoPanel = await page.$('.seo-analysis-panel');
        logTest('Поле заголовка присутствует', titleInput ? 'PASSED' : 'FAILED');
        logTest('Редактор контента присутствует', contentEditor ? 'PASSED' : 'FAILED');
        logTest('Панель SEO-анализа присутствует', seoPanel ? 'PASSED' : 'FAILED');

        // 4. Тест страницы редактирования поста
        console.log('\n=== Тест 4: Страница редактирования поста ===');
        await page.goto(`${BASE_URL}/admin/posts/1/`, { waitUntil: 'networkidle' });
        const editPageLoaded = await page.$('h1');
        logTest('Страница редактирования поста загружается (404 исправлен)', editPageLoaded ? 'PASSED' : 'FAILED');

        // 5. Тест страницы медиабиблиотеки
        console.log('\n=== Тест 5: Страница медиабиблиотеки ===');
        await page.goto(`${BASE_URL}/admin/media/`, { waitUntil: 'networkidle' });
        const mediaTitle = await page.textContent('h1');
        logTest('Страница медиабиблиотеки загружается', mediaTitle ? 'PASSED' : 'FAILED', `Заголовок: ${mediaTitle || 'не найден'}`);

        // Проверка области загрузки
        const uploadArea = await page.$('.upload-area');
        logTest('Область загрузки файлов присутствует', uploadArea ? 'PASSED' : 'FAILED');

        // 6. Тест страницы SEO-анализа
        console.log('\n=== Тест 6: Страница SEO-анализа ===');
        await page.goto(`${BASE_URL}/admin/seo/`, { waitUntil: 'networkidle' });
        const seoTitle = await page.textContent('h1');
        logTest('Страница SEO-анализа загружается', seoTitle ? 'PASSED' : 'FAILED', `Заголовок: ${seoTitle || 'не найден'}`);

        // 7. Тест страницы настроек
        console.log('\n=== Тест 7: Страница настроек ===');
        await page.goto(`${BASE_URL}/admin/settings/`, { waitUntil: 'networkidle' });
        const settingsTitle = await page.textContent('h1');
        logTest('Страница настроек загружается', settingsTitle ? 'PASSED' : 'FAILED', `Заголовок: ${settingsTitle || 'не найден'}`);

        // 8. Тест главной страницы сайта
        console.log('\n=== Тест 8: Главная страница сайта ===');
        await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle' });
        const homeTitle = await page.textContent('h1');
        logTest('Главная страница сайта загружается', homeTitle ? 'PASSED' : 'FAILED', `Заголовок: ${homeTitle || 'не найден'}`);

        // 9. Тест навигации между страницами
        console.log('\n=== Тест 9: Навигация ===');
        // Возврат на главную страницу админки
        await page.goto(`${BASE_URL}/admin/`, { waitUntil: 'networkidle' });
        const navWorks = await page.$('.sidebar');
        logTest('Боковая навигация присутствует', navWorks ? 'PASSED' : 'FAILED');

        // Проверка ссылок навигации
        const postsNavLink = await page.$('a[href="/admin/posts/"]');
        const mediaNavLink = await page.$('a[href="/admin/media/"]');
        const seoNavLink = await page.$('a[href="/admin/seo/"]');
        const settingsNavLink = await page.$('a[href="/admin/settings/"]');

        logTest('Ссылка на посты в навигации', postsNavLink ? 'PASSED' : 'FAILED');
        logTest('Ссылка на медиабиблиотеку в навигации', mediaNavLink ? 'PASSED' : 'FAILED');
        logTest('Ссылка на SEO-анализ в навигации', seoNavLink ? 'PASSED' : 'FAILED');
        logTest('Ссылка на настройки в навигации', settingsNavLink ? 'PASSED' : 'FAILED');

        // 10. Проверка компонентов интерфейса
        console.log('\n=== Тест 10: Компоненты интерфейса ===');

        // Проверка стилей (Tailwind CSS)
        const bodyClasses = await page.$eval('body', el => el.className);
        logTest('Tailwind CSS стили применены', bodyClasses.includes('bg-gray-100') ? 'PASSED' : 'FAILED');

        // Проверка адаптивности (мобильное меню)
        const mobileMenuButton = await page.$('.mobile-menu-button');
        logTest('Кнопка мобильного меню присутствует', mobileMenuButton ? 'PASSED' : 'FAILED');

        // 11. Тест формы редактирования поста
        console.log('\n=== Тест 11: Форма редактирования поста ===');
        await page.goto(`${BASE_URL}/admin/posts/1/`, { waitUntil: 'networkidle' });

        // Проверка полей формы редактирования
        const editTitleInput = await page.$('input[name="title"]');
        const editSlugInput = await page.$('input[name="slug"]');
        const editContentArea = await page.$('textarea[name="content"]');

        logTest('Поле заголовка в форме редактирования', editTitleInput ? 'PASSED' : 'FAILED');
        logTest('Поле slug в форме редактирования', editSlugInput ? 'PASSED' : 'FAILED');
        logTest('Область контента в форме редактирования', editContentArea ? 'PASSED' : 'FAILED');

        // 12. Тест SEO панели на странице редактирования
        console.log('\n=== Тест 12: SEO панель при редактировании ===');
        const seoScore = await page.$('.seo-score-circle');
        const metaDescription = await page.$('textarea[name="metaDescription"]');
        const keywords = await page.$('input[name="keywords"]');

        logTest('Отображение SEO-оценки', seoScore ? 'PASSED' : 'FAILED');
        logTest('Поле meta description', metaDescription ? 'PASSED' : 'FAILED');
        logTest('Поле keywords', keywords ? 'PASSED' : 'FAILED');

        // 13. Тест страницы авторизации
        console.log('\n=== Тест 13: Страница авторизации ===');
        await page.goto(`${BASE_URL}/login/`, { waitUntil: 'networkidle' });
        const loginForm = await page.$('form');
        const emailInput = await page.$('input[name="email"]');
        const passwordInput = await page.$('input[name="password"]');

        logTest('Форма авторизации присутствует', loginForm ? 'PASSED' : 'FAILED');
        logTest('Поле email', emailInput ? 'PASSED' : 'FAILED');
        logTest('Поле пароля', passwordInput ? 'PASSED' : 'FAILED');

    } catch (error) {
        logTest('Критическая ошибка теста', 'FAILED', error.message);
    }

    await browser.close();

    // Итоговый отчёт
    console.log('\n' + '='.repeat(50));
    console.log('ИТОГОВЫЙ ОТЧЁТ');
    console.log('='.repeat(50));
    console.log(`Всего тестов: ${results.passed + results.failed}`);
    console.log(`Пройдено: ${results.passed}`);
    console.log(`Провалено: ${results.failed}`);
    console.log(`Процент успеха: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);
    console.log('='.repeat(50));

    // Сохранение отчёта в файл
    const reportPath = path.join(__dirname, 'test-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(results, null, 2));
    console.log(`\nОтчёт сохранён: ${reportPath}`);

    return results;
}

testAdminPanel().catch(console.error);
