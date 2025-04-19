/**
 * Скрипт для подготовки статического сайта к деплою на Vercel
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Получаем аналог __dirname в ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Вывод сообщения о выполнении
console.log('Preparing static site for Vercel deployment...');

// Создаем директорию vercel, если она не существует
const vercelDir = path.resolve(__dirname, 'vercel');
if (!fs.existsSync(vercelDir)) {
  fs.mkdirSync(vercelDir, { recursive: true });
  console.log('Created "vercel" directory');
}

// Функция для рекурсивного копирования директории
function copyDir(src, dest) {
  // Создаем директорию назначения, если она не существует
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  // Получаем список файлов в исходной директории
  const entries = fs.readdirSync(src, { withFileTypes: true });
  
  // Копируем каждый файл или директорию
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      // Если это директория, рекурсивно копируем её содержимое
      copyDir(srcPath, destPath);
    } else {
      // Если это файл, копируем его
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied ${srcPath} -> ${destPath}`);
    }
  }
}

// Копируем содержимое директории "vercel-static" в "vercel"
const staticDir = path.resolve(__dirname, 'vercel-static');
if (fs.existsSync(staticDir)) {
  copyDir(staticDir, vercelDir);
  console.log('Copied all static files to "vercel" directory');
} else {
  console.error('Error: "vercel-static" directory not found!');
  process.exit(1);
}

// Создаем или обновляем .gitignore в корневой директории, чтобы исключить директорию "vercel"
const gitignorePath = path.resolve(__dirname, '.gitignore');
let gitignoreContent = '';

// Проверяем, существует ли файл .gitignore
if (fs.existsSync(gitignorePath)) {
  // Если существует, читаем его содержимое
  gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
  
  // Проверяем, содержит ли он уже запись для директории "vercel"
  if (!gitignoreContent.split('\n').some(line => line.trim() === 'vercel/')) {
    // Если нет, добавляем запись
    gitignoreContent += '\n# Vercel deployment directory\nvercel/\n';
  }
} else {
  // Если файл не существует, создаем его с записью для директории "vercel"
  gitignoreContent = '# Vercel deployment directory\nvercel/\n';
}

// Записываем содержимое в файл .gitignore
fs.writeFileSync(gitignorePath, gitignoreContent);
console.log('Updated .gitignore file');

console.log('Static site prepared for Vercel deployment!');
console.log('Run "npx vercel vercel" to deploy or connect this repository to Vercel for automatic deployments.');