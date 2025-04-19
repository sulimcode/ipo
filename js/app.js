// Константы
const API_BASE_URL = 'http://localhost:8000/api';

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
        this.loadPopularLocationsList();
        
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
    
    // Загрузка пользовательских настроек из localStorage и сервера
    async loadUserPreferences() {
        // Попытка загрузить настройки с сервера
        try {
            const response = await fetch(`${API_BASE_URL}/preferences`);
            if (response.ok) {
                const preferences = await response.json();
                
                // Применяем настройки темы
                if (preferences.theme) {
                    this.state.isDarkMode = preferences.theme === 'dark';
                    document.body.classList.toggle('dark-mode', this.state.isDarkMode);
                    const icon = this.elements.themeToggle.querySelector('i');
                    if (icon) {
                        icon.className = this.state.isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
                    }
                }
                
                // Применяем настройки языка
                if (preferences.language) {
                    translationsManager.setLanguage(preferences.language);
                    this.elements.languageSelect.value = preferences.language;
                }
                
                // Применяем настройки местоположения
                if (preferences.location) {
                    this.state.location = preferences.location;
                }
                
                // Загружаем данные молитв после получения настроек
                this.loadPrayerTimes();
                return;
            }
        } catch (error) {
            console.error('Error loading preferences from server:', error);
        }
        
        // Если не удалось загрузить с сервера, используем localStorage
        
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
        
        // Загружаем данные молитв
        this.loadPrayerTimes();
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
            
            // При загрузке молитв, обновляем текст местоположения
            this.elements.locationName.textContent = this.state.location.name;
        }
        
        // Загружаем месячное расписание, если оно открыто
        if (!this.elements.monthlySchedule.classList.contains('hidden')) {
            await this.loadMonthlyData(lat, lng, this.state.currentMonth, this.state.currentYear, calculationMethod);
        }
    },
    
    // Загрузка месячных данных для конкретных координат
    async loadMonthlyData(latitude, longitude, month, year, method) {
        const lat = latitude || this.state.location.latitude;
        const lng = longitude || this.state.location.longitude;
        const calculationMethod = method || this.state.calculationMethod;
        
        const monthlyData = await this.fetchMonthlyPrayerTimes(lat, lng, month, year, calculationMethod);
        
        if (monthlyData) {
            this.state.monthlyPrayerTimes = monthlyData;
            this.updateMonthlyView();
        }
    },
    
    // Запрос к API для получения времен молитв
    async fetchPrayerTimes(latitude, longitude, method = 2) {
        try {
            const url = `${API_BASE_URL}/prayer-times?latitude=${latitude}&longitude=${longitude}&method=${method}`;
            const response = await fetch(url);
            
            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                throw new Error(`Failed to fetch prayer times: ${response.status}`);
            }
        } catch (error) {
            console.error('Error fetching prayer times:', error);
            return null;
        }
    },
    
    // Запрос к API для получения месячных времен молитв
    async fetchMonthlyPrayerTimes(latitude, longitude, month, year, method = 2) {
        try {
            const url = `${API_BASE_URL}/prayer-times/monthly?latitude=${latitude}&longitude=${longitude}&month=${month}&year=${year}&method=${method}`;
            const response = await fetch(url);
            
            if (response.ok) {
                const data = await response.json();
                return data;
            } else {
                throw new Error(`Failed to fetch monthly prayer times: ${response.status}`);
            }
        } catch (error) {
            console.error('Error fetching monthly prayer times:', error);
            return null;
        }
    },
    
    // Поиск местоположения по запросу
    async searchLocations(query) {
        if (!query || query.length < 2) {
            this.state.searchResults = [];
            this.updateSearchResults([]);
            return;
        }
        
        try {
            const url = `${API_BASE_URL}/locations/search?q=${encodeURIComponent(query)}`;
            const response = await fetch(url);
            
            if (response.ok) {
                const data = await response.json();
                this.state.searchResults = data;
                this.updateSearchResults(data);
            } else {
                throw new Error(`Failed to search locations: ${response.status}`);
            }
        } catch (error) {
            console.error('Error searching locations:', error);
            this.updateSearchResults([]);
        }
    },
    
    // ===== Функции обработки данных и расчета =====
    
    // Расчет текущей и следующей молитвы
    calculateCurrentAndNextPrayer(prayerTimes) {
        if (!prayerTimes || !prayerTimes.times || prayerTimes.times.length === 0) {
            return { currentPrayer: null, nextPrayer: null };
        }
        
        // Логируем все молитвы для отладки
        console.log("Все молитвы:", prayerTimes.times.map(p => 
            `${p.name}: ${p.time} (${p.timeInMinutes}min) isCurrent:${p.isCurrent} isUpcoming:${p.isUpcoming}`
        ));
        
        // Находим текущую молитву
        const currentPrayer = prayerTimes.times.find(prayer => prayer.isCurrent);
        
        // Находим следующую молитву
        const nextPrayer = prayerTimes.times.find(prayer => prayer.isUpcoming);
        
        // Отладочная информация о следующей молитве
        if (nextPrayer) {
            console.log("Следующая молитва из флагов:", nextPrayer.name, nextPrayer.timeFormatted);
        }
        
        // Обновление состояния приложения
        this.state.nextPrayer = nextPrayer;
        
        return { currentPrayer, nextPrayer };
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
        }
        
        // Обновление времен молитв в списке
        if (prayerTimes.times && prayerTimes.times.length >= 6) {
            this.elements.fajrTime.textContent = prayerTimes.times[0].timeFormatted;
            this.elements.sunriseTime.textContent = prayerTimes.times[1].timeFormatted;
            this.elements.dhuhrTime.textContent = prayerTimes.times[2].timeFormatted;
            this.elements.asrTime.textContent = prayerTimes.times[3].timeFormatted;
            this.elements.maghribTime.textContent = prayerTimes.times[4].timeFormatted;
            this.elements.ishaTime.textContent = prayerTimes.times[5].timeFormatted;
            
            // Определение текущей и следующей молитвы
            const { currentPrayer, nextPrayer } = this.calculateCurrentAndNextPrayer(prayerTimes);
            
            // Удаление класса current со всех молитв
            const prayerItems = document.querySelectorAll('.prayer-item');
            prayerItems.forEach(item => item.classList.remove('current'));
            
            // Добавление класса current для текущей молитвы
            if (currentPrayer) {
                const currentItem = document.getElementById(`${currentPrayer.name.toLowerCase()}-item`);
                if (currentItem) {
                    currentItem.classList.add('current');
                }
            }
            
            // Обновление информации о следующей молитве
            if (nextPrayer) {
                const prayerName = translationsManager.getTranslation(nextPrayer.name.toLowerCase());
                this.elements.nextPrayerName.textContent = prayerName;
                this.elements.nextPrayerTime.textContent = nextPrayer.timeFormatted;
                
                // Обновление обратного отсчета
                this.updateCountdown();
            } else {
                this.elements.nextPrayerName.textContent = translationsManager.getTranslation('loading');
                this.elements.nextPrayerTime.textContent = '--:--';
                this.elements.countdown.textContent = '';
            }
        }
    },
    
    // Обновление обратного отсчета до следующей молитвы
    updateCountdown() {
        if (!this.state.nextPrayer) return;
        
        const now = new Date();
        const currentTimeInMinutes = now.getHours() * 60 + now.getMinutes();
        
        let timeToNextPrayer = this.state.nextPrayer.timeInMinutes - currentTimeInMinutes;
        
        // Если время отрицательное, значит молитва в следующем дне
        if (timeToNextPrayer < 0) {
            timeToNextPrayer += 24 * 60; // Добавляем сутки в минутах
        }
        
        const formattedTime = this.formatRemainingTime(timeToNextPrayer);
        const remainingText = translationsManager.getTranslation('timeRemaining');
        
        this.elements.countdown.textContent = `${formattedTime} ${remainingText}`;
    },
    
    // Обновление месячного представления
    updateMonthlyView() {
        if (!this.state.monthlyPrayerTimes) return;
        
        // Обновляем заголовок месяца
        const monthYearText = `${this.state.monthlyPrayerTimes.gregorianMonth} ${this.state.monthlyPrayerTimes.gregorianYear}`;
        this.elements.monthYearDisplay.textContent = monthYearText;
        
        // Очищаем сетку месяца
        this.elements.monthlyGrid.innerHTML = '';
        
        // Получаем перевод для дней недели
        const shortWeekdays = translationsManager.getTranslation('shortWeekdays');
        
        // Добавляем заголовки для дней недели
        shortWeekdays.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'day-header';
            dayHeader.textContent = day;
            this.elements.monthlyGrid.appendChild(dayHeader);
        });
        
        // Определяем первый день месяца
        const firstDay = new Date(this.state.currentYear, this.state.currentMonth - 1, 1);
        const startingDay = firstDay.getDay(); // 0 для воскресенья, 1 для понедельника и т.д.
        
        // Добавляем пустые ячейки для выравнивания
        for (let i = 0; i < startingDay; i++) {
            const emptyCell = document.createElement('div');
            emptyCell.className = 'day-cell empty';
            this.elements.monthlyGrid.appendChild(emptyCell);
        }
        
        // Получаем текущую дату
        const today = new Date();
        const currentDay = today.getDate();
        const currentMonth = today.getMonth() + 1;
        const currentYear = today.getFullYear();
        
        // Добавляем дни месяца
        if (this.state.monthlyPrayerTimes.days) {
            this.state.monthlyPrayerTimes.days.forEach(day => {
                const dayCell = document.createElement('div');
                dayCell.className = 'day-cell';
                
                // Проверяем, является ли этот день текущим
                if (day.gregorianDay === currentDay && 
                    this.state.currentMonth === currentMonth && 
                    this.state.currentYear === currentYear) {
                    dayCell.classList.add('current-day');
                }
                
                // Добавляем номер дня
                const dayNumber = document.createElement('div');
                dayNumber.className = 'day-number';
                dayNumber.textContent = day.gregorianDay;
                dayCell.appendChild(dayNumber);
                
                // Добавляем время Фаджр
                const fajrTime = document.createElement('div');
                fajrTime.className = 'day-fajr';
                fajrTime.textContent = `${translationsManager.getTranslation('fajr')}: ${day.fajr}`;
                dayCell.appendChild(fajrTime);
                
                // Добавляем время Иша
                const ishaTime = document.createElement('div');
                ishaTime.className = 'day-isha';
                ishaTime.textContent = `${translationsManager.getTranslation('isha')}: ${day.isha}`;
                dayCell.appendChild(ishaTime);
                
                // Добавляем обработчик для показа модального окна
                dayCell.addEventListener('click', () => this.showDayDetails(day));
                
                this.elements.monthlyGrid.appendChild(dayCell);
            });
        }
    },
    
    // Загрузка списка популярных местоположений
    async loadPopularLocationsList() {
        try {
            const response = await fetch(`${API_BASE_URL}/locations/popular`);
            if (response.ok) {
                const data = await response.json();
                this.state.popularLocations = data;
                this.updatePopularLocationsList();
            } else {
                throw new Error(`Failed to load popular locations: ${response.status}`);
            }
        } catch (error) {
            console.error('Error loading popular locations:', error);
        }
    },
    
    // Обновление списка популярных местоположений в интерфейсе
    updatePopularLocationsList() {
        const list = this.elements.popularLocationsList;
        list.innerHTML = '';
        
        this.state.popularLocations.forEach(location => {
            const item = document.createElement('div');
            item.className = 'popular-location-item';
            item.textContent = `${location.name}, ${location.country}`;
            item.addEventListener('click', () => this.selectLocation(location));
            list.appendChild(item);
        });
    },
    
    // Обновление результатов поиска местоположения
    updateSearchResults(results) {
        const container = this.elements.locationSearchResults;
        container.innerHTML = '';
        
        if (results.length === 0) {
            return;
        }
        
        results.forEach(location => {
            const item = document.createElement('div');
            item.className = 'search-item';
            item.textContent = `${location.name}, ${location.country}`;
            item.addEventListener('click', () => this.selectLocation(location));
            container.appendChild(item);
        });
    },
    
    // ===== Функции обработки пользовательских действий =====
    
    // Переключение темы (светлая/темная)
    toggleTheme() {
        this.state.isDarkMode = !this.state.isDarkMode;
        document.body.classList.toggle('dark-mode', this.state.isDarkMode);
        
        // Сохранение настройки в localStorage
        localStorage.setItem('darkMode', this.state.isDarkMode);
        
        // Изменение иконки
        const icon = this.elements.themeToggle.querySelector('i');
        if (icon) {
            icon.className = this.state.isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
        }
        
        // Сохранение настройки на сервере
        this.saveThemePreference(this.state.isDarkMode ? 'dark' : 'light');
    },
    
    // Сохранение настройки темы на сервере
    async saveThemePreference(theme) {
        try {
            const response = await fetch(`${API_BASE_URL}/preferences/theme`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ theme })
            });
            
            if (response.ok) {
                console.log('Theme preference saved on server');
            } else {
                throw new Error(`Failed to save theme preference: ${response.status}`);
            }
        } catch (error) {
            console.error('Error saving theme preference:', error);
        }
    },
    
    // Показать поиск местоположения
    showLocationSearch() {
        this.elements.locationSearch.classList.remove('hidden');
        this.elements.locationSearchInput.focus();
        this.updatePopularLocationsList();
    },
    
    // Скрыть поиск местоположения
    hideLocationSearch() {
        this.elements.locationSearch.classList.add('hidden');
        this.elements.locationSearchInput.value = '';
        this.elements.locationSearchResults.innerHTML = '';
    },
    
    // Обработка поиска местоположения
    async handleLocationSearch(e) {
        const query = e.target.value.trim();
        await this.searchLocations(query);
    },
    
    // Выбор местоположения
    async selectLocation(location) {
        // Сохраняем выбранное местоположение
        this.state.location = location;
        localStorage.setItem('location', JSON.stringify(location));
        
        // Обновляем отображаемое название местоположения
        this.elements.locationName.textContent = location.name;
        
        // Скрываем поиск
        this.hideLocationSearch();
        
        // Загружаем молитвы для нового местоположения
        await this.loadPrayerTimes(location.latitude, location.longitude);
        
        // Сохраняем выбор на сервере
        await this.saveLocationPreference(location);
    },
    
    // Сохранение настройки местоположения на сервере
    async saveLocationPreference(location) {
        try {
            const response = await fetch(`${API_BASE_URL}/preferences/location`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ location })
            });
            
            if (response.ok) {
                console.log('Location preference saved on server');
            } else {
                throw new Error(`Failed to save location preference: ${response.status}`);
            }
        } catch (error) {
            console.error('Error saving location preference:', error);
        }
    },
    
    // Использование геолокации
    useGeolocation() {
        if (navigator.geolocation) {
            this.elements.useGeolocation.disabled = true;
            this.elements.useGeolocation.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    try {
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        
                        // Получаем информацию о местоположении по координатам
                        const url = `${API_BASE_URL}/geo/coordinates?lat=${lat}&lng=${lng}`;
                        const response = await fetch(url);
                        
                        if (response.ok) {
                            const location = await response.json();
                            await this.selectLocation(location);
                        } else {
                            // Если не удалось получить название места, используем координаты
                            const location = {
                                name: `${lat.toFixed(4)}, ${lng.toFixed(4)}`,
                                country: '',
                                latitude: lat,
                                longitude: lng,
                                value: `custom-${lat}-${lng}`
                            };
                            await this.selectLocation(location);
                        }
                    } catch (error) {
                        console.error('Error using geolocation:', error);
                        alert('Failed to get location information. Please try again.');
                    } finally {
                        this.elements.useGeolocation.disabled = false;
                        this.elements.useGeolocation.innerHTML = '<i class="fas fa-map-marker-alt"></i>';
                    }
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    alert('Failed to get your location. Please check your browser settings and try again.');
                    this.elements.useGeolocation.disabled = false;
                    this.elements.useGeolocation.innerHTML = '<i class="fas fa-map-marker-alt"></i>';
                },
                { timeout: 10000, enableHighAccuracy: true }
            );
        } else {
            alert('Geolocation is not supported by your browser');
        }
    },
    
    // Изменение метода расчета
    async changeCalculationMethod(method) {
        this.state.calculationMethod = parseInt(method);
        localStorage.setItem('calculationMethod', method);
        await this.loadPrayerTimes();
    },
    
    // Изменение языка
    changeLanguage(language) {
        translationsManager.setLanguage(language);
        translationsManager.localizeUI();
        
        // Если выбранный язык отличается от текущего, перезагрузим UI
        if (this.state.prayerTimes) {
            this.updateUI(this.state.prayerTimes);
        }
        
        if (!this.elements.monthlySchedule.classList.contains('hidden') && this.state.monthlyPrayerTimes) {
            this.updateMonthlyView();
        }
    },
    
    // Переключение отображения месячного расписания
    async toggleMonthlyView() {
        const isVisible = !this.elements.monthlySchedule.classList.contains('hidden');
        
        if (isVisible) {
            // Скрываем месячное расписание
            this.elements.monthlySchedule.classList.add('hidden');
            this.elements.monthlyViewLabel.textContent = translationsManager.getTranslation('showMonthly');
        } else {
            // Показываем месячное расписание
            this.elements.monthlySchedule.classList.remove('hidden');
            this.elements.monthlyViewLabel.textContent = translationsManager.getTranslation('hideMonthly');
            
            // Если данные еще не загружены, загружаем их
            if (!this.state.monthlyPrayerTimes) {
                await this.loadMonthlyData(
                    this.state.location.latitude,
                    this.state.location.longitude,
                    this.state.currentMonth,
                    this.state.currentYear
                );
            } else {
                // Просто обновляем отображение
                this.updateMonthlyView();
            }
        }
    },
    
    // Переход к предыдущему месяцу
    async goToPreviousMonth() {
        let month = this.state.currentMonth - 1;
        let year = this.state.currentYear;
        
        if (month < 1) {
            month = 12;
            year -= 1;
        }
        
        this.state.currentMonth = month;
        this.state.currentYear = year;
        
        await this.loadMonthlyData(
            this.state.location.latitude,
            this.state.location.longitude,
            month,
            year
        );
    },
    
    // Переход к следующему месяцу
    async goToNextMonth() {
        let month = this.state.currentMonth + 1;
        let year = this.state.currentYear;
        
        if (month > 12) {
            month = 1;
            year += 1;
        }
        
        this.state.currentMonth = month;
        this.state.currentYear = year;
        
        await this.loadMonthlyData(
            this.state.location.latitude,
            this.state.location.longitude,
            month,
            year
        );
    },
    
    // Показать детали для конкретного дня
    showDayDetails(day) {
        // Установка заголовка
        const monthName = translationsManager.getTranslation('months')[day.gregorianMonth - 1];
        this.elements.modalDayTitle.textContent = `${translationsManager.getTranslation('prayerTimesFor')} ${day.gregorianDay} ${monthName}`;
        
        // Очистка и заполнение списка молитв
        this.elements.modalPrayerTimes.innerHTML = '';
        
        const prayerKeys = [
            { key: 'fajr', label: translationsManager.getTranslation('fajr') },
            { key: 'sunrise', label: translationsManager.getTranslation('sunrise') },
            { key: 'dhuhr', label: translationsManager.getTranslation('dhuhr') },
            { key: 'asr', label: translationsManager.getTranslation('asr') },
            { key: 'maghrib', label: translationsManager.getTranslation('maghrib') },
            { key: 'isha', label: translationsManager.getTranslation('isha') }
        ];
        
        prayerKeys.forEach(prayer => {
            const item = document.createElement('div');
            item.className = 'modal-prayer-item';
            
            const nameSpan = document.createElement('span');
            nameSpan.className = 'modal-prayer-name';
            nameSpan.textContent = prayer.label;
            
            const timeSpan = document.createElement('span');
            timeSpan.className = 'modal-prayer-time';
            timeSpan.textContent = day[prayer.key];
            
            item.appendChild(nameSpan);
            item.appendChild(timeSpan);
            
            this.elements.modalPrayerTimes.appendChild(item);
        });
        
        // Отображение модального окна
        this.elements.dayModal.style.display = 'block';
    },
    
    // Закрыть модальное окно
    closeModal() {
        this.elements.dayModal.style.display = 'none';
    }
};

// Запуск приложения после загрузки страницы
document.addEventListener('DOMContentLoaded', function() {
    app.init();
});