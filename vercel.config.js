// Конфигурация для Vercel
export default {
  version: 2,
  framework: 'vite',
  buildCommand: 'node --no-warnings vercel-build.cjs && npm run build',
  installCommand: 'npm install',
  outputDirectory: 'dist',
  regions: ['iad1'],
  env: {
    NODE_ENV: 'production',
    VERCEL_DEPLOYMENT: 'true'
  },
  routes: [
    // Сначала обрабатываем файлы в директории static
    { handle: 'filesystem' },
    
    // Затем API маршруты
    { src: '/api/healthcheck', dest: '/api/healthcheck.ts' },
    { src: '/api/(.*)', dest: '/api/[[...path]].ts' },
    
    // В конце перенаправляем все остальные запросы на клиентское SPA
    { src: '/(.*)', dest: '/index.html' }
  ],
  // Функции для обработки API маршрутов
  functions: {
    'api/[[...path]].ts': {
      runtime: '@vercel/node@2.10.0',
      maxDuration: 10
    },
    'api/healthcheck.ts': {
      runtime: '@vercel/node@2.10.0',
      maxDuration: 5
    }
  },
  // Фреймворк
  framework: {
    name: 'vite',
    version: 'latest'
  },
  // Версия Node.js, которую нужно использовать
  nodeVersion: '18.x'
};