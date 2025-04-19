from http.server import BaseHTTPRequestHandler
import json
from urllib.parse import parse_qs
import os

# Для работы на Vercel, нам нужен файл или база данных для хранения настроек
# Для простоты будем использовать значения по умолчанию
DEFAULT_PREFERENCES = {
    "theme": "light",
    "language": "en",
    "location": {
        "name": "Mecca",
        "country": "Saudi Arabia",
        "latitude": 21.4225,
        "longitude": 39.8262,
        "value": "mecca-saudi-arabia"
    }
}

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # В простой версии просто возвращаем настройки по умолчанию
        # В реальном приложении здесь будет логика получения настроек для конкретного пользователя
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        self.wfile.write(json.dumps(DEFAULT_PREFERENCES).encode('utf-8'))