"""
Миграция данных из localStorage в SQLite/MySQL
"""

import sqlite3
import json

def migrate_from_localstorage():
    """
    Миграция данных из localStorage браузера в базу данных.
    Выполните этот код в консоли браузера, затем сохраните результат в файл.
    """
    
    # Код для выполнения в консоли браузера:
    migration_script = '''
    // Выполнить в консоли браузера на странице админки
    const courses = JSON.parse(localStorage.getItem('educms_courses') || '[]');
    const pages = JSON.parse(localStorage.getItem('educms_pages') || '[]');
    
    console.log('Курсы:', courses);
    console.log('Страницы:', pages);
    
    // Сохранить в файл для миграции
    const data = { courses, pages };
    const blob = new Blob([JSON.stringify(data, null, 2)], {type: 'application/json'});
    // Скачать blob как файл
    '''
    
    print("=" * 60)
    print("ИНСТРУКЦИЯ ПО МИГРАЦИИ")
    print("=" * 60)
    print(migration_script)
    print()
    print("1. Откройте старую версию сайта в браузере")
    print("2. Откройте консоль разработчика (F12)")
    print("3. Выполните код выше")
    print("4. Скачайте файл с данными")
    print("5. Запустите: python migrate.py <файл_с_данными.json>")
    print()

def import_from_json(json_file):
    """Импорт данных из JSON файла"""
    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    conn = sqlite3.connect('educms.db')
    cursor = conn.cursor()
    
    # Импорт курсов
    if 'courses' in data:
        for course in data['courses']:
            try:
                cursor.execute('''
                    INSERT OR REPLACE INTO courses 
                    (id, name, description, duration, price, image_url, category, featured, active)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    course.get('id'), course.get('name'), course.get('description'),
                    course.get('duration'), course.get('price', 0),
                    course.get('image_url', ''), course.get('category', ''),
                    course.get('featured', 0), course.get('active', 1)
                ))
            except Exception as e:
                print(f"Ошибка импорта курса {course.get('name')}: {e}")
    
    # Импорт страниц
    if 'pages' in data:
        for page in data['pages']:
            try:
                cursor.execute('''
                    INSERT OR REPLACE INTO pages
                    (id, title, alias, content, meta_description, active)
                    VALUES (?, ?, ?, ?, ?, ?)
                ''', (
                    page.get('id'), page.get('title'), page.get('alias'),
                    page.get('content', ''), page.get('meta_description', ''),
                    page.get('active', 1)
                ))
            except Exception as e:
                print(f"Ошибка импорта страницы {page.get('title')}: {e}")
    
    conn.commit()
    conn.close()
    
    print(f"Импорт завершён!")

if __name__ == '__main__':
    import sys
    
    if len(sys.argv) > 1:
        import_from_json(sys.argv[1])
    else:
        migrate_from_localstorage()
