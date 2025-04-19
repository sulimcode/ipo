// Простой обработчик для Vercel без import.meta.dirname
// Используем CommonJS в .js файле для максимальной совместимости

module.exports = (req, res) => {
  // Добавляем CORS заголовки
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  
  // Простой ответ для проверки
  res.status(200).json({
    status: 'ok',
    message: 'Vercel API is running',
    timestamp: new Date().toISOString(),
    nodeVersion: process.version,
    environment: process.env.NODE_ENV || 'unknown'
  });
};