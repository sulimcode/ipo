// Константы
const API_BASE_URL = 'https://api.aladhan.com/v1';
const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';

// Состояние приложения
const app = {
    state: {
        location: {
            name: 'Mecca',
            country: 'Saudi Arabia',
            latitude: 21.4225,
            longitude: 39.8262,
            value: 'mecca-saudi-arabia'
        },
        prayerTimes: null,
        monthlyPrayerTimes: null,
        currentMonth: new Date().getMonth() + 1,
        currentYear: new Date().getFullYear(),
        nextPrayer: null,
        isDarkMode: false,
        calculationMethod: 2, // По умолчанию: Egyptian General Authority of Survey
        searchResults: [],
        popularLocations: []
    },
    
    // DOM-элементы (будут инициализированы позже)
    elements: {},
    
    // Инициализация приложения
    init: function() {
        this.initElements();
        this.loadUserPreferences();
        this.setupEventListeners();
        this.loadPrayerTimes();
        
        // Локализация интерфейса
        translationsManager.localizeUI();
    },
    
    // Инициализация DOM-элементов
    initElements: function() {
        // Хедер
        this.elements.appTitle = document.getElementById('app-title');
        this.elements.languageSelect = document.getElementById('language-select');
        this.elements.themeToggle = document.getElementById('theme-toggle');
        
        // Дата
        this.elements.gregorianDate = document.getElementById('gregorian-date');
        this.elements.islamicDate = document.getElementById('islamic-date');
        
        // Местоположение
        this.elements.locationTitle = document.getElementById('location-title');
        this.elements.locationName = document.getElementById('location-name');
        this.elements.changeLocation = document.getElementById('change-location');
        this.elements.useGeolocation = document.getElementById('use-geolocation');
        this.elements.locationSearch = document.getElementById('location-search');
        this.elements.locationSearchInput = document.getElementById('location-search-input');
        this.elements.locationSearchResults = document.getElementById('location-search-results');
        this.elements.popularLocationsTitle = document.getElementById('popular-locations-title');
        this.elements.popularLocationsList = document.getElementById('popular-locations-list');
        
        // Метод расчета
        this.elements.calculationMethodTitle = document.getElementById('calculation-method-title');
        this.elements.calculationMethod = document.getElementById('calculation-method');
        
        // Следующая молитва
        this.elements.nextPrayerTitle = document.getElementById('next-prayer-title');
        this.elements.nextPrayerName = document.getElementById('next-prayer-name');
        this.elements.nextPrayerTime = document.getElementById('next-prayer-time');
        this.elements.countdown = document.getElementById('countdown');
        
        // Молитвы на сегодня
        this.elements.todayPrayerTitle = document.getElementById('today-prayer-title');
        this.elements.prayerList = document.getElementById('prayer-list');
        this.elements.fajrTime = document.getElementById('fajr-time');
        this.elements.sunriseTime = document.getElementById('sunrise-time');
        this.elements.dhuhrTime = document.getElementById('dhuhr-time');
        this.elements.asrTime = document.getElementById('asr-time');
        this.elements.maghribTime = document.getElementById('maghrib-time');
        this.elements.ishaTime = document.getElementById('isha-time');
        
        // Месячное расписание
        this.elements.toggleMonthlyView = document.getElementById('toggle-monthly-view');
        this.elements.monthlyViewLabel = document.getElementById('monthly-view-label');
        this.elements.monthlySchedule = document.getElementById('monthly-schedule');
        this.elements.prevMonth = document.getElementById('prev-month');
        this.elements.nextMonth = document.getElementById('next-month');
        this.elements.monthYearDisplay = document.getElementById('month-year-display');
        this.elements.monthlyGrid = document.getElementById('monthly-grid');
        
        // Модальное окно
        this.elements.dayModal = document.getElementById('day-modal');
        this.elements.modalDayTitle = document.getElementById('modal-day-title');
        this.elements.modalPrayerTimes = document.getElementById('modal-prayer-times');
        this.elements.closeModal = document.querySelector('.close-modal');
        
        // Футер
        this.elements.footerText = document.getElementById('footer-text');
        this.elements.currentYear = document.getElementById('current-year');
    },
    
    // Настройка обработчиков событий
    setupEventListeners: function() {
        // Переключение темы
        this.elements.themeToggle.addEventListener('click', this.toggleTheme.bind(this));
        
        // Изменение местоположения
        this.elements.changeLocation.addEventListener('click', this.showLocationSearch.bind(this));
        this.elements.useGeolocation.addEventListener('click', this.useGeolocation.bind(this));
        
        // Поиск местоположения
        this.elements.locationSearchInput.addEventListener('input', this.handleLocationSearch.bind(this));
        
        // Изменение метода расчета
        this.elements.calculationMethod.addEventListener('change', (e) => {
            this.changeCalculationMethod(e.target.value);
        });
        
        // Изменение языка
        this.elements.languageSelect.addEventListener('change', (e) => {
            this.changeLanguage(e.target.value);
        });
        
        // Месячное расписание
        this.elements.toggleMonthlyView.addEventListener('click', this.toggleMonthlyView.bind(this));
        this.elements.prevMonth.addEventListener('click', this.goToPreviousMonth.bind(this));
        this.elements.nextMonth.addEventListener('click', this.goToNextMonth.bind(this));
        
        // Модальное окно
        this.elements.closeModal.addEventListener('click', this.closeModal.bind(this));
        window.addEventListener('click', (e) => {
            if (e.target === this.elements.dayModal) {
                this.closeModal();
            }
        });
        
        // Клик вне поиска местоположения для его закрытия
        document.addEventListener('click', (e) => {
            if (!this.elements.locationSearch.contains(e.target) && 
                !this.elements.changeLocation.contains(e.target) && 
                !this.elements.locationSearch.classList.contains('hidden')) {
                this.hideLocationSearch();
            }
        });
        
        // Обновление обратного отсчета каждую минуту
        setInterval(this.updateCountdown.bind(this), 60000);
    },
    
    // Загрузка пользовательских настроек из localStorage
    loadUserPreferences: function() {
        // Тема
        this.state.isDarkMode = localStorage.getItem('darkMode') === 'true';
        document.body.classList.toggle('dark-mode', this.state.isDarkMode);
        
        // Обновление иконки темы
        const icon = this.elements.themeToggle.querySelector('i');
        if (icon) {
            icon.className = this.state.isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        // Метод расчета
        const savedMethod = localStorage.getItem('calculationMethod');
        if (savedMethod) {
            this.state.calculationMethod = parseInt(savedMethod);
            if (this.elements.calculationMethod) {
                this.elements.calculationMethod.value = savedMethod;
            }
        }
        
        // Язык
        const language = translationsManager.getCurrentLanguage();
        if (this.elements.languageSelect) {
            this.elements.languageSelect.value = language;
        }
        
        // Местоположение
        const savedLocation = localStorage.getItem('location');
        if (savedLocation) {
            try {
                this.state.location = JSON.parse(savedLocation);
            } catch (error) {
                console.error('Error parsing saved location:', error);
            }
        }
    },
    
    // ===== API-функции =====
    
    // Загрузка времен молитв для конкретных координат
    async loadPrayerTimes(latitude, longitude, method) {
        const lat = latitude || this.state.location.latitude;
        const lng = longitude || this.state.location.longitude;
        const calculationMethod = method || this.state.calculationMethod;
        
        const prayerTimes = await this.fetchPrayerTimes(lat, lng, calculationMethod);
        
        if (prayerTimes) {
            this.state.prayerTimes = prayerTimes;
            this.updateUI(prayerTimes);
        }
    },
    
    // Загрузка месячного расписания молитв
    async loadMonthlyData(latitude, longitude, month, year, method) {
        const lat = latitude || this.state.location.latitude;
        const lng = longitude || this.state.location.longitude;
        const m = month || this.state.currentMonth;
        const y = year || this.state.currentYear;
        const calculationMethod = method || this.state.calculationMethod;
        
        const monthlyData = await this.fetchMonthlyPrayerTimes(lat, lng, m, y, calculationMethod);
        
        if (monthlyData) {
            this.state.monthlyPrayerTimes = monthlyData;
            this.updateMonthlyView();
        }
    },
    
    // Получение времен молитв на день с API
    async fetchPrayerTimes(latitude, longitude, method = 2) {
        try {
            const today = new Date();
            const timestamp = Math.floor(today.getTime() / 1000);
            
            const url = `${API_BASE_URL}/timings/${timestamp}?latitude=${latitude}&longitude=${longitude}&method=${method}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            if (data.code === 200 && data.status === 'OK') {
                return this.processPrayerTimesResponse(data.data);
            } else {
                throw new Error('API error: ' + data.status);
            }
        } catch (error) {
            console.error('Error fetching prayer times:', error);
            return null;
        }
    },
    
    // Получение месячного расписания с API
    async fetchMonthlyPrayerTimes(latitude, longitude, month, year, method = 2) {
        try {
            const url = `${API_BASE_URL}/calendar/${year}/${month}?latitude=${latitude}&longitude=${longitude}&method=${method}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            if (data.code === 200 && data.status === 'OK') {
                return this.processMonthlyPrayerTimesResponse(data.data);
            } else {
                throw new Error('API error: ' + data.status);
            }
        } catch (error) {
            console.error('Error fetching monthly prayer times:', error);
            return null;
        }
    },
    
    // Поиск местоположений по названию
    async searchLocations(query) {
        try {
            const language = translationsManager.getCurrentLanguage();
            const url = `${GEOCODING_API_URL}?name=${encodeURIComponent(query)}&count=10&language=${language}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            
            const data = await response.json();
            if (data.results && data.results.length > 0) {
                return data.results.map(location => ({
                    name: location.name || 'Unknown',
                    country: location.country || 'Unknown',
                    latitude: location.latitude,
                    longitude: location.longitude,
                    value: `${(location.name || 'loc').toLowerCase().replace(/\s+/g, '-')}-${(location.country_code || 'un').toLowerCase()}`
                }));
            } else {
                return [];
            }
        } catch (error) {
            console.error('Error searching locations:', error);
            return [];
        }
    },
    
    // ===== Обработка данных =====
    
    // Обработка ответа API с временами молитв
    processPrayerTimesResponse(data) {
        const { timings, date, meta } = data;
        
        // Форматирование данных
        const prayerTimes = {
            date: date.readable,
            gregorianDate: `${date.gregorian.day} ${date.gregorian.month.en} ${date.gregorian.year}`,
            islamicDate: `${date.hijri.day} ${date.hijri.month.en} ${date.hijri.year} Hijri`,
            location: meta.timezone.split('/').pop().replace('_', ' '),
            timezone: meta.timezone,
            gmtOffset: this.calculateGmtOffset(meta.timezone),
            latitude: meta.latitude,
            longitude: meta.longitude,
            times: [
                { name: 'fajr', time: timings.Fajr },
                { name: 'sunrise', time: timings.Sunrise },
                { name: 'dhuhr', time: timings.Dhuhr },
                { name: 'asr', time: timings.Asr },
                { name: 'maghrib', time: timings.Maghrib },
                { name: 'isha', time: timings.Isha }
            ]
        };
        
        // Вычисление текущей и следующей молитвы
        this.calculateCurrentAndNextPrayer(prayerTimes);
        
        return prayerTimes;
    },
    
    // Обработка месячного расписания от API
    processMonthlyPrayerTimesResponse(data) {
        if (!data || !Array.isArray(data)) {
            console.error('Invalid data format for monthly prayer times');
            return null;
        }
        
        // Извлечение информации о месяце из первого дня
        const firstDay = data[0];
        if (!firstDay) return null;
        
        const monthlyData = {
            gregorianMonth: firstDay.date.gregorian.month.en,
            gregorianYear: parseInt(firstDay.date.gregorian.year),
            islamicMonth: firstDay.date.hijri.month.en,
            islamicYear: parseInt(firstDay.date.hijri.year),
            days: []
        };
        
        // Обработка каждого дня
        data.forEach(dayData => {
            const { date, timings } = dayData;
            
            const day = {
                gregorianDate: date.gregorian.date,
                islamicDate: date.hijri.date,
                gregorianDay: parseInt(date.gregorian.day),
                islamicDay: parseInt(date.hijri.day),
                gregorianMonth: parseInt(date.gregorian.month.number),
                islamicMonth: parseInt(date.hijri.month.number),
                fajr: this.formatTime(timings.Fajr),
                sunrise: this.formatTime(timings.Sunrise),
                dhuhr: this.formatTime(timings.Dhuhr),
                asr: this.formatTime(timings.Asr),
                maghrib: this.formatTime(timings.Maghrib),
                isha: this.formatTime(timings.Isha)
            };
            
            monthlyData.days.push(day);
        });
        
        return monthlyData;
    },
    
    // Вычисление смещения часового пояса для timezone
    calculateGmtOffset(timezone) {
        try {
            const date = new Date();
            const options = { timeZone: timezone, timeZoneName: 'short' };
            const timeString = date.toLocaleTimeString('en-US', options);
            
            // Извлечение GMT-смещения из строки времени
            const match = timeString.match(/GMT([-+])(\d+)(?::(\d+))?/);
            if (match) {
                const sign = match[1] === '-' ? -1 : 1;
                const hours = parseInt(match[2] || 0);
                const minutes = parseInt(match[3] || 0);
                return sign * (hours * 3600 + minutes * 60);
            }
            
            // Запасной вариант: оценка на основе текущего смещения
            return date.getTimezoneOffset() * -60;
        } catch (error) {
            console.error('Error calculating GMT offset:', error);
            return 0;
        }
    },
    
    // Форматирование времени (удаление секунд, если они есть)
    formatTime(timeString) {
        if (!timeString) return '';
        return timeString.substring(0, 5);
    },
    
    // Вычисление текущей и следующей молитвы
    calculateCurrentAndNextPrayer(prayerTimes) {
        if (!prayerTimes || !prayerTimes.times) return;
        
        const now = new Date();
        let currentHours = now.getHours();
        let currentMinutes = now.getMinutes();
        const currentTime = currentHours * 60 + currentMinutes;
        
        // Если доступна информация о часовом поясе, корректируем текущее время
        if (prayerTimes.timezone) {
            try {
                const options = { timeZone: prayerTimes.timezone };
                const locationTime = new Date().toLocaleString('en-US', options);
                const locationDate = new Date(locationTime);
                
                currentHours = locationDate.getHours();
                currentMinutes = locationDate.getMinutes();
            } catch (error) {
                console.warn('Error adjusting time for timezone:', error);
                // Продолжаем с локальным временем
            }
        }
        
        // Преобразование строк времени в минуты с полуночи
        prayerTimes.times.forEach(prayer => {
            const [hours, minutes] = prayer.time.split(':').map(Number);
            prayer.timeInMinutes = hours * 60 + minutes;
            prayer.isCurrent = false;
            prayer.isUpcoming = false;
            
            // Форматирование времени молитвы для отображения
            prayer.timeFormatted = this.formatTime(prayer.time);
        });
        
        // Поиск текущей и следующей молитвы
        let currentPrayer = null;
        let nextPrayer = null;
        
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
        
        // Если в текущем дне не найдена следующая молитва, то это первая молитва завтрашнего дня
        if (!nextPrayer && prayerTimes.times.length > 0) {
            nextPrayer = prayerTimes.times[0];
            nextPrayer.isUpcoming = true;
        }
        
        // Вычисление оставшегося времени до следующей молитвы
        if (nextPrayer) {
            let timeUntilNextPrayer = nextPrayer.timeInMinutes - (currentHours * 60 + currentMinutes);
            
            // Если следующая молитва завтра
            if (timeUntilNextPrayer < 0) {
                timeUntilNextPrayer += 24 * 60;
            }
            
            nextPrayer.remainingTime = this.formatRemainingTime(timeUntilNextPrayer);
        }
        
        // Отладочная информация о всех молитвах
        console.log("Все молитвы:", prayerTimes.times.map(p => 
            `${p.name}: ${p.timeFormatted} (${p.timeInMinutes}min) isCurrent:${p.isCurrent} isUpcoming:${p.isUpcoming}`
        ));
        
        // Отладочная информация о следующей молитве
        if (nextPrayer) {
            console.log("Следующая молитва из флагов:", nextPrayer.name, nextPrayer.timeFormatted);
        }
        
        // Обновление состояния приложения
        this.state.nextPrayer = nextPrayer;
    },
    
    // Форматирование оставшегося времени до следующей молитвы
    formatRemainingTime(minutes) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        
        const hoursAbbr = translationsManager.getTranslation('hoursAbbr');
        const minutesAbbr = translationsManager.getTranslation('minutesAbbr');
        
        if (hours > 0) {
            return `${hours}${hoursAbbr} ${mins}${minutesAbbr}`;
        } else {
            return `${mins}${minutesAbbr}`;
        }
    },
    
    // ===== Функции обновления интерфейса =====
    
    // Обновление интерфейса данными о молитвах
    updateUI(prayerTimes) {
        if (!prayerTimes) return;
        
        // Обновление дат
        this.elements.gregorianDate.textContent = prayerTimes.gregorianDate;
        this.elements.islamicDate.textContent = prayerTimes.islamicDate;
        
        // Обновление названия местоположения
        if (this.state.location && this.state.location.name) {
            this.elements.locationName.textContent = this.state.location.name;
        } else {
            this.elements.locationName.textContent = prayerTimes.location || 'Unknown Location';
        }
        
        // Обновление времен молитв
        const prayerElements = [
            { name: 'fajr', element: this.elements.fajrTime },
            { name: 'sunrise', element: this.elements.sunriseTime },
            { name: 'dhuhr', element: this.elements.dhuhrTime },
            { name: 'asr', element: this.elements.asrTime },
            { name: 'maghrib', element: this.elements.maghribTime },
            { name: 'isha', element: this.elements.ishaTime }
        ];
        
        prayerTimes.times.forEach((prayer, index) => {
            if (prayerElements[index] && prayerElements[index].element) {
                prayerElements[index].element.textContent = prayer.timeFormatted || prayer.time;
            }
            
            // Выделение текущей молитвы в списке
            const prayerItem = document.getElementById(`${prayer.name}-item`);
            if (prayerItem) {
                prayerItem.classList.toggle('current', prayer.isCurrent);
            }
        });
        
        // Обновление информации о следующей молитве
        if (this.state.nextPrayer) {
            const prayerName = translationsManager.getTranslation(this.state.nextPrayer.name);
            this.elements.nextPrayerName.textContent = prayerName;
            this.elements.nextPrayerTime.textContent = this.state.nextPrayer.timeFormatted || this.state.nextPrayer.time;
            this.updateCountdown();
        }
    },
    
    // Обновление обратного отсчета
    updateCountdown() {
        if (!this.state.nextPrayer) return;
        
        const now = new Date();
        let currentTime = now.getHours() * 60 + now.getMinutes();
        
        // Если доступна информация о часовом поясе, корректируем текущее время
        if (this.state.prayerTimes && this.state.prayerTimes.timezone) {
            try {
                const options = { timeZone: this.state.prayerTimes.timezone };
                const locationTime = new Date().toLocaleString('en-US', options);
                const locationDate = new Date(locationTime);
                
                currentTime = locationDate.getHours() * 60 + locationDate.getMinutes();
            } catch (error) {
                console.warn('Error adjusting time for timezone:', error);
                // Продолжаем с локальным временем
            }
        }
        
        let timeUntilNextPrayer = this.state.nextPrayer.timeInMinutes - currentTime;
        
        // Если следующая молитва завтра
        if (timeUntilNextPrayer < 0) {
            timeUntilNextPrayer += 24 * 60;
        }
        
        // Форматирование обратного отсчета
        const remainingTime = this.formatRemainingTime(timeUntilNextPrayer);
        this.elements.countdown.textContent = `${remainingTime} ${translationsManager.getTranslation('timeRemaining')}`;
    },
    
    // Обновление месячного календаря
    updateMonthlyView() {
        if (!this.state.monthlyPrayerTimes || !this.elements.monthlyGrid) return;
        
        // Обновление отображения месяца-года
        const monthName = this.state.monthlyPrayerTimes.gregorianMonth;
        const year = this.state.monthlyPrayerTimes.gregorianYear;
        this.elements.monthYearDisplay.textContent = `${monthName} ${year}`;
        
        // Очистка существующей сетки
        this.elements.monthlyGrid.innerHTML = '';
        
        // Добавление заголовков дней недели (Вс, Пн, Вт и т.д.)
        const shortWeekdays = translationsManager.getTranslation('shortWeekdays');
        
        shortWeekdays.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'day-header';
            dayHeader.textContent = day;
            this.elements.monthlyGrid.appendChild(dayHeader);
        });
        
        // Получение первого дня месяца для вычисления отступа
        const firstDay = new Date(year, this.state.currentMonth - 1, 1);
        const firstDayOfWeek = firstDay.getDay(); // 0 = Воскресенье, 1 = Понедельник и т.д.
        
        // Добавление пустых ячеек для дней перед 1-м числом
        for (let i = 0; i < firstDayOfWeek; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'day-cell empty';
            this.elements.monthlyGrid.appendChild(emptyCell);
        }
        
        // Добавление дней месяца
        const today = new Date();
        const isCurrentMonth = today.getMonth() + 1 === this.state.currentMonth && today.getFullYear() === this.state.currentYear;
        const currentDay = today.getDate();
        
        this.state.monthlyPrayerTimes.days.forEach(day => {
            const dayCell = document.createElement('div');
            dayCell.className = 'day-cell';
            
            // Проверка, является ли этот день текущим
            if (isCurrentMonth && day.gregorianDay === currentDay) {
                dayCell.classList.add('current-day');
            }
            
            // Добавление номера дня
            const dayNumber = document.createElement('div');
            dayNumber.className = 'day-number';
            dayNumber.textContent = day.gregorianDay;
            dayCell.appendChild(dayNumber);
            
            // Добавление времени Фаджр и Иша
            const fajrTime = document.createElement('div');
            fajrTime.className = 'day-fajr';
            fajrTime.textContent = `${translationsManager.getTranslation('fajr')}: ${day.fajr}`;
            dayCell.appendChild(fajrTime);
            
            const ishaTime = document.createElement('div');
            ishaTime.className = 'day-isha';
            ishaTime.textContent = `${translationsManager.getTranslation('isha')}: ${day.isha}`;
            dayCell.appendChild(ishaTime);
            
            // Добавление события клика для показа детальных времен молитв на этот день
            dayCell.addEventListener('click', () => {
                this.showDayDetails(day);
            });
            
            this.elements.monthlyGrid.appendChild(dayCell);
        });
    },
    
    // ===== Обработчики пользовательских действий =====
    
    // Переключение темы
    toggleTheme() {
        this.state.isDarkMode = !this.state.isDarkMode;
        document.body.classList.toggle('dark-mode', this.state.isDarkMode);
        
        // Обновление иконки переключателя темы
        const icon = this.elements.themeToggle.querySelector('i');
        if (icon) {
            if (this.state.isDarkMode) {
                icon.className = 'fas fa-sun';
            } else {
                icon.className = 'fas fa-moon';
            }
        }
        
        // Сохранение предпочтения в localStorage
        localStorage.setItem('darkMode', this.state.isDarkMode);
        console.log("Using local theme preference");
    },
    
    // Показ панели поиска местоположения
    showLocationSearch() {
        this.elements.locationSearch.classList.remove('hidden');
        this.elements.locationSearchInput.focus();
        
        // Загрузка популярных мест
        this.state.popularLocations = this.loadPopularLocations();
        this.updatePopularLocationsList();
    },
    
    // Скрытие панели поиска местоположения
    hideLocationSearch() {
        this.elements.locationSearch.classList.add('hidden');
    },
    
    // Обработка ввода в поле поиска местоположения
    async handleLocationSearch(e) {
        const query = e.target.value.trim();
        if (query.length < 2) {
            this.elements.locationSearchResults.innerHTML = '';
            return;
        }
        
        const results = await this.searchLocations(query);
        this.state.searchResults = results;
        this.updateSearchResults(results);
    },
    
    // Обновление списка результатов поиска
    updateSearchResults(results) {
        if (!this.elements.locationSearchResults) return;
        
        this.elements.locationSearchResults.innerHTML = '';
        
        if (results.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.textContent = 'No results found';
            this.elements.locationSearchResults.appendChild(noResults);
            return;
        }
        
        results.forEach(location => {
            const item = document.createElement('div');
            item.className = 'search-item';
            item.textContent = `${location.name}, ${location.country}`;
            item.dataset.value = location.value;
            item.dataset.lat = location.latitude;
            item.dataset.lng = location.longitude;
            
            item.addEventListener('click', () => {
                this.selectLocation(location);
            });
            
            this.elements.locationSearchResults.appendChild(item);
        });
    },
    
    // Обновление списка популярных мест
    updatePopularLocationsList() {
        if (!this.elements.popularLocationsList) return;
        
        this.elements.popularLocationsList.innerHTML = '';
        
        this.state.popularLocations.forEach(location => {
            const item = document.createElement('div');
            item.className = 'popular-location-item';
            item.textContent = `${location.name}, ${location.country}`;
            item.dataset.value = location.value;
            item.dataset.lat = location.latitude;
            item.dataset.lng = location.longitude;
            
            item.addEventListener('click', () => {
                this.selectLocation(location);
            });
            
            this.elements.popularLocationsList.appendChild(item);
        });
    },
    
    // Выбор местоположения
    selectLocation(location) {
        this.state.location = location;
        this.elements.locationName.textContent = `${location.name}, ${location.country}`;
        
        // Сохранение в localStorage
        localStorage.setItem('location', JSON.stringify(location));
        
        // Скрытие панели поиска
        this.hideLocationSearch();
        
        // Загрузка времен молитв для нового местоположения
        this.loadPrayerTimes(location.latitude, location.longitude);
        
        // Также загружаем месячные данные, если месячный вид видим
        if (!this.elements.monthlySchedule.classList.contains('hidden')) {
            this.loadMonthlyData(location.latitude, location.longitude, this.state.currentMonth, this.state.currentYear);
        }
    },
    
    // Использование геолокации для получения местоположения пользователя
    useGeolocation() {
        if (navigator.geolocation) {
            // Показ индикатора загрузки
            this.elements.locationName.textContent = translationsManager.getTranslation('loading');
            
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const { latitude, longitude } = position.coords;
                    
                    // Попытка получить название местоположения с помощью обратного геокодирования
                    try {
                        const language = translationsManager.getCurrentLanguage();
                        const url = `${GEOCODING_API_URL}?latitude=${latitude}&longitude=${longitude}&count=1&language=${language}`;
                        const response = await fetch(url);
                        
                        if (response.ok) {
                            const data = await response.json();
                            if (data.results && data.results.length > 0) {
                                const result = data.results[0];
                                const location = {
                                    name: result.name,
                                    country: result.country,
                                    latitude,
                                    longitude,
                                    value: `${result.name.toLowerCase().replace(/\s+/g, '-')}-${result.country_code.toLowerCase()}`
                                };
                                
                                this.selectLocation(location);
                                return;
                            }
                        }
                    } catch (error) {
                        console.error('Error getting location name:', error);
                    }
                    
                    // Запасной вариант, если обратное геокодирование не удалось
                    const unknownLocation = {
                        name: translationsManager.getCurrentLanguage() === 'ru' ? 'Мое местоположение' : 'My Location',
                        country: '',
                        latitude,
                        longitude,
                        value: `custom-${latitude.toFixed(4)}-${longitude.toFixed(4)}`
                    };
                    
                    this.selectLocation(unknownLocation);
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    alert('Could not get your location. Please check your browser settings.');
                    
                    // Сброс имени местоположения
                    this.elements.locationName.textContent = this.state.location.name;
                },
                { timeout: 10000 }
            );
        } else {
            alert('Geolocation is not supported by this browser.');
        }
    },
    
    // Изменение метода расчета
    changeCalculationMethod(method) {
        this.state.calculationMethod = parseInt(method);
        localStorage.setItem('calculationMethod', this.state.calculationMethod.toString());
        
        if (this.state.location) {
            this.loadPrayerTimes(this.state.location.latitude, this.state.location.longitude, this.state.calculationMethod);
            
            // Перезагрузка месячных данных, если видны
            if (!this.elements.monthlySchedule.classList.contains('hidden')) {
                this.loadMonthlyData(this.state.location.latitude, this.state.location.longitude, this.state.currentMonth, this.state.currentYear, this.state.calculationMethod);
            }
        }
    },
    
    // Изменение языка
    changeLanguage(language) {
        translationsManager.setLanguage(language);
        translationsManager.localizeUI();
        
        // Обновление популярных мест для нового языка
        this.state.popularLocations = this.loadPopularLocations(language);
        this.updatePopularLocationsList();
        
        // Перезагрузка данных времен молитв
        if (this.state.prayerTimes) {
            this.updateUI(this.state.prayerTimes);
        }
        
        // Перезагрузка месячных данных, если видны
        if (this.state.monthlyPrayerTimes && !this.elements.monthlySchedule.classList.contains('hidden')) {
            this.updateMonthlyView();
        }
        
        console.log("Using local language preference");
    },
    
    // Переключение месячного вида
    toggleMonthlyView() {
        const isHidden = this.elements.monthlySchedule.classList.contains('hidden');
        this.elements.monthlySchedule.classList.toggle('hidden', !isHidden);
        
        // Обновление текста кнопки
        this.elements.monthlyViewLabel.textContent = isHidden ? 
            translationsManager.getTranslation('hideMonthly') : 
            translationsManager.getTranslation('showMonthly');
        
        // Загрузка месячных данных, если они еще не загружены
        if (isHidden && this.state.location) {
            this.loadMonthlyData(this.state.location.latitude, this.state.location.longitude, this.state.currentMonth, this.state.currentYear);
        }
    },
    
    // Переход к предыдущему месяцу
    goToPreviousMonth() {
        this.state.currentMonth--;
        if (this.state.currentMonth < 1) {
            this.state.currentMonth = 12;
            this.state.currentYear--;
        }
        
        if (this.state.location) {
            this.loadMonthlyData(this.state.location.latitude, this.state.location.longitude, this.state.currentMonth, this.state.currentYear);
        }
    },
    
    // Переход к следующему месяцу
    goToNextMonth() {
        this.state.currentMonth++;
        if (this.state.currentMonth > 12) {
            this.state.currentMonth = 1;
            this.state.currentYear++;
        }
        
        if (this.state.location) {
            this.loadMonthlyData(this.state.location.latitude, this.state.location.longitude, this.state.currentMonth, this.state.currentYear);
        }
    },
    
    // Показ подробных времен молитв для конкретного дня
    showDayDetails(day) {
        if (!this.elements.dayModal || !this.elements.modalPrayerTimes) return;
        
        // Обновление заголовка модального окна
        const dateText = `${day.gregorianDay} ${this.state.monthlyPrayerTimes.gregorianMonth} ${this.state.monthlyPrayerTimes.gregorianYear}`;
        this.elements.modalDayTitle.textContent = `${translationsManager.getTranslation('prayerTimesFor')} ${dateText}`;
        
        // Очистка существующего содержимого
        this.elements.modalPrayerTimes.innerHTML = '';
        
        // Добавление времен молитв в модальное окно
        const prayers = [
            { name: 'fajr', time: day.fajr },
            { name: 'sunrise', time: day.sunrise },
            { name: 'dhuhr', time: day.dhuhr },
            { name: 'asr', time: day.asr },
            { name: 'maghrib', time: day.maghrib },
            { name: 'isha', time: day.isha }
        ];
        
        prayers.forEach(prayer => {
            const prayerItem = document.createElement('div');
            prayerItem.className = 'modal-prayer-item';
            
            const prayerName = document.createElement('span');
            prayerName.className = 'modal-prayer-name';
            prayerName.textContent = translationsManager.getTranslation(prayer.name);
            
            const prayerTime = document.createElement('span');
            prayerTime.className = 'modal-prayer-time';
            prayerTime.textContent = prayer.time;
            
            prayerItem.appendChild(prayerName);
            prayerItem.appendChild(prayerTime);
            this.elements.modalPrayerTimes.appendChild(prayerItem);
        });
        
        // Показ модального окна
        this.elements.dayModal.style.display = 'block';
    },
    
    // Закрытие модального окна
    closeModal() {
        if (this.elements.dayModal) {
            this.elements.dayModal.style.display = 'none';
        }
    },
    
    // Загрузка популярных местоположений в зависимости от языка
    loadPopularLocations(language) {
        language = language || translationsManager.getCurrentLanguage();
        
        // Популярные местоположения на английском (по умолчанию)
        let locations = [
            { name: 'Mecca', country: 'Saudi Arabia', latitude: 21.4225, longitude: 39.8262, value: 'mecca-saudi-arabia' },
            { name: 'Medina', country: 'Saudi Arabia', latitude: 24.5247, longitude: 39.5692, value: 'medina-saudi-arabia' },
            { name: 'Istanbul', country: 'Turkey', latitude: 41.0082, longitude: 28.9784, value: 'istanbul-turkey' },
            { name: 'Cairo', country: 'Egypt', latitude: 30.0444, longitude: 31.2357, value: 'cairo-egypt' },
            { name: 'Dubai', country: 'United Arab Emirates', latitude: 25.2048, longitude: 55.2708, value: 'dubai-uae' },
            { name: 'Moscow', country: 'Russia', latitude: 55.7558, longitude: 37.6173, value: 'moscow-russia' }
        ];
        
        // Популярные местоположения на русском
        if (language === 'ru') {
            locations = [
                { name: 'Мекка', country: 'Саудовская Аравия', latitude: 21.4225, longitude: 39.8262, value: 'mecca-saudi-arabia' },
                { name: 'Медина', country: 'Саудовская Аравия', latitude: 24.5247, longitude: 39.5692, value: 'medina-saudi-arabia' },
                { name: 'Стамбул', country: 'Турция', latitude: 41.0082, longitude: 28.9784, value: 'istanbul-turkey' },
                { name: 'Каир', country: 'Египет', latitude: 30.0444, longitude: 31.2357, value: 'cairo-egypt' },
                { name: 'Дубай', country: 'ОАЭ', latitude: 25.2048, longitude: 55.2708, value: 'dubai-uae' },
                { name: 'Москва', country: 'Россия', latitude: 55.7558, longitude: 37.6173, value: 'moscow-russia' }
            ];
        }
        // Популярные местоположения на арабском
        else if (language === 'ar') {
            locations = [
                { name: 'مكة', country: 'المملكة العربية السعودية', latitude: 21.4225, longitude: 39.8262, value: 'mecca-saudi-arabia' },
                { name: 'المدينة المنورة', country: 'المملكة العربية السعودية', latitude: 24.5247, longitude: 39.5692, value: 'medina-saudi-arabia' },
                { name: 'اسطنبول', country: 'تركيا', latitude: 41.0082, longitude: 28.9784, value: 'istanbul-turkey' },
                { name: 'القاهرة', country: 'مصر', latitude: 30.0444, longitude: 31.2357, value: 'cairo-egypt' },
                { name: 'دبي', country: 'الإمارات العربية المتحدة', latitude: 25.2048, longitude: 55.2708, value: 'dubai-uae' },
                { name: 'موسكو', country: 'روسيا', latitude: 55.7558, longitude: 37.6173, value: 'moscow-russia' }
            ];
        }
        // Популярные местоположения на французском
        else if (language === 'fr') {
            locations = [
                { name: 'La Mecque', country: 'Arabie Saoudite', latitude: 21.4225, longitude: 39.8262, value: 'mecca-saudi-arabia' },
                { name: 'Médine', country: 'Arabie Saoudite', latitude: 24.5247, longitude: 39.5692, value: 'medina-saudi-arabia' },
                { name: 'Istanbul', country: 'Turquie', latitude: 41.0082, longitude: 28.9784, value: 'istanbul-turkey' },
                { name: 'Le Caire', country: 'Égypte', latitude: 30.0444, longitude: 31.2357, value: 'cairo-egypt' },
                { name: 'Dubaï', country: 'Émirats Arabes Unis', latitude: 25.2048, longitude: 55.2708, value: 'dubai-uae' },
                { name: 'Moscou', country: 'Russie', latitude: 55.7558, longitude: 37.6173, value: 'moscow-russia' }
            ];
        }
        
        return locations;
    }
};

// Запуск приложения после загрузки DOM
document.addEventListener('DOMContentLoaded', function() {
    app.init();
});