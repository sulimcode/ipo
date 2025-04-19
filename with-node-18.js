// Обертка для обеспечения совместимости с Node.js 18.x на Vercel

// Импортируем необходимые модули
import path from 'path';
import { fileURLToPath } from 'url';

// Получаем информацию о текущей версии Node.js
const nodeVersion = process.versions.node.split('.').map(Number);
const majorVersion = nodeVersion[0];
const minorVersion = nodeVersion[1];

// Логируем версию Node.js
console.log(`Running with Node.js ${process.versions.node}`);

// Проверяем версию Node.js и добавляем полифил для import.meta.dirname если нужно
if (majorVersion < 20) {
  console.log(`Node.js ${majorVersion}.${minorVersion} detected - applying import.meta.dirname polyfill`);
  
  // Создаем полифил для import.meta.dirname, который использует import.meta.url
  // и преобразует его в путь к директории
  if (typeof import.meta === 'object' && import.meta.dirname === undefined) {
    Object.defineProperty(import.meta, 'dirname', {
      get() {
        const filename = fileURLToPath(import.meta.url);
        return path.dirname(filename);
      }
    });
    
    console.log('Added import.meta.dirname polyfill');
  }
}

// Экспортируем функцию для получения пути к директории
export function getDirname(importMetaUrl) {
  return path.dirname(fileURLToPath(importMetaUrl));
}

// Экспортируем функцию для проверки версии Node.js
export function checkNodeVersion() {
  if (majorVersion < 18) {
    console.error(`Unsupported Node.js version: ${process.versions.node}. Required >= 18.x`);
    return false;
  }
  return true;
}

export default {
  getDirname,
  checkNodeVersion
};