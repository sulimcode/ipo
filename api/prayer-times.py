from http.server import BaseHTTPRequestHandler
import json
import requests
from urllib.parse import parse_qs
from datetime import datetime, timedelta

def process_prayer_times_response(data):
    """Обрабатывает ответ API молитв и возвращает форматированные данные."""
    if not data or 'data' not in data or not data['data'] or 'timings' not in data['data']:
        return None
    
    api_data = data['data']
    timings = api_data['timings']
    date = api_data['date']
    meta = api_data['meta']
    
    # Конвертируем время из 24-часового в 12-часовой формат
    formatted_timings = {}
    for prayer, time_str in timings.items():
        if prayer in ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Sunset', 'Maghrib', 'Isha', 'Midnight', 'Imsak']:
            formatted_timings[prayer] = convert_to_12_hour_format(time_str)
    
    # Формируем структуру ответа
    result = {
        "date": f"{date['gregorian']['day']}-{date['gregorian']['month']}-{date['gregorian']['year']}",
        "gregorianDate": f"{date['gregorian']['day']} {date['gregorian']['month']} {date['gregorian']['year']}",
        "hijriDate": f"{date['hijri']['day']} {date['hijri']['month']['en']} {date['hijri']['year']}",
        "timings": formatted_timings,
        "location": {
            "latitude": meta['latitude'],
            "longitude": meta['longitude'],
            "timezone": meta['timezone']
        },
        "meta": {
            "method": meta['method']['name'],
            "school": meta['school']
        },
        "raw": timings  # Оригинальные данные в 24-часовом формате
    }
    
    return result

def convert_to_12_hour_format(time_str):
    """Конвертирует время из 24-часового в 12-часовой формат."""
    try:
        # Обрабатываем строку времени формата "HH:MM (GMT+X)"
        time_parts = time_str.split(' ')
        time_only = time_parts[0]
        
        h, m = map(int, time_only.split(':'))
        
        # Определяем AM/PM
        period = "AM" if h < 12 else "PM"
        
        # Конвертируем час в 12-часовой формат
        h = h % 12
        if h == 0:
            h = 12
            
        return f"{h:02d}:{m:02d} {period}"
    except Exception as e:
        # В случае ошибки возвращаем исходное значение
        return time_str

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            # Разбор параметров запроса
            query_components = parse_qs(self.path.split('?')[1]) if '?' in self.path else {}
            
            # Получаем параметры
            latitude = query_components.get('latitude', ['21.4225'])[0]
            longitude = query_components.get('longitude', ['39.8262'])[0]
            method = query_components.get('method', ['2'])[0]  # Метод расчета по умолчанию ISNA
            
            # Получаем текущую дату
            today = datetime.now().strftime('%d-%m-%Y')
            date = query_components.get('date', [today])[0]
            
            # Формируем URL для API молитвенных времен
            api_url = f"https://api.aladhan.com/v1/timings/{date}?latitude={latitude}&longitude={longitude}&method={method}"
            
            try:
                # Получаем данные от API
                response = requests.get(api_url, timeout=5)
                data = response.json()
                
                if response.status_code == 200:
                    # Если успешно получили данные, обрабатываем их
                    result = process_prayer_times_response(data)
                    
                    if result:
                        self.send_response(200)
                        self.send_header('Content-type', 'application/json')
                        self.send_header('Access-Control-Allow-Origin', '*')
                        self.end_headers()
                        self.wfile.write(json.dumps(result).encode('utf-8'))
                    else:
                        # Если не удалось обработать данные
                        self.send_response(500)
                        self.send_header('Content-type', 'application/json')
                        self.end_headers()
                        self.wfile.write(json.dumps({'error': 'Failed to process prayer times data'}).encode('utf-8'))
                else:
                    # Если API вернул ошибку
                    self.send_response(response.status_code)
                    self.send_header('Content-type', 'application/json')
                    self.end_headers()
                    self.wfile.write(json.dumps({'error': f'API returned error: {response.status_code}'}).encode('utf-8'))
            
            except Exception as api_error:
                # Если произошла ошибка при запросе к API
                self.send_response(500)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({'error': f'API request error: {str(api_error)}'}).encode('utf-8'))
            
        except Exception as e:
            # Общая ошибка обработки запроса
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))