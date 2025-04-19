// Обработчик главного API на Vercel с CommonJS синтаксисом
// для максимальной совместимости с Node.js 18.x

const express = require('express');
const app = express();

// Middleware для обработки CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Middleware для парсинга тела запроса
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Базовые маршруты для API тестов
app.get('/api/test', (req, res) => {
  res.json({
    status: 'ok',
    message: 'API test endpoint is working',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/time', (req, res) => {
  res.json({
    current_time: new Date().toISOString(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });
});

// Маршрут по умолчанию
app.get('*', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Vercel API Handler is running',
    path: req.path,
    nodeVersion: process.version,
    timestamp: new Date().toISOString()
  });
});

// Обработка ошибок
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
    timestamp: new Date().toISOString()
  });
});

// Экспортируем функцию-обработчик для Vercel
module.exports = (req, res) => {
  return app(req, res);
};