// Этот файл специально создан для запуска на Vercel
// и не использует import.meta.dirname, который может вызывать проблемы

const express = require('express');
const app = express();
const path = require('path');
const { fileURLToPath } = require('url');

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

// Базовый маршрут для проверки API
app.get('/api', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Prayer Times API is running',
    version: '1.0.0',
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || 'unknown',
    timestamp: new Date().toISOString()
  });
});

// Маршрут для проверки состояния
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
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

// Экспортируем приложение для использования в других файлах
module.exports = app;