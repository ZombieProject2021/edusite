/**
 * Frontend API клиент для EduCenter CMS
 * Заменяет localStorage на API вызовы к серверу
 */

class StoreAPI {
    constructor(apiUrl = null) {
        // Use provided URL, or try to detect from environment/window, or use default
        if (apiUrl === null) {
            // Check for global API URL configuration
            if (window.__API_URL__) {
                this.apiUrl = window.__API_URL__;
            } else {
                // Default to relative path (works when frontend and backend are on same domain)
                this.apiUrl = '/api';
            }
        } else {
            this.apiUrl = apiUrl;
        }
        this.cache = {
            courses: null,
            pages: null,
            news: null
        };
    }

    // ============ КУРСЫ ============

    async getCourses(filters = {}) {
        const params = new URLSearchParams(filters);
        const response = await fetch(`${this.apiUrl}/courses?${params}`);
        return await response.json();
    }

    async getCourse(id) {
        const response = await fetch(`${this.apiUrl}/courses/${id}`);
        if (!response.ok) return null;
        return await response.json();
    }

    async createCourse(data) {
        const response = await fetch(`${this.apiUrl}/courses`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await response.json();
    }

    async updateCourse(id, data) {
        const response = await fetch(`${this.apiUrl}/courses/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await response.json();
    }

    async deleteCourse(id) {
        const response = await fetch(`${this.apiUrl}/courses/${id}`, {
            method: 'DELETE'
        });
        return await response.json();
    }

    // ============ СТРАНИЦЫ ============

    async getPages() {
        const response = await fetch(`${this.apiUrl}/pages`);
        return await response.json();
    }

    async getPage(id) {
        const response = await fetch(`${this.apiUrl}/pages/${id}`);
        if (!response.ok) return null;
        return await response.json();
    }

    async getPageByAlias(alias) {
        const response = await fetch(`${this.apiUrl}/pages/alias/${alias}`);
        if (!response.ok) return null;
        return await response.json();
    }

    async createPage(data) {
        const response = await fetch(`${this.apiUrl}/pages`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await response.json();
    }

    async updatePage(id, data) {
        const response = await fetch(`${this.apiUrl}/pages/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await response.json();
    }

    async deletePage(id) {
        const response = await fetch(`${this.apiUrl}/pages/${id}`, {
            method: 'DELETE'
        });
        return await response.json();
    }

    // ============ НОВОСТИ ============

    async getNews() {
        const response = await fetch(`${this.apiUrl}/news`);
        return await response.json();
    }

    async getNewsItem(id) {
        const response = await fetch(`${this.apiUrl}/news/${id}`);
        if (!response.ok) return null;
        return await response.json();
    }

    async createNews(data) {
        const response = await fetch(`${this.apiUrl}/news`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await response.json();
    }

    async updateNews(id, data) {
        const response = await fetch(`${this.apiUrl}/news/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await response.json();
    }

    async deleteNews(id) {
        const response = await fetch(`${this.apiUrl}/news/${id}`, {
            method: 'DELETE'
        });
        return await response.json();
    }

    // ============ ЗАЯВКИ ============

    async submitApplication(data) {
        const response = await fetch(`${this.apiUrl}/applications`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await response.json();
    }

    // ============ СТАТИСТИКА ============

    async getStats() {
        const response = await fetch(`${this.apiUrl}/stats`);
        return await response.json();
    }

    // ============ НАСТРОЙКИ ============

    async getSettings() {
        const response = await fetch(`${this.apiUrl}/settings`);
        return await response.json();
    }

    async updateSettings(data) {
        const response = await fetch(`${this.apiUrl}/settings`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        return await response.json();
    }
}

// Создаём глобальный экземпляр
window.StoreAPI = StoreAPI;
