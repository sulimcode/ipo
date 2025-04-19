from http.server import BaseHTTPRequestHandler
import json
import requests
from urllib.parse import parse_qs
from datetime import datetime
import calendar

def process_monthly_prayer_times_response(data, month, year):
    """Обрабатывает ответ API месячных молитв и возвращает форматированные данные."""
    if not data or 'data' not in data or not data['data']:
        return None
    
    # Получаем месяц и год в нужном формате
    month_name = datetime(int(year), int(month), 1).strftime('%B')
    
    # Формируем структуру ответа
    result = {
        "gregorianMonth": month_name,
        "gregorianYear": year,
        "days": []
    }
    
    # Обрабатываем данные для каждого дня
    for day_data in data['data']:
        if 'date' not in day_data or 'timings' not in day_data:
            continue
        
        date = day_data['date']
        timings = day_data['timings']
        
        # Конвертируем время из 24-часового в 12-часовой формат
        formatted_timings = {}
        for prayer, time_str in timings.items():
            if prayer in ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Sunset', 'Maghrib', 'Isha', 'Midnight', 'Imsak']:
                formatted_timings[prayer] = convert_to_12_hour_format(time_str)
        
        # Добавляем информацию о дне
        day_info = {
            "date": f"{date['gregorian']['day']}-{date['gregorian']['month']}-{date['gregorian']['year']}",
            "gregorianDate": f"{date['gregorian']['day']} {date['gregorian']['month']} {date['gregorian']['year']}",
            "hijriDate": f"{date['hijri']['day']} {date['hijri']['month']['en']} {date['hijri']['year']}",
            "weekday": date['gregorian']['weekday']['en'],
            "timings": formatted_timings
        }
        
        result["days"].append(day_info)
    
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
            
            # Получаем текущий месяц и год
            current_date = datetime.now()
            current_month = current_date.month
            current_year = current_date.year
            
            month = query_components.get('month', [str(current_month)])[0]
            year = query_components.get('year', [str(current_year)])[0]
            
            # Проверяем корректность месяца и года
            try:
                month_int = int(month)
                year_int = int(year)
                if not (1 <= month_int <= 12 and 1900 <= year_int <= 2100):
                    raise ValueError("Invalid month or year")
                
                # Получаем количество дней в месяце
                days_in_month = calendar.monthrange(year_int, month_int)[1]
                
                # Формируем URL для API месячных молитвенных времен
                api_url = f"https://api.aladhan.com/v1/calendar/{year}/{month}?latitude={latitude}&longitude={longitude}&method={method}"
                
                try:
                    # Получаем данные от API
                    response = requests.get(api_url, timeout=10)
                    data = response.json()
                    
                    if response.status_code == 200:
                        # Если успешно получили данные, обрабатываем их
                        result = process_monthly_prayer_times_response(data, month, year)
                        
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
                            self.wfile.write(json.dumps({'error': 'Failed to process monthly prayer times data'}).encode('utf-8'))
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
                
            except ValueError:
                # Если переданы некорректные месяц или год
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'error': 'Invalid month or year. Month must be between 1-12, year between 1900-2100.'
                }).encode('utf-8'))
            
        except Exception as e:
            # Общая ошибка обработки запроса
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))