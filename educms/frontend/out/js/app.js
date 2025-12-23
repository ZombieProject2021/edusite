/**
 * EduCMS App Module
 * Основная логика приложения и мобильное меню
 */

const EduApp = {
    // Инициализация приложения
    init() {
        this.initMobileMenu();
        this.initTooltips();
        this.initAlerts();
    },

    // Мобильное меню
    initMobileMenu() {
        const menuToggle = document.getElementById('mobileMenuToggle');
        const sidebar = document.querySelector('.sidebar');
        const overlay = document.getElementById('sidebarOverlay');

        if (menuToggle && sidebar) {
            // Toggle menu
            menuToggle.addEventListener('click', () => {
                sidebar.classList.toggle('mobile-open');
                if (overlay) overlay.classList.toggle('active');
                document.body.style.overflow = sidebar.classList.contains('mobile-open') ? 'hidden' : '';
            });

            // Close on overlay click
            if (overlay) {
                overlay.addEventListener('click', () => {
                    sidebar.classList.remove('mobile-open');
                    overlay.classList.remove('active');
                    document.body.style.overflow = '';
                });
            }

            // Close on nav link click (mobile)
            sidebar.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    if (window.innerWidth < 768) {
                        sidebar.classList.remove('mobile-open');
                        if (overlay) overlay.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                });
            });
        }
    },

    // Тултипы
    initTooltips() {
        document.querySelectorAll('[title]').forEach(el => {
            el.removeAttribute('title');
        });
    },

    // Уведомления
    initAlerts() {
        setTimeout(() => {
            document.querySelectorAll('.alert').forEach(alert => {
                alert.style.display = 'none';
            });
        }, 5000);
    },

    showAlert(type, message) {
        const alertId = type === 'success' ? 'alertSuccess' : 'alertError';
        const alertEl = document.getElementById(alertId);
        
        if (alertEl) {
            alertEl.textContent = message || (type === 'success' ? 'Операция выполнена успешно!' : 'Произошла ошибка');
            alertEl.style.display = 'block';
            
            setTimeout(() => {
                alertEl.style.display = 'none';
            }, 5000);
        }
    },

    // Подтверждение действия
    confirmAction(message = 'Вы уверены?') {
        return confirm(message);
    },

    // Форматирование цены
    formatPrice(price) {
        return new Intl.NumberFormat('ru-RU', {
            style: 'currency',
            currency: 'RUB',
            minimumFractionDigits: 0
        }).format(price);
    },

    // Генерация алиаса из строки
    generateAlias(text) {
        if (!text) return '';
        
        const map = {
            'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'ё': 'yo',
            'ж': 'zh', 'з': 'z', 'и': 'i', 'й': 'y', 'к': 'k', 'л': 'l', 'м': 'm',
            'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's', 'т': 't', 'у': 'u',
            'ф': 'f', 'х': 'h', 'ц': 'c', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch',
            'ъ': '', 'ы': 'y', 'ь': '', 'э': 'e', 'ю': 'yu', 'я': 'ya'
        };
        
        return text.toLowerCase()
            .replace(/[а-яё]/g, m => map[m] || m)
            .replace(/[^a-z0-9\s-_]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '');
    },

    // Получение параметра из URL
    getUrlParam(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    },

    // Перенаправление
    redirect(url) {
        window.location.href = url;
    },

    // Загрузка состояния чекбокса
    setCheckbox(name, value) {
        const el = document.querySelector(`[name="${name}"]`);
        if (el) el.checked = value;
    },

    // Получение состояния чекбокса
    getCheckbox(name) {
        const el = document.querySelector(`[name="${name}"]`);
        return el ? el.checked : false;
    }
};

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    EduApp.init();
});
