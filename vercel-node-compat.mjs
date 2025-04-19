// Скрипт для обеспечения совместимости с Vercel
import path from 'path';
import { fileURLToPath } from 'url';

// Эта функция должна запускаться перед любым другим импортом,
// чтобы обеспечить полифилл для import.meta.dirname
export function setupDirnamePolyfill() {
  // Проверяем версию Node.js
  if (typeof process !== 'undefined' && 
      typeof process.versions === 'object' && 
      typeof process.versions.node === 'string') {
    const nodeVersion = process.versions.node.split('.').map(Number);
    const majorVersion = nodeVersion[0];
    
    // Если версия Node.js < 20, добавляем полифил
    if (majorVersion < 20 && typeof import.meta === 'object') {
      if (import.meta.dirname === undefined) {
        Object.defineProperty(import.meta, 'dirname', {
          get() {
            return getDirname(import.meta.url);
          }
        });
        console.log(`Node.js ${process.versions.node} detected, import.meta.dirname polyfill added`);
      }
    }
  }
}

/**
 * Получает путь директории для текущего модуля
 * @param {string} importMetaUrl URL модуля из import.meta.url
 * @returns {string} путь директории текущего модуля
 */
export function getDirname(importMetaUrl) {
  const __filename = fileURLToPath(importMetaUrl);
  const __dirname = path.dirname(__filename);
  return __dirname;
}

/**
 * Преобразует относительный путь в абсолютный относительно корня проекта
 * @param {string} importMetaUrl URL модуля из import.meta.url
 * @param {string} relativePath Относительный путь от корня проекта
 * @returns {string} Абсолютный путь к файлу
 */
export function resolveRootPath(importMetaUrl, relativePath) {
  const moduleDir = getDirname(importMetaUrl);
  return path.resolve(moduleDir, '..', relativePath);
}

// Автоматически применяем полифил при импорте этого модуля
setupDirnamePolyfill();

export default {
  setupDirnamePolyfill,
  getDirname,
  resolveRootPath
};