from http.server import BaseHTTPRequestHandler
import json
import requests

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        try:
            # По умолчанию возвращаем Мекку, если не можем определить местоположение по IP
            default_location = {
                "name": "Mecca",
                "country": "Saudi Arabia",
                "latitude": 21.4225,
                "longitude": 39.8262,
                "value": "mecca-saudi-arabia"
            }
            
            try:
                # Пытаемся получить информацию о местоположении по IP через публичный API
                ip_response = requests.get('https://ipapi.co/json/', timeout=3)
                ip_data = ip_response.json()
                
                if ip_response.status_code == 200 and 'latitude' in ip_data and 'longitude' in ip_data:
                    # Если удалось получить информацию о местоположении
                    location = {
                        "name": ip_data.get('city', 'Unknown'),
                        "country": ip_data.get('country_name', 'Unknown'),
                        "latitude": ip_data.get('latitude', 0),
                        "longitude": ip_data.get('longitude', 0),
                        "value": f"{ip_data.get('city', 'unknown').lower()}-{ip_data.get('country_code', 'unknown').lower()}"
                    }
                else:
                    location = default_location
            except:
                # В случае ошибки при запросе к API, возвращаем значение по умолчанию
                location = default_location
            
            # Отправляем ответ
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(location).encode('utf-8'))
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))