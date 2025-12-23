/**
 * EduCMS Storage Module
 * Управление данными через localStorage
 */

const EduStore = {
    // Ключи для localStorage
    KEYS: {
        COURSES: 'educms_courses',
        PAGES: 'educms_pages',
        SETTINGS: 'educms_settings'
    },

    // Инициализация данных (вызывается если данных нет)
    init() {
        if (!localStorage.getItem(this.KEYS.COURSES)) {
            localStorage.setItem(this.KEYS.COURSES, JSON.stringify(this.getDefaultCourses()));
        }
        if (!localStorage.getItem(this.KEYS.PAGES)) {
            localStorage.setItem(this.KEYS.PAGES, JSON.stringify(this.getDefaultPages()));
        }
    },

    // Данные по умолчанию для курсов
    getDefaultCourses() {
        return [
            {
                id: 1,
                name: 'Python для начинающих',
                alias: 'python-dlya-nachinayushchikh',
                price: 25000,
                duration: 3,
                durationType: 'месяца',
                description: '<p>Изучите Python с нуля и станьте востребованным разработчиком. Курс включает основы программирования, работу с данными и создание первых приложений.</p>',
                category: 'programming',
                level: 'beginner',
                teacher: 'Иванов Иван Иванович',
                active: true,
                featured: true,
                createdAt: '2024-01-15'
            },
            {
                id: 2,
                name: 'UI/UX Дизайн с нуля',
                alias: 'ui-ux-design-s-nulya',
                price: 35000,
                duration: 4,
                durationType: 'месяца',
                description: '<p>Освойте профессии UI/UX дизайнера. Научитесь создавать удобные и красивые интерфейсы для веб-приложений и мобильных устройств.</p>',
                category: 'design',
                level: 'intermediate',
                teacher: 'Петрова Анна Сергеевна',
                active: true,
                featured: false,
                createdAt: '2024-02-20'
            },
            {
                id: 3,
                name: 'Интернет-маркетинг',
                alias: 'internet-marketing',
                price: 28000,
                duration: 2.5,
                durationType: 'месяца',
                description: '<p>Комплексное обучение интернет-маркетингу. SMM, контекстная реклама, email-маркетинг и аналитика результатов.</p>',
                category: 'marketing',
                level: 'beginner',
                teacher: 'Сидоров Алексей Петрович',
                active: true,
                featured: true,
                createdAt: '2024-03-10'
            }
        ];
    },

    // Данные по умолчанию для страниц
    getDefaultPages() {
        return [
            {
                id: 1,
                title: 'О нас',
                alias: 'o-nas',
                content: '<p>Учебный центр «ПРОФОБУЧЕНИЕ» — это современный образовательный центр с государственной лицензией. Мы предлагаем качественное обучение по востребованным направлениям.</p><h3>Наши преимущества:</h3><ul><li>Опытные преподаватели-практики</li><li>Современная материальная база</li><li>Государственная лицензия</li><li>Трудоустройство выпускников</li></ul>',
                active: true,
                createdAt: '2024-01-01'
            },
            {
                id: 2,
                title: 'Контакты',
                alias: 'kontakty',
                content: '<p><strong>Адрес:</strong> г. Москва, ул. Примерная, д. 123</p><p><strong>Телефон:</strong> +7 (495) 123-45-67</p><p><strong>Email:</strong> info@profobuchenie.ru</p><p><strong>Режим работы:</strong> Пн-Пт: 9:00 - 20:00, Сб-Вс: 10:00 - 18:00</p>',
                active: true,
                createdAt: '2024-01-01'
            },
            {
                id: 3,
                title: 'Расписание',
                alias: 'raspisanie',
                content: '<p>Расписание занятий формируется еженедельно. Актуальное расписание всегда доступно в личном кабинете студента.</p><p>Мы предлагаем занятия в утреннее, дневное и вечернее время для удобства занятых людей.</p>',
                active: true,
                createdAt: '2024-01-15'
            }
        ];
    },

    // Генерация уникального ID
    generateId() {
        return Date.now();
    },

    // === КУРСЫ ===

    getAllCourses() {
        try {
            return JSON.parse(localStorage.getItem(this.KEYS.COURSES)) || [];
        } catch {
            return [];
        }
    },

    getCourseById(id) {
        const courses = this.getAllCourses();
        return courses.find(c => c.id === parseInt(id));
    },

    saveCourse(course) {
        const courses = this.getAllCourses();
        const index = courses.findIndex(c => c.id === course.id);
        
        if (index >= 0) {
            courses[index] = course;
        } else {
            course.id = this.generateId();
            course.createdAt = new Date().toISOString().split('T')[0];
            courses.push(course);
        }
        
        localStorage.setItem(this.KEYS.COURSES, JSON.stringify(courses));
        return course;
    },

    deleteCourse(id) {
        let courses = this.getAllCourses();
        courses = courses.filter(c => c.id !== parseInt(id));
        localStorage.setItem(this.KEYS.COURSES, JSON.stringify(courses));
    },

    // === СТРАНИЦЫ ===

    getAllPages() {
        try {
            return JSON.parse(localStorage.getItem(this.KEYS.PAGES)) || [];
        } catch {
            return [];
        }
    },

    getPageById(id) {
        const pages = this.getAllPages();
        return pages.find(p => p.id === parseInt(id));
    },

    getPageByAlias(alias) {
        const pages = this.getAllPages();
        return pages.find(p => p.alias === alias);
    },

    savePage(page) {
        const pages = this.getAllPages();
        const index = pages.findIndex(p => p.id === page.id);
        
        if (index >= 0) {
            pages[index] = page;
        } else {
            page.id = this.generateId();
            page.createdAt = new Date().toISOString().split('T')[0];
            pages.push(page);
        }
        
        localStorage.setItem(this.KEYS.PAGES, JSON.stringify(pages));
        return page;
    },

    deletePage(id) {
        let pages = this.getAllPages();
        pages = pages.filter(p => p.id !== parseInt(id));
        localStorage.setItem(this.KEYS.PAGES, JSON.stringify(pages));
    },

    // === СТАТИСТИКА ===

    getStats() {
        const courses = this.getAllCourses();
        const pages = this.getAllPages();
        
        return {
            totalCourses: courses.length,
            activeCourses: courses.filter(c => c.active).length,
            featuredCourses: courses.filter(c => c.featured).length,
            draftCourses: courses.filter(c => !c.active).length,
            totalPages: pages.length,
            activePages: pages.filter(p => p.active).length
        };
    }
};

// Инициализация при загрузке
EduStore.init();
