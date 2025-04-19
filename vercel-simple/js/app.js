// API URL
const API_BASE_URL = 'https://api.aladhan.com/v1';

// Элементы DOM
const elements = {
  gregorianDate: document.getElementById('gregorian-date'),
  islamicDate: document.getElementById('islamic-date'),
  locationName: document.getElementById('location-name'),
  nextPrayerName: document.getElementById('next-prayer-name'),
  nextPrayerTime: document.getElementById('next-prayer-time'),
  countdown: document.getElementById('countdown'),
  fajrTime: document.getElementById('fajr-time'),
  sunriseTime: document.getElementById('sunrise-time'),
  dhuhrTime: document.getElementById('dhuhr-time'),
  asrTime: document.getElementById('asr-time'),
  maghribTime: document.getElementById('maghrib-time'),
  ishaTime: document.getElementById('isha-time'),
  themeToggle: document.getElementById('theme-toggle')
};

// Параметры по умолчанию
const defaultParams = {
  latitude: 21.4225, // Мекка
  longitude: 39.8262,
  method: 2 // Islamic Society of North America (ISNA)
};

// Состояние приложения
let state = {
  prayerTimes: null,
  nextPrayer: null,
  isDarkMode: false
};

// Загрузка данных молитв
async function fetchPrayerTimes(latitude, longitude, method) {
  try {
    // Получаем текущую дату
    const today = new Date();
    const date = today.toISOString().split('T')[0];
    
    // URL для API
    const url = `${API_BASE_URL}/timings/${date}?latitude=${latitude}&longitude=${longitude}&method=${method}`;
    
    // Выполняем запрос
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    
    // Получаем и обрабатываем данные
    const data = await response.json();
    if (data.code === 200 && data.status === 'OK') {
      return processPrayerTimes(data.data);
    } else {
      throw new Error('API error: ' + data.status);
    }
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    return null;
  }
}

// Обработка данных молитв
function processPrayerTimes(data) {
  // Получаем времена молитв
  const { timings, date, meta } = data;
  
  // Форматируем данные
  const prayerTimes = {
    date: date.readable,
    gregorianDate: `${date.gregorian.day} ${date.gregorian.month.en} ${date.gregorian.year}`,
    islamicDate: `${date.hijri.day} ${date.hijri.month.en} ${date.hijri.year} Hijri`,
    location: meta.timezone,
    times: [
      { name: 'Fajr', time: timings.Fajr },
      { name: 'Sunrise', time: timings.Sunrise },
      { name: 'Dhuhr', time: timings.Dhuhr },
      { name: 'Asr', time: timings.Asr },
      { name: 'Maghrib', time: timings.Maghrib },
      { name: 'Isha', time: timings.Isha }
    ]
  };
  
  // Вычисляем текущую и следующую молитвы
  calculateCurrentAndNextPrayer(prayerTimes);
  
  return prayerTimes;
}

// Вычисление текущей и следующей молитвы
function calculateCurrentAndNextPrayer(prayerTimes) {
  // Получаем текущее время
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  // Конвертируем времена молитв в минуты
  prayerTimes.times.forEach(prayer => {
    const [hours, minutes] = prayer.time.split(':').map(Number);
    prayer.timeInMinutes = hours * 60 + minutes;
    prayer.isCurrent = false;
    prayer.isUpcoming = false;
  });
  
  // Находим текущую и следующую молитвы
  let currentPrayer = null;
  let nextPrayer = null;
  
  // Проверяем, какая молитва сейчас и какая следующая
  for (let i = 0; i < prayerTimes.times.length; i++) {
    const prayer = prayerTimes.times[i];
    
    if (prayer.timeInMinutes > currentTime) {
      if (!nextPrayer) {
        nextPrayer = prayer;
        prayer.isUpcoming = true;
      }
    } else {
      currentPrayer = prayer;
      prayer.isCurrent = true;
    }
  }
  
  // Если нет следующей молитвы в текущий день, то следующая - первая молитва завтрашнего дня
  if (!nextPrayer && prayerTimes.times.length > 0) {
    nextPrayer = prayerTimes.times[0];
    nextPrayer.isUpcoming = true;
  }
  
  // Сохраняем следующую молитву
  if (nextPrayer) {
    state.nextPrayer = nextPrayer;
  }
}

// Обновление UI с данными молитв
function updateUI(prayerTimes) {
  if (!prayerTimes) return;
  
  // Обновляем даты
  elements.gregorianDate.textContent = prayerTimes.gregorianDate;
  elements.islamicDate.textContent = prayerTimes.islamicDate;
  
  // Обновляем локацию
  elements.locationName.textContent = prayerTimes.location;
  
  // Обновляем времена молитв
  elements.fajrTime.textContent = prayerTimes.times[0].time;
  elements.sunriseTime.textContent = prayerTimes.times[1].time;
  elements.dhuhrTime.textContent = prayerTimes.times[2].time;
  elements.asrTime.textContent = prayerTimes.times[3].time;
  elements.maghribTime.textContent = prayerTimes.times[4].time;
  elements.ishaTime.textContent = prayerTimes.times[5].time;
  
  // Обновляем следующую молитву
  if (state.nextPrayer) {
    elements.nextPrayerName.textContent = state.nextPrayer.name;
    elements.nextPrayerTime.textContent = state.nextPrayer.time;
    updateCountdown();
  }
}

// Обновление обратного отсчета до следующей молитвы
function updateCountdown() {
  if (!state.nextPrayer) return;
  
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  let timeUntilNextPrayer = state.nextPrayer.timeInMinutes - currentTime;
  
  // Если следующая молитва завтра
  if (timeUntilNextPrayer < 0) {
    timeUntilNextPrayer += 24 * 60;
  }
  
  // Форматируем время
  const hours = Math.floor(timeUntilNextPrayer / 60);
  const minutes = timeUntilNextPrayer % 60;
  
  // Обновляем UI
  elements.countdown.textContent = `${hours}h ${minutes}m`;
}

// Переключение темы
function toggleTheme() {
  state.isDarkMode = !state.isDarkMode;
  document.body.classList.toggle('dark-mode', state.isDarkMode);
  
  // Сохраняем предпочтение в localStorage
  localStorage.setItem('darkMode', state.isDarkMode);
}

// Обработчик геолокации
function handleGeolocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const prayerTimes = await fetchPrayerTimes(latitude, longitude, defaultParams.method);
        if (prayerTimes) {
          state.prayerTimes = prayerTimes;
          updateUI(prayerTimes);
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        // Используем координаты по умолчанию при ошибке
        loadDefaultData();
      },
      { timeout: 10000 }
    );
  } else {
    console.log('Geolocation not supported by this browser');
    loadDefaultData();
  }
}

// Загрузка данных по умолчанию
async function loadDefaultData() {
  const { latitude, longitude, method } = defaultParams;
  const prayerTimes = await fetchPrayerTimes(latitude, longitude, method);
  if (prayerTimes) {
    state.prayerTimes = prayerTimes;
    updateUI(prayerTimes);
  }
}

// Инициализация приложения
function initApp() {
  // Загружаем тему из localStorage
  state.isDarkMode = localStorage.getItem('darkMode') === 'true';
  document.body.classList.toggle('dark-mode', state.isDarkMode);
  
  // Добавляем обработчик для переключения темы
  elements.themeToggle.addEventListener('click', toggleTheme);
  
  // Получаем данные с помощью геолокации или используем данные по умолчанию
  handleGeolocation();
  
  // Обновляем обратный отсчет каждую минуту
  setInterval(updateCountdown, 60000);
}

// Запуск приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', initApp);