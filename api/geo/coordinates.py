from http.server import BaseHTTPRequestHandler
import json
import requests
from urllib.parse import urlparse, parse_qs

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            # Парсим URL для получения параметров lat и lng
            parsed_path = urlparse(self.path)
            path_parts = parsed_path.path.split('/')
            
            # Ожидается путь вида /api/geo/coordinates/{lat}/{lng}
            if len(path_parts) >= 5:
                latitude = path_parts[3]
                longitude = path_parts[4]
            else:
                # Если параметры не переданы в пути, пробуем получить их из query string
                query_params = parse_qs(parsed_path.query)
                latitude = query_params.get('lat', ['0'])[0]
                longitude = query_params.get('lng', ['0'])[0]
            
            try:
                # Конвертируем в числа для проверки
                lat_float = float(latitude)
                lng_float = float(longitude)
                
                # Проверяем корректность координат
                if not (-90 <= lat_float <= 90 and -180 <= lng_float <= 180):
                    raise ValueError("Invalid coordinates")
                
                # Получаем информацию о местоположении по координатам
                try:
                    # Используем публичный API для получения обратного геокодирования
                    reverse_geo_url = f"https://nominatim.openstreetmap.org/reverse?format=json&lat={latitude}&lon={longitude}&zoom=10"
                    headers = {'User-Agent': 'PrayerTimesApp/1.0'}
                    
                    geo_response = requests.get(reverse_geo_url, headers=headers, timeout=3)
                    geo_data = geo_response.json()
                    
                    if geo_response.status_code == 200 and 'address' in geo_data:
                        address = geo_data['address']
                        city = address.get('city', address.get('town', address.get('village', address.get('hamlet', 'Unknown'))))
                        
                        location = {
                            "name": city,
                            "country": address.get('country', 'Unknown'),
                            "latitude": lat_float,
                            "longitude": lng_float,
                            "value": f"{city.lower()}-{address.get('country_code', '').lower()}"
                        }
                    else:
                        # Если не удалось получить информацию о местоположении, создаем базовое
                        location = {
                            "name": "Unknown Location",
                            "country": "Unknown",
                            "latitude": lat_float,
                            "longitude": lng_float,
                            "value": f"unknown-{lat_float}-{lng_float}"
                        }
                except:
                    # В случае ошибки при запросе API создаем базовую информацию
                    location = {
                        "name": "Unknown Location",
                        "country": "Unknown",
                        "latitude": lat_float,
                        "longitude": lng_float,
                        "value": f"unknown-{lat_float}-{lng_float}"
                    }
                
                # Отправляем ответ
                self.send_response(200)
                self.send_header('Content-type', 'application/json')
                self.send_header('Access-Control-Allow-Origin', '*')
                self.end_headers()
                self.wfile.write(json.dumps(location).encode('utf-8'))
                
            except ValueError:
                # Если переданы некорректные координаты
                self.send_response(400)
                self.send_header('Content-type', 'application/json')
                self.end_headers()
                self.wfile.write(json.dumps({
                    'error': 'Invalid coordinates. Latitude must be between -90 and 90, longitude between -180 and 180.'
                }).encode('utf-8'))
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))