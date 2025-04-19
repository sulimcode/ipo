from http.server import BaseHTTPRequestHandler
import json

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        """Обработчик для проверки работоспособности API"""
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.end_headers()
        
        response_data = {
            'status': 'ok',
            'message': 'Prayer Times API is working'
        }
        
        self.wfile.write(json.dumps(response_data).encode('utf-8'))