#!/usr/bin/env python3
"""
Сервер для приложения Prayer Times.
Обрабатывает статические файлы и API запросы.
"""

import http.server
import socketserver
import json
import urllib.request
import urllib.parse
import os
import sys
from pathlib import Path
from datetime import datetime, timedelta
import re
import time

# Константы
PORT = int(os.environ.get('PORT', 8000))
PRAYER_API_BASE_URL = 'https://api.aladhan.com/v1'

# Хранилище для пользовательских настроек
user_preferences = {}
# Кэш для результатов API
api_cache = {}

class PrayerTimesRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Обработчик HTTP-запросов для Prayer Times."""
    
    def __init__(self, *args, **kwargs):
        # Установка корневой директории для статических файлов
        current_dir = Path(os.path.dirname(os.path.realpath(__file__)))
        super().__init__(*args, directory=str(current_dir), **kwargs)
    
    def do_OPTIONS(self):
        """Обработка OPTIONS-запросов для CORS."""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type')
        self.end_headers()
    
    def add_cors_headers(self):
        """Добавление CORS заголовков."""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type')
    
    def send_json_response(self, data):
        """Отправка JSON-ответа."""
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.add_cors_headers()
        self.end_headers()
        self.wfile.write(json.dumps(data).encode('utf-8'))
    
    def handle_api_request(self, path, query_params):
        """Обработка API запросов."""
        if path == '/api/prayer-times':
            return self.handle_prayer_times(query_params)
        elif path == '/api/prayer-times/monthly':
            return self.handle_monthly_prayer_times(query_params)
        elif path == '/api/geo/ip-location':
            return self.handle_ip_location()
        elif path == '/api/geo/coordinates':
            return self.handle_coordinates(query_params)
        elif path == '/api/locations/search':
            return self.handle_location_search(query_params)
        elif path == '/api/locations/popular':
            return self.handle_popular_locations()
        elif path == '/api/preferences':
            return self.handle_get_preferences(query_params)
        else:
            return None
    
    def handle_post_request(self, path):
        """Обработка POST запросов."""
        content_length = int(self.headers['Content-Length'])
        post_data = self.rfile.read(content_length)
        request_data = json.loads(post_data.decode('utf-8'))
        
        if path == '/api/preferences/theme':
            return self.handle_theme_preference(request_data)
        elif path == '/api/preferences/language':
            return self.handle_language_preference(request_data)
        elif path == '/api/preferences/location':
            return self.handle_location_preference(request_data)
        else:
            return None
    
    def do_GET(self):
        """Обработка GET-запросов."""
        # Парсинг URL для получения пути и параметров запроса
        parsed_path = urllib.parse.urlparse(self.path)
        path = parsed_path.path
        query_params = dict(urllib.parse.parse_qsl(parsed_path.query))
        
        # Если это API запрос
        if path.startswith('/api/'):
            response_data = self.handle_api_request(path, query_params)
            if response_data:
                self.send_json_response(response_data)
                return
            else:
                self.send_error(404, "API endpoint not found")
                return
        
        # Иначе обрабатываем как статический файл
        try:
            # Если запрос к корню, возвращаем index.html
            if path == '/':
                self.path = '/index.html'
            super().do_GET()
        except FileNotFoundError:
            # Если файл не найден, перенаправляем на index.html для SPA
            self.path = '/index.html'
            super().do_GET()
    
    def do_POST(self):
        """Обработка POST-запросов."""
        path = self.path
        
        # Если это API запрос
        if path.startswith('/api/'):
            response_data = self.handle_post_request(path)
            if response_data:
                self.send_json_response(response_data)
                return
            else:
                self.send_error(404, "API endpoint not found")
                return
        
        # Если это не API запрос, вернуть ошибку
        self.send_error(404, "Not found")
    
    # === API Handlers ===
    def handle_prayer_times(self, query_params):
        """Обработчик запроса времен молитв."""
        latitude = query_params.get('latitude')
        longitude = query_params.get('longitude')
        method = query_params.get('method', '2')
        
        if not latitude or not longitude:
            return {'error': 'Latitude and longitude are required'}
        
        # Создаем ключ кэша
        cache_key = f"prayer-times-{latitude}-{longitude}-{method}-{datetime.now().strftime('%Y-%m-%d')}"
        
        # Проверяем кэш
        if cache_key in api_cache:
            return api_cache[cache_key]
        
        # Запрос к внешнему API
        today_timestamp = int(time.time())
        url = f"{PRAYER_API_BASE_URL}/timings/{today_timestamp}?latitude={latitude}&longitude={longitude}&method={method}&school=1"
        
        try:
            with urllib.request.urlopen(url) as response:
                data = json.loads(response.read().decode('utf-8'))
                
                if data['code'] == 200:
                    # Обработка данных
                    result = process_prayer_times_response(data)
                    
                    # Сохраняем в кэш
                    api_cache[cache_key] = result
                    return result
                else:
                    return {'error': 'Failed to fetch prayer times', 'api_response': data}
        except Exception as e:
            return {'error': str(e)}
    
    def handle_monthly_prayer_times(self, query_params):
        """Обработчик запроса месячных времен молитв."""
        latitude = query_params.get('latitude')
        longitude = query_params.get('longitude')
        month = query_params.get('month')
        year = query_params.get('year')
        method = query_params.get('method', '2')
        
        if not all([latitude, longitude, month, year]):
            return {'error': 'Latitude, longitude, month, and year are required'}
        
        # Создаем ключ кэша
        cache_key = f"monthly-{latitude}-{longitude}-{month}-{year}-{method}"
        
        # Проверяем кэш
        if cache_key in api_cache:
            return api_cache[cache_key]
        
        # Запрос к внешнему API
        url = f"{PRAYER_API_BASE_URL}/calendar/{year}/{month}?latitude={latitude}&longitude={longitude}&method={method}&school=1"
        
        try:
            with urllib.request.urlopen(url) as response:
                data = json.loads(response.read().decode('utf-8'))
                
                if data['code'] == 200:
                    # Обработка данных
                    result = process_monthly_prayer_times_response(data, int(month), int(year))
                    
                    # Сохраняем в кэш
                    api_cache[cache_key] = result
                    return result
                else:
                    return {'error': 'Failed to fetch monthly prayer times', 'api_response': data}
        except Exception as e:
            return {'error': str(e)}
    
    def handle_ip_location(self):
        """Обработчик запроса геолокации по IP."""
        # В простой версии возвращаем Мекку как дефолтную локацию
        return {
            "name": "Мекка",
            "country": "Саудовская Аравия",
            "latitude": 21.4225,
            "longitude": 39.8262,
            "value": "mecca-saudi-arabia"
        }
    
    def handle_coordinates(self, query_params):
        """Обработчик запроса информации о местоположении по координатам."""
        # Простая заглушка
        return {
            "name": "Определено по координатам",
            "country": "Неизвестно",
            "latitude": float(query_params.get('lat', 0)),
            "longitude": float(query_params.get('lng', 0)),
            "value": "custom-location"
        }
    
    def handle_location_search(self, query_params):
        """Обработчик запроса поиска местоположения."""
        query = query_params.get('q', '')
        
        if not query:
            return []
        
        # Простой поиск по популярным местам
        popular_locations = get_popular_locations()
        results = []
        
        for location in popular_locations:
            if query.lower() in location['name'].lower() or query.lower() in location['country'].lower():
                results.append(location)
        
        return results[:10]  # Возвращаем первые 10 результатов
    
    def handle_popular_locations(self):
        """Обработчик запроса популярных мест."""
        return get_popular_locations()
    
    def handle_get_preferences(self, query_params):
        """Обработчик запроса получения настроек пользователя."""
        ip = self.client_address[0]
        
        if ip in user_preferences:
            return user_preferences[ip]
        else:
            # Дефолтные настройки
            return {
                "theme": "light",
                "language": "ru",
                "location": {
                    "name": "Мекка",
                    "country": "Саудовская Аравия",
                    "latitude": 21.4225,
                    "longitude": 39.8262,
                    "value": "mecca-saudi-arabia"
                }
            }
    
    def handle_theme_preference(self, data):
        """Обработчик запроса изменения темы."""
        ip = self.client_address[0]
        
        if ip not in user_preferences:
            user_preferences[ip] = {}
        
        user_preferences[ip]['theme'] = data.get('theme', 'light')
        return {"success": True, "theme": user_preferences[ip]['theme']}
    
    def handle_language_preference(self, data):
        """Обработчик запроса изменения языка."""
        ip = self.client_address[0]
        
        if ip not in user_preferences:
            user_preferences[ip] = {}
        
        user_preferences[ip]['language'] = data.get('language', 'ru')
        return {"success": True, "language": user_preferences[ip]['language']}
    
    def handle_location_preference(self, data):
        """Обработчик запроса изменения местоположения."""
        ip = self.client_address[0]
        
        if ip not in user_preferences:
            user_preferences[ip] = {}
        
        user_preferences[ip]['location'] = data.get('location', {})
        return {"success": True, "location": user_preferences[ip]['location']}

# === Вспомогательные функции ===
def get_popular_locations():
    """Возвращает список популярных местоположений."""
    return [
        {
            "name": "Мекка",
            "country": "Саудовская Аравия",
            "latitude": 21.4225,
            "longitude": 39.8262,
            "value": "mecca-saudi-arabia"
        },
        {
            "name": "Медина",
            "country": "Саудовская Аравия",
            "latitude": 24.4672,
            "longitude": 39.6150,
            "value": "medina-saudi-arabia"
        },
        {
            "name": "Москва",
            "country": "Россия",
            "latitude": 55.7558,
            "longitude": 37.6173,
            "value": "moscow-russia"
        },
        {
            "name": "Стамбул",
            "country": "Турция",
            "latitude": 41.0082,
            "longitude": 28.9784,
            "value": "istanbul-turkey"
        },
        {
            "name": "Каир",
            "country": "Египет",
            "latitude": 30.0444,
            "longitude": 31.2357,
            "value": "cairo-egypt"
        },
        {
            "name": "Дубай",
            "country": "ОАЭ",
            "latitude": 25.2048,
            "longitude": 55.2708,
            "value": "dubai-uae"
        }
    ]

def process_prayer_times_response(data):
    """Обрабатывает ответ API молитв и возвращает форматированные данные."""
    timings = data['data']['timings']
    date = data['data']['date']
    meta = data['data']['meta']
    
    # Текущее время в минутах от начала дня
    now = datetime.now()
    current_minutes = now.hour * 60 + now.minute
    
    # Форматирование молитв
    prayer_times = []
    prayer_names = [
        {'name': 'Fajr', 'time': timings['Fajr']},
        {'name': 'Sunrise', 'time': timings['Sunrise']},
        {'name': 'Dhuhr', 'time': timings['Dhuhr']},
        {'name': 'Asr', 'time': timings['Asr']},
        {'name': 'Maghrib', 'time': timings['Maghrib']},
        {'name': 'Isha', 'time': timings['Isha']}
    ]
    
    current_prayer = None
    next_prayer = None
    
    for prayer in prayer_names:
        # Преобразование времени в минуты
        time_parts = prayer['time'].split(':')
        time_in_minutes = int(time_parts[0]) * 60 + int(time_parts[1])
        
        # Определение текущей и следующей молитвы
        is_current = False
        is_upcoming = False
        
        if time_in_minutes <= current_minutes:
            # Эта молитва уже прошла или сейчас
            is_current = True
            current_prayer = prayer['name']
        elif next_prayer is None:
            # Это первая молитва после текущего времени
            is_upcoming = True
            next_prayer = prayer['name']
        
        # Форматирование времени
        prayer_time = {
            'name': prayer['name'],
            'time': prayer['time'],
            'timeFormatted': convert_to_12_hour_format(prayer['time']),
            'timeInMinutes': time_in_minutes,
            'isCurrent': is_current,
            'isUpcoming': is_upcoming
        }
        
        # Добавляем оставшееся время для следующей молитвы
        if is_upcoming:
            remaining_minutes = time_in_minutes - current_minutes
            prayer_time['remainingTime'] = f"{remaining_minutes} мин"
        
        prayer_times.append(prayer_time)
    
    # Если не нашли следующую молитву в текущий день, первая молитва завтрашнего дня
    if next_prayer is None and prayer_times:
        prayer_times[0]['isUpcoming'] = True
        next_prayer = prayer_times[0]['name']
    
    # Форматирование результата
    return {
        "date": date['readable'],
        "gregorianDate": f"{date['gregorian']['day']} {date['gregorian']['month']['en']} {date['gregorian']['year']}",
        "islamicDate": f"{date['hijri']['day']} {date['hijri']['month']['en']} {date['hijri']['year']} Hijri",
        "dayOfWeek": date['gregorian']['weekday']['en'],
        "location": meta['timezone'],
        "timezone": meta['timezone'],
        "latitude": str(meta['latitude']),
        "longitude": str(meta['longitude']),
        "times": prayer_times
    }

def process_monthly_prayer_times_response(data, month, year):
    """Обрабатывает ответ API месячных молитв и возвращает форматированные данные."""
    # Получаем названия месяцев
    month_names = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ]
    
    # Форматируем данные
    days = []
    for day_data in data['data']:
        gregorian_date = day_data['date']['gregorian']
        hijri_date = day_data['date']['hijri']
        timings = day_data['timings']
        
        day = {
            'gregorianDate': gregorian_date['date'],
            'islamicDate': hijri_date['date'],
            'gregorianDay': int(gregorian_date['day']),
            'islamicDay': int(hijri_date['day']),
            'gregorianMonth': int(gregorian_date['month']['number']),
            'islamicMonth': int(hijri_date['month']['number']),
            'fajr': convert_to_12_hour_format(timings['Fajr']),
            'sunrise': convert_to_12_hour_format(timings['Sunrise']),
            'dhuhr': convert_to_12_hour_format(timings['Dhuhr']),
            'asr': convert_to_12_hour_format(timings['Asr']),
            'maghrib': convert_to_12_hour_format(timings['Maghrib']),
            'isha': convert_to_12_hour_format(timings['Isha'])
        }
        days.append(day)
    
    # Находим исламский месяц и год из первого дня
    if data['data']:
        islamic_month = data['data'][0]['date']['hijri']['month']['en']
        islamic_year = data['data'][0]['date']['hijri']['year']
    else:
        islamic_month = "Unknown"
        islamic_year = "Unknown"
    
    return {
        "gregorianMonth": month_names[month - 1],
        "gregorianYear": year,
        "islamicMonth": islamic_month,
        "islamicYear": islamic_year,
        "days": days
    }

def convert_to_12_hour_format(time_str):
    """Конвертирует время из 24-часового в 12-часовой формат."""
    match = re.match(r"(\d{2}):(\d{2})", time_str)
    if match:
        hours = int(match.group(1))
        minutes = match.group(2)
        
        am_pm = "AM" if hours < 12 else "PM"
        hours = hours % 12
        if hours == 0:
            hours = 12
            
        return f"{hours}:{minutes} {am_pm}"
    else:
        return time_str

def run_server():
    """Запуск HTTP-сервера."""
    with socketserver.TCPServer(("", PORT), PrayerTimesRequestHandler) as httpd:
        print(f"Serving Prayer Times App at http://localhost:{PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped by user")
            httpd.server_close()
            sys.exit(0)

if __name__ == "__main__":
    run_server()