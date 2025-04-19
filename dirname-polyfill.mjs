// Полифил для функции import.meta.dirname, которая доступна в Node.js 20+
// но отсутствует в Node.js 18.x, который используется в Vercel

import path from 'path';
import { fileURLToPath } from 'url';

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
 * Получает объект, имитирующий import.meta с добавленным dirname
 * @param {string} importMetaUrl URL модуля из import.meta.url
 * @returns {object} объект с полями url и dirname
 */
export function getImportMeta(importMetaUrl) {
  return {
    url: importMetaUrl,
    dirname: getDirname(importMetaUrl)
  };
}

/**
 * Функция для получения путей от корневой директории проекта
 * @param {string} importMetaUrl URL модуля из import.meta.url 
 * @param {...string} pathSegments сегменты пути для объединения
 * @returns {string} полный путь от корня проекта
 */
export function getPathFromRoot(importMetaUrl, ...pathSegments) {
  const dirname = getDirname(importMetaUrl);
  const rootPath = path.resolve(dirname, '..');
  return path.join(rootPath, ...pathSegments);
}

// Добавляем полифил в глобальный объект, если запущено в среде Node.js
if (typeof process !== 'undefined' && typeof process.versions === 'object' && typeof process.versions.node === 'string') {
  // Проверяем версию Node.js
  const nodeVersion = process.versions.node.split('.').map(Number);
  const majorVersion = nodeVersion[0];
  
  // Если версия Node.js < 20, добавляем полифил
  if (majorVersion < 20) {
    console.log(`Node.js ${process.versions.node} detected, adding import.meta.dirname polyfill`);
    
    // Переопределяем import.meta для добавления dirname
    if (typeof import.meta === 'object') {
      Object.defineProperty(import.meta, 'dirname', {
        get() {
          return getDirname(import.meta.url);
        }
      });
    }
    
    console.log('import.meta.dirname polyfill installed');
  }
}

export default {
  getDirname,
  getImportMeta,
  getPathFromRoot
};