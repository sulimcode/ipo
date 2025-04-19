#!/usr/bin/env python3
"""
Простой HTTP-сервер для обслуживания статических файлов приложения Prayer Times.
Используется только для локальной разработки.
На Vercel это не нужно, там все файлы обслуживаются как статические.
"""

import http.server
import socketserver
import os
import sys
from pathlib import Path

# Определение порта (по умолчанию 8000)
PORT = int(os.environ.get('PORT', 8000))

# Определение директории с приложением
current_dir = Path(__file__).parent
app_dir = current_dir.parent  # Родительская директория (prayer-app)

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Кастомный обработчик HTTP-запросов с поддержкой CORS."""
    
    def __init__(self, *args, **kwargs):
        # Установка директории с приложением
        super().__init__(*args, directory=str(app_dir), **kwargs)
    
    def do_GET(self):
        """Обработка GET-запросов с добавлением CORS-заголовков."""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type')
        return super().do_GET()
    
    def do_OPTIONS(self):
        """Обработка OPTIONS-запросов для CORS."""
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type')
        self.end_headers()

def run_server():
    """Запуск HTTP-сервера."""
    with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
        print(f"Serving Prayer Times App at http://localhost:{PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped by user")
            httpd.server_close()
            sys.exit(0)

if __name__ == "__main__":
    run_server()