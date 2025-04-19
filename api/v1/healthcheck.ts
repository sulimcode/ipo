// @ts-ignore - Игнорируем несоответствие версий типов
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Простой обработчик без использования import.meta.dirname
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Добавляем CORS заголовки
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
    
    // Получаем информацию о среде выполнения без использования import.meta.dirname
    const runtimeInfo = {
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || 'unknown',
      platform: process.platform,
      dirname: process.cwd(),
      timestamp: new Date().toISOString(),
      status: 'ok',
      message: 'API is running'
    };
    
    return res.status(200).json(runtimeInfo);
  } catch (error) {
    console.error('Healthcheck failed:', error);
    return res.status(500).json({ 
      status: 'error', 
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    });
  }
}