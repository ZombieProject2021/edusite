/**
 * EduCMS Pages Module
 * Управление страницами сайта
 */

const PagesManager = {
    tableBody: null,

    // Инициализация страницы списка страниц
    initListPage() {
        this.tableBody = document.getElementById('pagesTableBody');
        if (this.tableBody) {
            this.renderPages();
            this.initFilters();
            this.bindActionButtons();
        }
    },

    // Рендер списка страниц
    renderPages() {
        if (!this.tableBody) return;

        const pages = EduStore.getAllPages();

        if (pages.length === 0) {
            this.tableBody.innerHTML = `
                <tr>
                    <td colspan="4" style="text-align: center; padding: 60px 20px;">
                        <div class="empty-state">
                            <div class="empty-state-icon">
                                <span class="material-icons-outlined">article</span>
                            </div>
                            <div class="empty-state-title">Нет страниц</div>
                            <div class="empty-state-text">Добавьте первую страницу, чтобы начать работу</div>
                            <a href="/admin/pages/new/" class="btn btn-primary">
                                <span class="material-icons-outlined">add</span>
                                Добавить страницу
                            </a>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        this.tableBody.innerHTML = pages.map(page => this.renderPageRow(page)).join('');
        this.bindActionButtons();
    },

    // Рендер одной строки страницы
    renderPageRow(page) {
        const statusBadge = page.active 
            ? '<span class="badge badge-active">Опубликована</span>'
            : '<span class="badge badge-draft">Черновик</span>';

        return `
            <tr data-status="${page.active ? 'active' : 'draft'}">
                <td>
                    <div class="course-info">
                        <div class="course-icon" style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);">
                            <span class="material-icons-outlined">article</span>
                        </div>
                        <div>
                            <div class="course-name">${this.escapeHtml(page.title)}</div>
                            <div class="course-alias">/${page.alias}/</div>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="page-content-preview">${this.getContentPreview(page.content)}</div>
                </td>
                <td>${statusBadge}</td>
                <td>
                    <div class="actions-cell">
                        <button class="btn-icon" title="Редактировать" onclick="PagesManager.editPage(${page.id})">
                            <span class="material-icons-outlined">edit</span>
                        </button>
                        <button class="btn-icon" title="Просмотр" onclick="PagesManager.viewPage('${page.alias}')">
                            <span class="material-icons-outlined">visibility</span>
                        </button>
                        <button class="btn-icon delete" title="Удалить" onclick="PagesManager.deletePage(${page.id})">
                            <span class="material-icons-outlined">delete</span>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    },

    // Предпросмотр контента
    getContentPreview(html) {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        const text = tmp.textContent || tmp.innerText || '';
        return text.length > 80 ? text.substring(0, 80) + '...' : text;
    },

    // Привязка кнопок
    bindActionButtons() {
        document.querySelectorAll('.btn-icon.delete').forEach(btn => {
            btn.onclick = (e) => {
                e.preventDefault();
            };
        });
    },

    // Фильтрация
    initFilters() {
        const searchInput = document.getElementById('searchInput');
        const statusFilter = document.getElementById('statusFilter');

        if (searchInput) {
            searchInput.addEventListener('input', () => this.filterPages());
        }
        if (statusFilter) {
            statusFilter.addEventListener('change', () => this.filterPages());
        }
    },

    filterPages() {
        const searchTerm = (document.getElementById('searchInput')?.value || '').toLowerCase();
        const statusFilter = document.getElementById('statusFilter')?.value || '';

        const rows = this.tableBody?.querySelectorAll('tr[data-status]') || [];
        
        rows.forEach(row => {
            const pageName = row.querySelector('.course-name')?.textContent.toLowerCase() || '';
            const pageStatus = row.dataset.status;

            let show = true;

            if (searchTerm && !pageName.includes(searchTerm)) show = false;
            if (statusFilter && pageStatus !== statusFilter) show = false;

            row.style.display = show ? '' : 'none';
        });
    },

    // Действия
    editPage(id) {
        window.location.href = `/admin/pages/edit/?id=${id}`;
    },

    viewPage(alias) {
        window.open(`/${alias}/`, '_blank');
    },

    deletePage(id) {
        const page = EduStore.getPageById(id);
        if (!page) return;

        if (EduApp.confirmAction(`Вы уверены, что хотите удалить страницу "${page.title}"?`)) {
            EduStore.deletePage(id);
            this.renderPages();
            EduApp.showAlert('success', 'Страница успешно удалена');
        }
    },

    // Инициализация страницы создания/редактирования
    initFormPage() {
        const form = document.getElementById('pageForm');
        const nameInput = document.getElementById('pageTitle');
        const aliasInput = document.getElementById('pageAlias');

        // Автогенерация алиаса
        if (nameInput && aliasInput) {
            nameInput.addEventListener('input', () => {
                if (!aliasInput.dataset.manual) {
                    aliasInput.value = EduApp.generateAlias(nameInput.value);
                }
            });

            aliasInput.addEventListener('input', () => {
                aliasInput.dataset.manual = 'true';
            });
        }

        // Форма
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.savePage(false);
            });
        }

        // Кнопка черновика
        const draftBtn = document.getElementById('saveDraftBtn');
        if (draftBtn) {
            draftBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.savePage(true);
            });
        }

        // Загрузка данных для редактирования
        const editId = EduApp.getUrlParam('id');
        if (editId) {
            this.loadPageForEdit(editId);
        }
    },

    loadPageForEdit(id) {
        const page = EduStore.getPageById(id);
        if (!page) {
            EduApp.showAlert('error', 'Страница не найдена');
            setTimeout(() => window.location.href = '/admin/pages/', 1500);
            return;
        }

        // Заголовок страницы
        document.getElementById('pageTitleText') && (document.getElementById('pageTitleText').textContent = 'Редактирование страницы');
        document.getElementById('breadcrumbCurrent') && (document.getElementById('breadcrumbCurrent').textContent = 'Редактирование');
        
        // Заполнение формы
        document.getElementById('pageTitle') && (document.getElementById('pageTitle').value = page.title || '');
        document.getElementById('pageAlias') && (document.getElementById('pageAlias').value = page.alias || '');
        document.getElementById('pageAlias').dataset.manual = 'true';
        document.getElementById('pageContent') && (document.getElementById('pageContent').value = this.stripHtml(page.content || ''));
        document.getElementById('pageActive') && (document.getElementById('pageActive').checked = page.active !== false);
    },

    savePage(asDraft = false) {
        const page = {
            id: parseInt(EduApp.getUrlParam('id')) || EduStore.generateId(),
            title: document.getElementById('pageTitle')?.value?.trim(),
            alias: document.getElementById('pageAlias')?.value?.trim(),
            content: '<p>' + (document.getElementById('pageContent')?.value?.trim() || '').replace(/\n/g, '</p><p>') + '</p>',
            active: asDraft ? false : (document.getElementById('pageActive')?.checked ?? true)
        };

        // Валидация
        if (!page.title || !page.alias) {
            EduApp.showAlert('error', 'Заполните все обязательные поля');
            return;
        }

        try {
            EduStore.savePage(page);
            EduApp.showAlert('success', asDraft ? 'Черновик сохранён' : 'Страница успешно сохранена');
            
            setTimeout(() => {
                window.location.href = '/admin/pages/';
            }, 1500);
        } catch (error) {
            console.error('Error saving page:', error);
            EduApp.showAlert('error', 'Ошибка при сохранении страницы');
        }
    },

    // Утилиты
    stripHtml(html) {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    },

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('pagesTableBody')) {
        PagesManager.initListPage();
    }
    if (document.getElementById('pageForm')) {
        PagesManager.initFormPage();
    }
});
