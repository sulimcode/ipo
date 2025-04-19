// CommonJS версия для совместимости с Vercel
const path = require('path');
const url = require('url');

/**
 * Получает путь директории для текущего модуля
 * @param {string} fileURL URL модуля 
 * @returns {string} путь директории текущего модуля
 */
function getDirname(fileURL) {
  const __filename = url.fileURLToPath(fileURL);
  const __dirname = path.dirname(__filename);
  return __dirname;
}

/**
 * Проверяет версию Node.js и выводит предупреждение, если версия слишком старая
 * @returns {boolean} true если версия Node.js >= 18
 */
function checkNodeVersion() {
  const nodeVersion = process.versions.node.split('.').map(Number);
  const majorVersion = nodeVersion[0];
  
  // Для Vercel нам нужна версия 18.x или выше
  if (majorVersion < 18) {
    console.error(`Unsupported Node.js version: ${process.versions.node}. Required >= 18.x`);
    return false;
  }
  
  console.log(`Node.js ${process.versions.node} detected.`);
  
  // Для версий 18.x добавляем полифил для import.meta.dirname на глобальном уровне
  if (majorVersion === 18) {
    console.log('Node.js 18.x detected, dirname polyfill will be applied');
  }
  
  return true;
}

/**
 * Добавляет глобальный полифил для import.meta.dirname в Node.js 18.x
 * Вызывается из ESM модулей через import()
 */
function setupGlobalPolyfill() {
  const nodeVersion = process.versions.node.split('.').map(Number);
  const majorVersion = nodeVersion[0];
  
  if (majorVersion === 18) {
    // Добавляем полифил в глобальную область
    global.__dirnamePolyfillInstalled = true;
    console.log('Global dirname polyfill installed for Node.js 18.x');
  }
}

// Экспортируем функции для использования в других модулях
module.exports = {
  getDirname,
  checkNodeVersion,
  setupGlobalPolyfill
};