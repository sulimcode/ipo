// @ts-ignore - Игнорируем несоответствие версий типов
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Простой обработчик корневого маршрута API
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Добавляем CORS заголовки
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    
    // Базовая информация об API
    const apiInfo = {
      name: 'Prayer Times API',
      version: '1.0.0',
      status: 'online',
      timestamp: new Date().toISOString(),
      endpoints: [
        { path: '/api/healthcheck', description: 'Проверка состояния API' },
        { path: '/api/v1/healthcheck', description: 'Альтернативная проверка состояния API' },
        { path: '/api/prayer-times', description: 'Получение времени молитв на сегодня' },
        { path: '/api/prayer-times/monthly', description: 'Получение времени молитв на месяц' },
        { path: '/api/geo/ip-location', description: 'Определение местоположения по IP' },
        { path: '/api/geo/coordinates/:lat/:lng', description: 'Получение информации о местоположении по координатам' },
        { path: '/api/locations/search', description: 'Поиск местоположения по названию' },
        { path: '/api/locations/popular', description: 'Популярные местоположения' },
        { path: '/api/preferences', description: 'Получение настроек пользователя' }
      ]
    };
    
    return res.status(200).json(apiInfo);
  } catch (error) {
    console.error('API index error:', error);
    return res.status(500).json({ 
      status: 'error', 
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}