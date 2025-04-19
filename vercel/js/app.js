/**
 * Main application logic for Prayer Times App
 */

document.addEventListener('DOMContentLoaded', function() {
  // Инициализация состояния приложения
  const app = {
    selectedLocation: null,
    prayerTimes: null,
    monthlyPrayerTimes: null,
    currentMonth: new Date().getMonth() + 1,
    currentYear: new Date().getFullYear(),
    countdownInterval: null,
    searchTimeout: null
  };

  // Ссылки на DOM элементы
  const elements = {
    // Заголовок и даты
    gregorianDate: document.getElementById('gregorian-date'),
    islamicDate: document.getElementById('islamic-date'),
    
    // Переключатели темы и языка
    themeToggleBtn: document.getElementById('theme-toggle-btn'),
    languageToggleBtn: document.getElementById('language-toggle-btn'),
    currentLanguage: document.getElementById('current-language'),
    languageDropdown: document.getElementById('language-dropdown'),
    
    // Поиск местоположения
    locationSearch: document.getElementById('location-search'),
    geolocationBtn: document.getElementById('geolocation-btn'),
    searchResults: document.getElementById('search-results'),
    currentLocation: document.getElementById('current-location'),
    
    // Следующая молитва
    nextPrayerTitle: document.getElementById('next-prayer-title'),
    nextPrayerName: document.getElementById('next-prayer-name'),
    nextPrayerTime: document.getElementById('next-prayer-time'),
    countdown: document.getElementById('countdown'),
    
    // Времена молитв
    prayerTimesGrid: document.getElementById('prayer-times-grid'),
    
    // Месячное расписание
    currentMonthDisplay: document.getElementById('current-month-display'),
    prevMonthBtn: document.getElementById('prev-month'),
    nextMonthBtn: document.getElementById('next-month'),
    monthlyTableBody: document.getElementById('monthly-table-body')
  };

  // Инициализация приложения
  init();

  /**
   * Инициализация приложения
   */
  function init() {
    // Загружаем настройки пользователя
    loadUserPreferences();
    
    // Инициализируем местоположение по умолчанию (Мекка)
    if (!app.selectedLocation) {
      app.selectedLocation = {
        name: 'Mecca',
        country: 'Saudi Arabia',
        latitude: 21.4225,
        longitude: 39.8262,
        value: 'mecca-saudi-arabia'
      };
    }
    
    // Обновляем отображение выбранного местоположения
    updateSelectedLocation();
    
    // Загружаем времена молитв
    loadPrayerTimes();
    
    // Загружаем месячное расписание
    loadMonthlyPrayerTimes();
    
    // Устанавливаем обработчики событий
    setupEventListeners();
    
    // Устанавливаем направление текста и язык документа в зависимости от выбранного языка
    applyLanguage();
  }

  /**
   * Загрузка настроек пользователя из localStorage
   */
  function loadUserPreferences() {
    // Загружаем тему
    const theme = localStorage.getItem('theme') || 'light';
    document.documentElement.classList.toggle('dark', theme === 'dark');
    
    // Загружаем язык
    const language = localStorage.getItem('language') || 'en';
    elements.currentLanguage.textContent = getLanguageDisplayName(language);
    
    // Загружаем последнее местоположение, если есть
    const savedLocation = localStorage.getItem('selectedLocation');
    if (savedLocation) {
      try {
        app.selectedLocation = JSON.parse(savedLocation);
      } catch (e) {
        console.error('Error parsing saved location:', e);
      }
    }
  }

  /**
   * Установка обработчиков событий
   */
  function setupEventListeners() {
    // Переключение темы
    elements.themeToggleBtn.addEventListener('click', toggleTheme);
    
    // Переключение языка
    elements.languageToggleBtn.addEventListener('click', toggleLanguageDropdown);
    
    // Обработчики для кнопок выбора языка
    const languageButtons = elements.languageDropdown.querySelectorAll('button');
    languageButtons.forEach(button => {
      button.addEventListener('click', () => {
        const language = button.getAttribute('data-lang');
        changeLanguage(language);
        toggleLanguageDropdown();
      });
    });
    
    // Закрытие выпадающего списка при клике вне его
    document.addEventListener('click', (event) => {
      if (!elements.languageToggleBtn.contains(event.target) && 
          !elements.languageDropdown.contains(event.target)) {
        elements.languageDropdown.classList.remove('active');
      }
    });
    
    // Поиск местоположения
    elements.locationSearch.addEventListener('input', handleLocationSearch);
    
    // Получение местоположения по геолокации
    elements.geolocationBtn.addEventListener('click', requestGeolocation);
    
    // Навигация по месяцам
    elements.prevMonthBtn.addEventListener('click', handlePrevMonth);
    elements.nextMonthBtn.addEventListener('click', handleNextMonth);
  }

  /**
   * Переключение темы (светлая/темная)
   */
  function toggleTheme() {
    const isDark = document.documentElement.classList.toggle('dark');
    const theme = isDark ? 'dark' : 'light';
    localStorage.setItem('theme', theme);
  }

  /**
   * Открыть/закрыть выпадающий список языков
   */
  function toggleLanguageDropdown() {
    elements.languageDropdown.classList.toggle('active');
  }

  /**
   * Изменить язык интерфейса
   * @param {string} language Код языка (en, ru, ar, fr)
   */
  function changeLanguage(language) {
    localStorage.setItem('language', language);
    elements.currentLanguage.textContent = getLanguageDisplayName(language);
    
    // Применяем язык к документу
    applyLanguage();
    
    // Перезагружаем данные
    updateSelectedLocation();
    loadPrayerTimes();
    loadMonthlyPrayerTimes();
  }

  /**
   * Применить выбранный язык к документу
   */
  function applyLanguage() {
    const language = localStorage.getItem('language') || 'en';
    document.documentElement.lang = language;
    
    // Установка направления текста для арабского языка
    if (language === 'ar') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
    
    // Обновляем текстовые элементы на выбранном языке
    updateUIText();
  }

  /**
   * Обновить текстовые элементы интерфейса в соответствии с выбранным языком
   */
  function updateUIText() {
    const language = localStorage.getItem('language') || 'en';
    const translations = {
      en: {
        nextPrayer: 'Next Prayer',
        todayPrayerTimes: 'Today\'s Prayer Times',
        monthlySchedule: 'Monthly Schedule',
        searchPlaceholder: 'Search for a city...'
      },
      ru: {
        nextPrayer: 'Следующая молитва',
        todayPrayerTimes: 'Расписание молитв на сегодня',
        monthlySchedule: 'Месячное расписание',
        searchPlaceholder: 'Поиск города...'
      },
      ar: {
        nextPrayer: 'الصلاة التالية',
        todayPrayerTimes: 'أوقات الصلاة اليوم',
        monthlySchedule: 'الجدول الشهري',
        searchPlaceholder: 'ابحث عن مدينة...'
      },
      fr: {
        nextPrayer: 'Prière suivante',
        todayPrayerTimes: 'Horaires des prières aujourd\'hui',
        monthlySchedule: 'Calendrier mensuel',
        searchPlaceholder: 'Rechercher une ville...'
      }
    };
    
    const texts = translations[language] || translations.en;
    
    // Обновляем текстовые элементы
    elements.nextPrayerTitle.textContent = texts.nextPrayer;
    elements.locationSearch.placeholder = texts.searchPlaceholder;
    
    // Обновляем заголовки разделов
    document.querySelector('.prayer-times h2').textContent = texts.todayPrayerTimes;
    document.querySelector('.monthly-schedule h2').textContent = texts.monthlySchedule;
  }

  /**
   * Получить отображаемое имя языка по его коду
   * @param {string} code Код языка
   * @returns {string} Название языка
   */
  function getLanguageDisplayName(code) {
    const names = {
      en: 'English',
      ru: 'Русский',
      ar: 'العربية',
      fr: 'Français'
    };
    return names[code] || 'English';
  }

  /**
   * Обработчик поиска местоположения
   */
  function handleLocationSearch() {
    const query = elements.locationSearch.value.trim();
    
    // Очищаем предыдущий таймаут
    if (app.searchTimeout) {
      clearTimeout(app.searchTimeout);
    }
    
    // Если запрос пустой, скрываем результаты
    if (!query) {
      elements.searchResults.innerHTML = '';
      elements.searchResults.classList.remove('active');
      return;
    }
    
    // Устанавливаем задержку для уменьшения количества запросов при быстром вводе
    app.searchTimeout = setTimeout(() => {
      // Используем API для поиска
      const results = window.prayerTimesApi.searchLocations(query);
      
      // Если нет результатов, скрываем блок
      if (results.length === 0) {
        elements.searchResults.innerHTML = '';
        elements.searchResults.classList.remove('active');
        return;
      }
      
      // Отображаем результаты
      elements.searchResults.innerHTML = '';
      results.forEach(location => {
        const resultItem = document.createElement('div');
        resultItem.className = 'search-result-item';
        resultItem.innerHTML = `
          <div class="search-result-name">${location.name}</div>
          <div class="search-result-country">${location.country}</div>
        `;
        
        // Обработчик клика по результату
        resultItem.addEventListener('click', () => {
          selectLocation(location);
          elements.searchResults.classList.remove('active');
          elements.locationSearch.value = '';
        });
        
        elements.searchResults.appendChild(resultItem);
      });
      
      elements.searchResults.classList.add('active');
    }, 300);
  }

  /**
   * Запрос геолокации пользователя
   */
  function requestGeolocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const location = await window.prayerTimesApi.getLocationByCoordinates(
              position.coords.latitude,
              position.coords.longitude
            );
            
            selectLocation(location);
          } catch (error) {
            console.error('Error getting location:', error);
            alert('Failed to get your location. Please try again or search manually.');
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          switch (error.code) {
            case error.PERMISSION_DENIED:
              alert('Please allow location access to use this feature.');
              break;
            case error.POSITION_UNAVAILABLE:
              alert('Location information is unavailable.');
              break;
            case error.TIMEOUT:
              alert('The request to get user location timed out.');
              break;
            default:
              alert('An unknown error occurred.');
              break;
          }
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  }

  /**
   * Выбор местоположения
   * @param {Object} location Объект местоположения
   */
  function selectLocation(location) {
    app.selectedLocation = location;
    
    // Сохраняем выбранное местоположение
    localStorage.setItem('selectedLocation', JSON.stringify(location));
    
    // Обновляем отображение
    updateSelectedLocation();
    
    // Загружаем новые данные
    loadPrayerTimes();
    loadMonthlyPrayerTimes();
  }

  /**
   * Обновление отображения выбранного местоположения
   */
  function updateSelectedLocation() {
    if (app.selectedLocation) {
      elements.currentLocation.textContent = `${app.selectedLocation.name}, ${app.selectedLocation.country}`;
    }
  }

  /**
   * Загрузка времен молитв для выбранного местоположения
   */
  async function loadPrayerTimes() {
    if (!app.selectedLocation) return;
    
    try {
      // Показываем состояние загрузки
      elements.prayerTimesGrid.innerHTML = '<div class="loading">Loading...</div>';
      elements.nextPrayerName.textContent = '...';
      elements.nextPrayerTime.textContent = '...';
      elements.countdown.textContent = '...';
      
      // Получаем данные о временах молитв
      app.prayerTimes = await window.prayerTimesApi.getPrayerTimes(
        app.selectedLocation.latitude,
        app.selectedLocation.longitude
      );
      
      // Обновляем отображение дат
      elements.gregorianDate.textContent = app.prayerTimes.gregorianDate;
      elements.islamicDate.textContent = app.prayerTimes.islamicDate;
      
      // Обновляем отображение времен молитв
      updatePrayerTimesDisplay();
      
      // Обновляем отображение следующей молитвы
      updateNextPrayerDisplay();
      
      // Запускаем обратный отсчет
      startCountdown();
    } catch (error) {
      console.error('Error loading prayer times:', error);
      elements.prayerTimesGrid.innerHTML = '<div class="error">Failed to load prayer times. Please try again.</div>';
    }
  }

  /**
   * Обновление отображения времен молитв
   */
  function updatePrayerTimesDisplay() {
    if (!app.prayerTimes) return;
    
    // Очищаем сетку
    elements.prayerTimesGrid.innerHTML = '';
    
    // Добавляем карточки для каждого времени молитвы
    app.prayerTimes.times.forEach(prayer => {
      const card = document.createElement('div');
      card.className = `prayer-time-card${prayer.isCurrent ? ' current' : ''}`;
      
      card.innerHTML = `
        <div class="prayer-name">${prayer.name}</div>
        <div class="prayer-time">${prayer.timeFormatted}</div>
      `;
      
      elements.prayerTimesGrid.appendChild(card);
    });
  }

  /**
   * Обновление отображения следующей молитвы
   */
  function updateNextPrayerDisplay() {
    if (!app.prayerTimes) return;
    
    // Находим следующую молитву
    const nextPrayer = app.prayerTimes.times.find(prayer => prayer.isUpcoming);
    
    if (nextPrayer) {
      elements.nextPrayerName.textContent = nextPrayer.name;
      elements.nextPrayerTime.textContent = nextPrayer.timeFormatted;
      
      // Запускаем обратный отсчет
      updateCountdown(nextPrayer);
    } else {
      // Если следующая молитва не найдена, берем первую молитву следующего дня
      elements.nextPrayerName.textContent = app.prayerTimes.times[0].name;
      elements.nextPrayerTime.textContent = app.prayerTimes.times[0].timeFormatted;
      elements.countdown.textContent = 'Tomorrow';
    }
  }

  /**
   * Запуск обратного отсчета до следующей молитвы
   */
  function startCountdown() {
    // Останавливаем предыдущий интервал, если есть
    if (app.countdownInterval) {
      clearInterval(app.countdownInterval);
    }
    
    // Находим следующую молитву
    const nextPrayer = app.prayerTimes?.times.find(prayer => prayer.isUpcoming);
    
    if (!nextPrayer) return;
    
    // Функция для обновления обратного отсчета
    const updateRemainingTime = () => {
      // Получаем текущее время в минутах
      const now = new Date();
      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();
      const currentSeconds = now.getSeconds();
      const currentTimeInMinutes = currentHours * 60 + currentMinutes;
      
      // Преобразуем время молитвы в минуты
      let prayerTimeInMinutes = nextPrayer.timeInMinutes;
      
      // Если время молитвы меньше текущего времени, значит молитва будет завтра
      if (prayerTimeInMinutes < currentTimeInMinutes) {
        prayerTimeInMinutes += 24 * 60; // Добавляем 24 часа
      }
      
      // Рассчитываем разницу в минутах
      const diffMinutes = prayerTimeInMinutes - currentTimeInMinutes;
      
      // Рассчитываем часы и минуты
      const hours = Math.floor(diffMinutes / 60);
      const minutes = diffMinutes % 60;
      
      // Рассчитываем секунды
      const seconds = 60 - currentSeconds;
      
      // Форматируем вывод
      let countdown = '';
      if (hours > 0) {
        countdown += `${hours}h `;
      }
      countdown += `${minutes}m ${seconds}s`;
      
      elements.countdown.textContent = countdown;
    };
    
    // Обновляем сразу и потом каждую секунду
    updateRemainingTime();
    app.countdownInterval = setInterval(updateRemainingTime, 1000);
  }

  /**
   * Обновление обратного отсчета для конкретной молитвы
   * @param {Object} prayer Объект молитвы
   */
  function updateCountdown(prayer) {
    if (!prayer) return;
    
    // Если есть рассчитанное оставшееся время, используем его
    if (prayer.remainingTime) {
      elements.countdown.textContent = prayer.remainingTime;
    }
  }

  /**
   * Загрузка месячного расписания молитв
   */
  async function loadMonthlyPrayerTimes() {
    if (!app.selectedLocation) return;
    
    try {
      // Показываем состояние загрузки
      elements.monthlyTableBody.innerHTML = '<tr><td colspan="7">Loading...</td></tr>';
      
      // Получаем данные о месячном расписании
      app.monthlyPrayerTimes = await window.prayerTimesApi.getMonthlyPrayerTimes(
        app.selectedLocation.latitude,
        app.selectedLocation.longitude,
        app.currentMonth,
        app.currentYear
      );
      
      // Обновляем отображение месяца
      elements.currentMonthDisplay.textContent = `${app.monthlyPrayerTimes.gregorianMonth} ${app.currentYear}`;
      
      // Обновляем таблицу
      updateMonthlyTable();
    } catch (error) {
      console.error('Error loading monthly prayer times:', error);
      elements.monthlyTableBody.innerHTML = '<tr><td colspan="7">Failed to load monthly schedule. Please try again.</td></tr>';
    }
  }

  /**
   * Обновление таблицы месячного расписания
   */
  function updateMonthlyTable() {
    if (!app.monthlyPrayerTimes) return;
    
    // Очищаем таблицу
    elements.monthlyTableBody.innerHTML = '';
    
    // Добавляем строки для каждого дня
    app.monthlyPrayerTimes.days.forEach(day => {
      const row = document.createElement('tr');
      
      row.innerHTML = `
        <td>${day.gregorianDay}</td>
        <td>${day.fajr}</td>
        <td>${day.sunrise}</td>
        <td>${day.dhuhr}</td>
        <td>${day.asr}</td>
        <td>${day.maghrib}</td>
        <td>${day.isha}</td>
      `;
      
      elements.monthlyTableBody.appendChild(row);
    });
  }

  /**
   * Обработчик нажатия на кнопку "Предыдущий месяц"
   */
  function handlePrevMonth() {
    if (app.currentMonth === 1) {
      app.currentMonth = 12;
      app.currentYear--;
    } else {
      app.currentMonth--;
    }
    
    loadMonthlyPrayerTimes();
  }

  /**
   * Обработчик нажатия на кнопку "Следующий месяц"
   */
  function handleNextMonth() {
    if (app.currentMonth === 12) {
      app.currentMonth = 1;
      app.currentYear++;
    } else {
      app.currentMonth++;
    }
    
    loadMonthlyPrayerTimes();
  }
});