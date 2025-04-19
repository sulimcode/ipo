from http.server import BaseHTTPRequestHandler
import json

def get_popular_locations():
    """Возвращает список популярных местоположений."""
    return [
        {
            "name": "Mecca",
            "country": "Saudi Arabia",
            "latitude": 21.4225,
            "longitude": 39.8262,
            "value": "mecca-saudi-arabia"
        },
        {
            "name": "Medina",
            "country": "Saudi Arabia",
            "latitude": 24.5247,
            "longitude": 39.5692,
            "value": "medina-saudi-arabia"
        },
        {
            "name": "Jerusalem",
            "country": "Palestine",
            "latitude": 31.7683,
            "longitude": 35.2137,
            "value": "jerusalem-palestine"
        },
        {
            "name": "Istanbul",
            "country": "Turkey",
            "latitude": 41.0082,
            "longitude": 28.9784,
            "value": "istanbul-turkey"
        },
        {
            "name": "Cairo",
            "country": "Egypt",
            "latitude": 30.0444,
            "longitude": 31.2357,
            "value": "cairo-egypt"
        },
        {
            "name": "Dubai",
            "country": "UAE",
            "latitude": 25.2048,
            "longitude": 55.2708,
            "value": "dubai-uae"
        },
        {
            "name": "Kuala Lumpur",
            "country": "Malaysia",
            "latitude": 3.1390,
            "longitude": 101.6869,
            "value": "kuala-lumpur-malaysia"
        },
        {
            "name": "New York",
            "country": "USA",
            "latitude": 40.7128,
            "longitude": -74.0060,
            "value": "new-york-usa"
        },
        {
            "name": "London",
            "country": "UK",
            "latitude": 51.5074,
            "longitude": -0.1278,
            "value": "london-uk"
        },
        {
            "name": "Moscow",
            "country": "Russia",
            "latitude": 55.7558,
            "longitude": 37.6173,
            "value": "moscow-russia"
        }
    ]

class handler(BaseHTTPRequestHandler):
    def do_GET(self):
        """Обработчик GET-запроса для получения списка популярных местоположений."""
        try:
            popular_locations = get_popular_locations()
            
            self.send_response(200)
            self.send_header('Content-type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(popular_locations).encode('utf-8'))
            
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({'error': str(e)}).encode('utf-8'))