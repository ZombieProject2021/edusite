"""
База данных EduCenter CMS
Поддерживает SQLite (для разработки) и MySQL (для production)
"""

import sqlite3
import os

# Настройки подключения к БД
DB_CONFIG = {
    'driver': 'sqlite',  # 'sqlite' или 'mysql'
    'database': 'educms.db',
    # Для MySQL раскомментировать и заполнить:
    # 'host': 'localhost',
    # 'user': 'root',
    # 'password': 'your_password',
    # 'database': 'educms'
}

def get_connection():
    """Получить соединение с базой данных"""
    if DB_CONFIG['driver'] == 'sqlite':
        conn = sqlite3.connect(DB_CONFIG['database'])
        conn.row_factory = sqlite3.Row
        return conn
    else:
        import pymysql
        return pymysql.connect(
            host=DB_CONFIG['host'],
            user=DB_CONFIG['user'],
            password=DB_CONFIG['password'],
            database=DB_CONFIG['database'],
            cursorclass=pymysql.cursors.DictCursor
        )

def init_db():
    """Инициализация базы данных"""
    conn = get_connection()
    cursor = conn.cursor()
    
    # Таблица курсов
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS courses (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            description TEXT,
            duration TEXT,
            price REAL,
            image_url TEXT,
            category TEXT,
            featured INTEGER DEFAULT 0,
            active INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Таблица страниц
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS pages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            alias TEXT UNIQUE NOT NULL,
            content TEXT,
            meta_description TEXT,
            active INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Таблица заявок
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS applications (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            phone TEXT NOT NULL,
            email TEXT,
            course TEXT,
            form_type TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Таблица статистики сайта
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS site_stats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            total_courses INTEGER DEFAULT 0,
            total_applications INTEGER DEFAULT 0,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Таблица новостей
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS news (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            alias TEXT UNIQUE NOT NULL,
            content TEXT,
            image_url TEXT,
            active INTEGER DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Таблица настроек сайта
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS settings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            site_name TEXT DEFAULT 'EduCenter',
            site_description TEXT,
            logo_url TEXT,
            favicon_url TEXT,
            phone TEXT,
            email TEXT,
            address TEXT,
            working_hours TEXT,
            vk_link TEXT,
            telegram_link TEXT,
            copyright_text TEXT,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    # Добавляем настройки по умолчанию, если их нет
    cursor.execute('SELECT COUNT(*) FROM settings')
    if cursor.fetchone()[0] == 0:
        cursor.execute('''
            INSERT INTO settings (site_name, site_description, phone, email, copyright_text)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            'EduCenter',
            'Учебный центр дополнительного профессионального образования',
            '8 (800) 444-80-89',
            'info@profobuchenie.ru',
            '© 2024 EduCenter. Все права защищены.'
        ))
    
    conn.commit()
    conn.close()
    print("База данных инициализирована")

def seed_data():
    """Заполнение базы данных начальными данными"""
    conn = get_connection()
    cursor = conn.cursor()
    
    # Проверяем, есть ли уже данные
    cursor.execute('SELECT COUNT(*) FROM courses')
    if cursor.fetchone()[0] == 0:
        
        # Добавляем курсы
        courses = [
            ('Обучение охране труда руководителей (40 часов)', 
             'Программа повышения квалификации для руководителей и специалистов организаций',
             '40 часов', 6900, 'linear-gradient(135deg, #E74C3C 0%, #C0392B 100%)',
             'otrana-truda', 1, 1),
            ('Пожарно-технический минимум (16 часов)',
             'Обучение пожарно-техническому минимуму для руководителей и работников',
             '16 часов', 4500, 'linear-gradient(135deg, #F39C12 0%, #E67E22 100%)',
             'ppo', 1, 1),
            ('Электробезопасность - 2 группа допуска',
             'Обучение электротехнического персонала',
             '72 часа', 7200, 'linear-gradient(135deg, #27AE60 0%, #2ECC71 100%)',
             'elektrobezopasnost', 0, 1),
            ('Безопасные методы работ на высоте',
             'Обучение согласно Приказу 155н',
             '24 часа', 8500, 'linear-gradient(135deg, #9B59B6 0%, #8E44AD 100%)',
             'vysota', 0, 1),
            ('Промышленная безопасность',
             'Обучение для опасных производственных объектов',
             '40 часов', 9800, 'linear-gradient(135deg, #3498DB 0%, #2980B9 100%)',
             'prombez', 0, 1),
            ('Обращение с отходами I-IV класса',
             'Обучение для ответственных за обращение с отходами',
             '112 часов', 6500, 'linear-gradient(135deg, #1ABC9C 0%, #16A085 100%)',
             'ecology', 0, 1),
        ]
        
        cursor.executemany('''
            INSERT INTO courses (name, description, duration, price, image_url, category, featured, active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ''', courses)
        
        # Добавляем страницы
        pages = [
            ('О центре', 'about', 
             '<h2>Профессиональное обучение с 2017 года</h2><p>Учебный центр «ПРОФОБУЧЕНИЕ» — команда экспертов с многолетним опытом работы в сфере охраны труда.</p>',
             'Учебный центр ПРОФОБУЧЕНИЕ - лицензированное образовательное учреждение', 1),
            ('Преподаватели', 'teachers',
             '<h2>Наши преподаватели</h2><p>Практикующие эксперты с многолетним опытом работы.</p>',
             'Преподаватели учебного центра ПРОФОБУЧЕНИЕ', 1),
            ('Отзывы', 'reviews',
             '<h2>Отзывы выпускников</h2><p>Мнение реальных людей, прошедших обучение.</p>',
             'Отзывы о курсах ПРОФОБУЧЕНИЕ', 1),
            ('Контакты', 'contacts',
             '<h2>Контакты</h2><p>Телефон: 8 (800) 444-80-89</p><p>Email: info@profobuchenie.ru</p>',
             'Контакты учебного центра', 1),
        ]
        
        cursor.executemany('''
            INSERT INTO pages (title, alias, content, meta_description, active)
            VALUES (?, ?, ?, ?, ?)
        ''', pages)
        
        # Статистика
        cursor.execute('INSERT INTO site_stats (total_courses, total_applications) VALUES (6, 0)')
        
        conn.commit()
        print("Начальные данные добавлены")
    
    conn.close()

if __name__ == '__main__':
    init_db()
    seed_data()
