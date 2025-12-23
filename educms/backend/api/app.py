"""
API для EduCenter CMS
"""

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))

from flask import Flask, request, jsonify
from flask_cors import CORS
from database import get_connection, init_db, seed_data
import json

app = Flask(__name__)
CORS(app)

# Инициализация БД при запуске
init_db()
seed_data()

# ============== КУРСЫ ==============

@app.route('/api/courses', methods=['GET'])
def get_courses():
    """Получить все курсы"""
    conn = get_connection()
    cursor = conn.cursor()
    
    # Фильтры
    category = request.args.get('category')
    active = request.args.get('active')
    featured = request.args.get('featured')
    search = request.args.get('search')
    
    query = 'SELECT * FROM courses WHERE 1=1'
    params = []
    
    if category:
        query += ' AND category = ?'
        params.append(category)
    if active is not None:
        query += ' AND active = ?'
        params.append(1 if active == '1' else 0)
    if featured == '1':
        query += ' AND featured = 1'
    if search:
        query += ' AND (name LIKE ? OR description LIKE ?)'
        params.extend([f'%{search}%', f'%{search}%'])
    
    query += ' ORDER BY created_at DESC'
    
    cursor.execute(query, params)
    courses = [dict(row) for row in cursor.fetchall()]
    
    conn.close()
    return jsonify(courses)

@app.route('/api/courses/<int:course_id>', methods=['GET'])
def get_course(course_id):
    """Получить курс по ID"""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM courses WHERE id = ?', (course_id,))
    course = cursor.fetchone()
    conn.close()
    
    if course:
        return jsonify(dict(course))
    return jsonify({'error': 'Курс не найден'}), 404

@app.route('/api/courses', methods=['POST'])
def create_course():
    """Создать новый курс"""
    data = request.json
    
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO courses (name, description, duration, price, image_url, category, featured, active)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    ''', (
        data['name'], data.get('description'), data.get('duration'),
        data.get('price', 0), data.get('image_url', ''),
        data.get('category', ''), data.get('featured', 0), data.get('active', 1)
    ))
    
    course_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return jsonify({'id': course_id, 'message': 'Курс создан'}), 201

@app.route('/api/courses/<int:course_id>', methods=['PUT'])
def update_course(course_id):
    """Обновить курс"""
    data = request.json
    
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        UPDATE courses SET name=?, description=?, duration=?, price=?, 
        image_url=?, category=?, featured=?, active=?, updated_at=CURRENT_TIMESTAMP
        WHERE id=?
    ''', (
        data['name'], data.get('description'), data.get('duration'),
        data.get('price', 0), data.get('image_url', ''),
        data.get('category', ''), data.get('featured', 0), data.get('active', 1),
        course_id
    ))
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Курс обновлён'})

@app.route('/api/courses/<int:course_id>', methods=['DELETE'])
def delete_course(course_id):
    """Удалить курс"""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM courses WHERE id = ?', (course_id,))
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Курс удалён'})

# ============== СТРАНИЦЫ ==============

@app.route('/api/pages', methods=['GET'])
def get_pages():
    """Получить все страницы"""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM pages ORDER BY created_at DESC')
    pages = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify(pages)

@app.route('/api/pages/<int:page_id>', methods=['GET'])
def get_page(page_id):
    """Получить страницу по ID"""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM pages WHERE id = ?', (page_id,))
    page = cursor.fetchone()
    conn.close()
    
    if page:
        return jsonify(dict(page))
    return jsonify({'error': 'Страница не найдена'}), 404

@app.route('/api/pages/alias/<alias>', methods=['GET'])
def get_page_by_alias(alias):
    """Получить страницу по алиасу"""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM pages WHERE alias = ? AND active = 1', (alias,))
    page = cursor.fetchone()
    conn.close()
    
    if page:
        return jsonify(dict(page))
    return jsonify({'error': 'Страница не найдена'}), 404

@app.route('/api/pages', methods=['POST'])
def create_page():
    """Создать новую страницу"""
    data = request.json
    
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO pages (title, alias, content, meta_description, active)
        VALUES (?, ?, ?, ?, ?)
    ''', (
        data['title'], data['alias'], data.get('content', ''),
        data.get('meta_description', ''), data.get('active', 1)
    ))
    
    page_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return jsonify({'id': page_id, 'message': 'Страница создана'}), 201

@app.route('/api/pages/<int:page_id>', methods=['PUT'])
def update_page(page_id):
    """Обновить страницу"""
    data = request.json
    
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        UPDATE pages SET title=?, alias=?, content=?, meta_description=?,
        active=?, updated_at=CURRENT_TIMESTAMP WHERE id=?
    ''', (
        data['title'], data['alias'], data.get('content', ''),
        data.get('meta_description', ''), data.get('active', 1), page_id
    ))
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Страница обновлена'})

@app.route('/api/pages/<int:page_id>', methods=['DELETE'])
def delete_page(page_id):
    """Удалить страницу"""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM pages WHERE id = ?', (page_id,))
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Страница удалена'})

# ============== НОВОСТИ ==============

@app.route('/api/news', methods=['GET'])
def get_news():
    """Получить все новости"""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM news ORDER BY created_at DESC')
    news = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return jsonify(news)

@app.route('/api/news/<int:news_id>', methods=['GET'])
def get_news_item(news_id):
    """Получить новость по ID"""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM news WHERE id = ?', (news_id,))
    news = cursor.fetchone()
    conn.close()
    
    if news:
        return jsonify(dict(news))
    return jsonify({'error': 'Новость не найдена'}), 404

@app.route('/api/news/alias/<alias>', methods=['GET'])
def get_news_by_alias(alias):
    """Получить новость по алиасу"""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM news WHERE alias = ? AND active = 1', (alias,))
    news = cursor.fetchone()
    conn.close()
    
    if news:
        return jsonify(dict(news))
    return jsonify({'error': 'Новость не найдена'}), 404

@app.route('/api/news', methods=['POST'])
def create_news():
    """Создать новость"""
    data = request.json
    
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO news (title, alias, content, active)
        VALUES (?, ?, ?, ?)
    ''', (
        data['title'], data['alias'], data.get('content', ''),
        data.get('active', 1)
    ))
    
    news_id = cursor.lastrowid
    conn.commit()
    conn.close()
    
    return jsonify({'id': news_id, 'message': 'Новость создана'}), 201

@app.route('/api/news/<int:news_id>', methods=['PUT'])
def update_news(news_id):
    """Обновить новость"""
    data = request.json
    
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        UPDATE news SET title=?, alias=?, content=?,
        active=?, updated_at=CURRENT_TIMESTAMP WHERE id=?
    ''', (
        data['title'], data['alias'], data.get('content', ''),
        data.get('active', 1), news_id
    ))
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Новость обновлена'})

@app.route('/api/news/<int:news_id>', methods=['DELETE'])
def delete_news(news_id):
    """Удалить новость"""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('DELETE FROM news WHERE id = ?', (news_id,))
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Новость удалена'})

# ============== ЗАЯВКИ ==============

@app.route('/api/applications', methods=['POST'])
def create_application():
    """Создать заявку"""
    data = request.json
    
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute('''
        INSERT INTO applications (name, phone, email, course, form_type)
        VALUES (?, ?, ?, ?, ?)
    ''', (
        data['name'], data['phone'], data.get('email'),
        data.get('course', ''), data.get('form_type', 'Заявка')
    ))
    
    # Обновляем статистику
    cursor.execute('''
        UPDATE site_stats SET total_applications = total_applications + 1,
        updated_at=CURRENT_TIMESTAMP WHERE id=1
    ''')
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Заявка принята'}), 201

# ============== НАСТРОЙКИ ==============

@app.route('/api/settings', methods=['GET'])
def get_settings():
    """Получить настройки сайта"""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM settings ORDER BY id DESC LIMIT 1')
    settings = cursor.fetchone()
    conn.close()
    
    if settings:
        return jsonify(dict(settings))
    return jsonify({
        'site_name': 'EduCenter',
        'site_description': '',
        'phone': '',
        'email': '',
        'copyright_text': ''
    })

@app.route('/api/settings', methods=['PUT'])
def update_settings():
    """Обновить настройки сайта"""
    data = request.json
    
    conn = get_connection()
    cursor = conn.cursor()
    
    # Проверяем, есть ли запись в таблице
    cursor.execute('SELECT COUNT(*) FROM settings')
    if cursor.fetchone()[0] == 0:
        # Создаём первую запись
        cursor.execute('''
            INSERT INTO settings (site_name, site_description, logo_url, favicon_url,
            phone, email, address, working_hours, vk_link, telegram_link, copyright_text)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data.get('site_name', 'EduCenter'),
            data.get('site_description', ''),
            data.get('logo_url', ''),
            data.get('favicon_url', ''),
            data.get('phone', ''),
            data.get('email', ''),
            data.get('address', ''),
            data.get('working_hours', ''),
            data.get('vk_link', ''),
            data.get('telegram_link', ''),
            data.get('copyright_text', '')
        ))
    else:
        # Обновляем существующую запись (обновляем последнюю запись)
        cursor.execute('''
            UPDATE settings SET site_name=?, site_description=?, logo_url=?, favicon_url=?,
            phone=?, email=?, address=?, working_hours=?, vk_link=?, telegram_link=?,
            copyright_text=?, updated_at=CURRENT_TIMESTAMP WHERE id = (SELECT MAX(id) FROM settings)
        ''', (
            data.get('site_name', 'EduCenter'),
            data.get('site_description', ''),
            data.get('logo_url', ''),
            data.get('favicon_url', ''),
            data.get('phone', ''),
            data.get('email', ''),
            data.get('address', ''),
            data.get('working_hours', ''),
            data.get('vk_link', ''),
            data.get('telegram_link', ''),
            data.get('copyright_text', '')
        ))
    
    conn.commit()
    conn.close()
    
    return jsonify({'message': 'Настройки обновлены'})

# ============== СТАТИСТИКА ==============

@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Получить статистику"""
    conn = get_connection()
    cursor = conn.cursor()
    
    cursor.execute('SELECT COUNT(*) as total FROM courses WHERE active = 1')
    total_courses = cursor.fetchone()[0]
    
    cursor.execute('SELECT COUNT(*) as active FROM courses WHERE active = 1 AND featured = 1')
    featured = cursor.fetchone()[0]
    
    cursor.execute('SELECT COUNT(*) as total FROM pages WHERE active = 1')
    total_pages = cursor.fetchone()[0]
    
    cursor.execute('SELECT COUNT(*) as total FROM applications')
    total_apps = cursor.fetchone()[0]
    
    conn.close()
    
    return jsonify({
        'totalCourses': total_courses,
        'featuredCourses': featured,
        'totalPages': total_pages,
        'totalApplications': total_apps
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
