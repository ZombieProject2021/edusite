/**
 * EduCMS Courses Module
 * Управление курсами
 */

const CoursesManager = {
    // Таблица курсов
    tableBody: null,

    // Инициализация страницы списка курсов
    initListPage() {
        this.tableBody = document.getElementById('coursesTableBody');
        if (this.tableBody) {
            this.renderCourses();
            this.initFilters();
            this.bindActionButtons();
        }
    },

    // Рендер списка курсов
    renderCourses() {
        if (!this.tableBody) return;
        
        const courses = EduStore.getAllCourses();
        
        if (courses.length === 0) {
            this.tableBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center; padding: 60px 20px;">
                        <div class="empty-state">
                            <div class="empty-state-icon">
                                <span class="material-icons-outlined">auto_stories</span>
                            </div>
                            <div class="empty-state-title">Нет курсов</div>
                            <div class="empty-state-text">Добавьте первый курс, чтобы начать работу</div>
                            <a href="/admin/courses/new/" class="btn btn-primary">
                                <span class="material-icons-outlined">add</span>
                                Добавить курс
                            </a>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        // Обновление статистики
        const stats = EduStore.getStats();
        document.getElementById('statTotal') && (document.getElementById('statTotal').textContent = stats.totalCourses);
        document.getElementById('statActive') && (document.getElementById('statActive').textContent = stats.activeCourses);
        document.getElementById('statFeatured') && (document.getElementById('statFeatured').textContent = stats.featuredCourses);
        document.getElementById('statDraft') && (document.getElementById('statDraft').textContent = stats.draftCourses);

        // Рендер курсов
        this.tableBody.innerHTML = courses.map(course => this.renderCourseRow(course)).join('');
        
        // Привязка событий кнопок
        this.bindActionButtons();
    },

    // Рендер одной строки курса
    renderCourseRow(course) {
        const categoryLabels = {
            programming: 'Программирование',
            design: 'Дизайн',
            marketing: 'Маркетинг',
            management: 'Менеджмент',
            languages: 'Языки',
            business: 'Бизнес'
        };

        const categoryIcons = {
            programming: 'code',
            design: 'palette',
            marketing: 'trending_up',
            management: 'business',
            languages: 'translate',
            business: 'work'
        };

        const statusBadge = course.active 
            ? '<span class="badge badge-active">Активен</span>'
            : '<span class="badge badge-draft">Черновик</span>';

        const featuredBadge = course.featured 
            ? '<span class="featured-badge">★ Рекомендуемый</span>' 
            : '';

        const icon = categoryIcons[course.category] || 'auto_stories';

        return `
            <tr data-category="${course.category}" data-status="${course.active ? 'active' : 'draft'}">
                <td>
                    <div class="course-info">
                        <div class="course-icon">
                            <span class="material-icons-outlined">${icon}</span>
                        </div>
                        <div>
                            <div class="course-name">${this.escapeHtml(course.name)}</div>
                            <div class="course-alias">/courses/${course.alias}/</div>
                        </div>
                    </div>
                </td>
                <td><span class="price">${EduApp.formatPrice(course.price)}</span></td>
                <td>${course.duration} ${course.durationType || 'месяцев'}</td>
                <td>${statusBadge}${featuredBadge}</td>
                <td>
                    <div class="actions-cell">
                        <button class="btn-icon" title="Редактировать" onclick="CoursesManager.editCourse(${course.id})">
                            <span class="material-icons-outlined">edit</span>
                        </button>
                        <button class="btn-icon" title="Просмотр" onclick="CoursesManager.viewCourse(${course.id})">
                            <span class="material-icons-outlined">visibility</span>
                        </button>
                        <button class="btn-icon delete" title="Удалить" onclick="CoursesManager.deleteCourse(${course.id})">
                            <span class="material-icons-outlined">delete</span>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    },

    // Привязка кнопок действий
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
        const categoryFilter = document.getElementById('categoryFilter');
        const statusFilter = document.getElementById('statusFilter');

        if (searchInput) {
            searchInput.addEventListener('input', () => this.filterCourses());
        }
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => this.filterCourses());
        }
        if (statusFilter) {
            statusFilter.addEventListener('change', () => this.filterCourses());
        }
    },

    filterCourses() {
        const searchTerm = (document.getElementById('searchInput')?.value || '').toLowerCase();
        const categoryFilter = document.getElementById('categoryFilter')?.value || '';
        const statusFilter = document.getElementById('statusFilter')?.value || '';

        const rows = this.tableBody?.querySelectorAll('tr[data-category]') || [];
        
        rows.forEach(row => {
            const courseName = row.querySelector('.course-name')?.textContent.toLowerCase() || '';
            const courseCategory = row.dataset.category;
            const courseStatus = row.dataset.status;

            let show = true;

            if (searchTerm && !courseName.includes(searchTerm)) show = false;
            if (categoryFilter && courseCategory !== categoryFilter) show = false;
            if (statusFilter && courseStatus !== statusFilter) show = false;

            row.style.display = show ? '' : 'none';
        });
    },

    // Действия
    editCourse(id) {
        window.location.href = `/admin/courses/edit/?id=${id}`;
    },

    viewCourse(id) {
        window.open(`/courses/${EduStore.getCourseById(id)?.alias || id}/`, '_blank');
    },

    deleteCourse(id) {
        const course = EduStore.getCourseById(id);
        if (!course) return;

        if (EduApp.confirmAction(`Вы уверены, что хотите удалить курс "${course.name}"?`)) {
            EduStore.deleteCourse(id);
            this.renderCourses();
            EduApp.showAlert('success', 'Курс успешно удалён');
        }
    },

    // Инициализация страницы создания/редактирования
    initFormPage() {
        const form = document.getElementById('courseForm');
        const nameInput = document.getElementById('courseName');
        const aliasInput = document.getElementById('courseAlias');
        const quillContainer = document.getElementById('editor');

        // Инициализация Quill если есть
        if (quillContainer && typeof Quill !== 'undefined') {
            window.courseQuill = new Quill('#editor', {
                theme: 'snow',
                placeholder: 'Напишите подробное описание курса здесь...',
                modules: {
                    toolbar: [
                        [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                        ['bold', 'italic', 'underline', 'strike'],
                        [{ 'color': [] }, { 'background': [] }],
                        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                        [{ 'indent': '-1'}, { 'indent': '+1' }],
                        [{ 'align': [] }],
                        ['link', 'image', 'video'],
                        ['blockquote', 'code-block'],
                        ['clean']
                    ]
                }
            });
        }

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
                this.saveCourse(false);
            });
        }

        // Кнопка черновика
        const draftBtn = document.getElementById('saveDraftBtn');
        if (draftBtn) {
            draftBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.saveCourse(true);
            });
        }

        // Загрузка данных для редактирования
        const editId = EduApp.getUrlParam('id');
        if (editId) {
            this.loadCourseForEdit(editId);
        }
    },

    loadCourseForEdit(id) {
        const course = EduStore.getCourseById(id);
        if (!course) {
            EduApp.showAlert('error', 'Курс не найден');
            setTimeout(() => window.location.href = '/admin/courses/', 1500);
            return;
        }

        // Заголовок страницы
        document.getElementById('pageTitle') && (document.getElementById('pageTitle').textContent = 'Редактирование курса');
        document.getElementById('breadcrumbCurrent') && (document.getElementById('breadcrumbCurrent').textContent = 'Редактирование');
        
        // Заполнение формы
        document.getElementById('courseName') && (document.getElementById('courseName').value = course.name || '');
        document.getElementById('courseAlias') && (document.getElementById('courseAlias').value = course.alias || '');
        document.getElementById('courseAlias').dataset.manual = 'true';
        document.getElementById('coursePrice') && (document.getElementById('coursePrice').value = course.price || '');
        document.getElementById('courseDuration') && (document.getElementById('courseDuration').value = course.duration || '');
        document.getElementById('courseCategory') && (document.getElementById('courseCategory').value = course.category || '');
        document.getElementById('courseLevel') && (document.getElementById('courseLevel').value = course.level || '');
        document.getElementById('courseTeacher') && (document.getElementById('courseTeacher').value = course.teacher || '');
        
        // Чекбоксы
        document.getElementById('courseActive') && (document.getElementById('courseActive').checked = course.active !== false);
        document.getElementById('courseFeatured') && (document.getElementById('courseFeatured').checked = course.featured === true);

        // Quill
        if (window.courseQuill && course.description) {
            window.courseQuill.root.innerHTML = course.description;
        }
    },

    saveCourse(asDraft = false) {
        const course = {
            id: parseInt(EduApp.getUrlParam('id')) || EduStore.generateId(),
            name: document.getElementById('courseName')?.value?.trim(),
            alias: document.getElementById('courseAlias')?.value?.trim(),
            price: parseFloat(document.getElementById('coursePrice')?.value) || 0,
            duration: parseFloat(document.getElementById('courseDuration')?.value) || 0,
            durationType: 'месяца',
            description: window.courseQuill?.root?.innerHTML || '',
            category: document.getElementById('courseCategory')?.value || '',
            level: document.getElementById('courseLevel')?.value || '',
            teacher: document.getElementById('courseTeacher')?.value || '',
            active: asDraft ? false : (document.getElementById('courseActive')?.checked ?? true),
            featured: document.getElementById('courseFeatured')?.checked || false
        };

        // Валидация
        if (!course.name || !course.alias || !course.price || !course.duration) {
            EduApp.showAlert('error', 'Заполните все обязательные поля');
            return;
        }

        try {
            EduStore.saveCourse(course);
            EduApp.showAlert('success', asDraft ? 'Черновик сохранён' : 'Курс успешно сохранён');
            
            setTimeout(() => {
                window.location.href = '/admin/courses/';
            }, 1500);
        } catch (error) {
            console.error('Error saving course:', error);
            EduApp.showAlert('error', 'Ошибка при сохранении курса');
        }
    },

    // Экранирование HTML
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('coursesTableBody')) {
        CoursesManager.initListPage();
    }
    if (document.getElementById('courseForm')) {
        CoursesManager.initFormPage();
    }
});
