// Настройка для Vercel
const path = require('path');
const fs = require('fs');

/**
 * Проверяет, что мы работаем в среде Vercel
 * @returns {boolean} true если мы в среде Vercel
 */
function isVercelEnvironment() {
  return !!process.env.VERCEL || !!process.env.VERCEL_DEPLOYMENT;
}

/**
 * Проверяет версию Node.js
 * @returns {boolean} true если версия Node.js подходит
 */
function checkNodeVersion() {
  const nodeVersion = process.versions.node.split('.').map(Number);
  const majorVersion = nodeVersion[0];
  
  if (majorVersion < 18) {
    console.error(`Unsupported Node.js version: ${process.versions.node}. Required >= 18.x`);
    return false;
  }
  
  console.log(`Node.js ${process.versions.node} detected.`);
  
  // Предупреждение для среды Vercel если версия не 18.x
  if (isVercelEnvironment() && majorVersion !== 18) {
    console.warn(`Warning: Vercel recommends Node.js 18.x but found ${process.versions.node}`);
  }
  
  return true;
}

/**
 * Проверяет и исправляет конфигурацию для деплоя на Vercel
 * @returns {boolean} true если все ок
 */
function setupVercelConfig() {
  try {
    // Проверяем версию Node.js
    if (!checkNodeVersion()) {
      return false;
    }
    
    // Если мы не в среде Vercel, нет смысла продолжать
    if (!isVercelEnvironment()) {
      console.log('Not in Vercel environment, skipping Vercel configuration setup');
      return true;
    }
    
    console.log('Setting up Vercel configuration...');
    
    // Установка переменных окружения для Vercel
    process.env.VERCEL_DEPLOYMENT = 'true';
    process.env.NODE_ENV = process.env.NODE_ENV || 'production';
    
    return true;
  } catch (error) {
    console.error('Error setting up Vercel configuration:', error);
    return false;
  }
}

module.exports = {
  isVercelEnvironment,
  checkNodeVersion,
  setupVercelConfig
};