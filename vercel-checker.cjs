// Этот скрипт проверяет версию Node.js при деплое на Vercel
// и предотвращает использование несовместимых версий

const fs = require('fs');
const path = require('path');

console.log('Node.js Version Checker Started');
console.log('Current Node.js version:', process.version);

// Проверяем, запущен ли скрипт на Vercel
const isVercel = process.env.VERCEL || process.env.VERCEL_DEPLOYMENT;
console.log('Running on Vercel:', isVercel ? 'Yes' : 'No');

if (isVercel) {
  // Проверяем, использует ли Vercel Node.js 22.x
  if (process.version.startsWith('v22.')) {
    console.error('ERROR: Vercel is using Node.js 22.x, but this project requires Node.js 18.x');
    console.error('Please set Node.js version to 18.x in your Vercel project settings');
    console.error('See: http://vercel.link/node-version');
    
    // Создаем файлы с указанием версии Node.js
    try {
      fs.writeFileSync('.node-version', '18.x');
      fs.writeFileSync('.nvmrc', '18.18.0');
      
      // Создаем файл для Vercel с явным указанием версии
      const vercelJson = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
      delete vercelJson.env.NODE_VERSION; // Удаляем переменную окружения
      fs.writeFileSync('vercel.json', JSON.stringify(vercelJson, null, 2));
      
      console.log('Created Node.js version specification files');
    } catch (error) {
      console.error('Failed to create Node.js version files:', error);
    }
    
    // Выходим с ошибкой, чтобы прервать деплой
    process.exit(1);
  } else {
    console.log('Node.js version check passed');
  }
}

console.log('Node.js Version Checker Completed');