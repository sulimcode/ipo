// Переводы для приложения
const translations = {
    // Английский язык (по умолчанию)
    en: {
        // Заголовок и общее
        appTitle: "Islamic Prayer Times",
        loading: "Loading...",
        
        // Даты
        months: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        weekdays: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        shortWeekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        today: "Today",
        
        // Названия молитв
        fajr: "Fajr",
        sunrise: "Sunrise",
        dhuhr: "Dhuhr",
        asr: "Asr",
        maghrib: "Maghrib",
        isha: "Isha",
        
        // Элементы интерфейса
        location: "Location",
        changeLocation: "Change Location",
        searchLocation: "Search for a city...",
        popularLocations: "Popular Locations",
        calculationMethod: "Calculation Method",
        nextPrayer: "Next Prayer",
        todayPrayerTimes: "Today's Prayer Times",
        monthlySchedule: "Monthly Schedule",
        showMonthly: "Show Monthly Schedule",
        hideMonthly: "Hide Monthly Schedule",
        prayerTimesFor: "Prayer Times for",
        
        // Футер и прочее
        dataSource: "Prayer times data provided by AlAdhan.com API",
        geoLocationButton: "Use My Location",
        close: "Close",
        
        // Время
        timeRemaining: "remaining",
        hoursAbbr: "h",
        minutesAbbr: "m",
        
        // Названия методов расчета
        methods: [
            "Muslim World League",
            "Islamic Society of North America (ISNA)",
            "Egyptian General Authority of Survey",
            "Umm al-Qura University, Makkah",
            "University of Islamic Sciences, Karachi",
            "Institute of Geophysics, University of Tehran",
            "Shia Ithna-Ashari, Leva Institute, Qum"
        ]
    },
    
    // Русский язык
    ru: {
        // Заголовок и общее
        appTitle: "Время намаза",
        loading: "Загрузка...",
        
        // Даты
        months: ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"],
        weekdays: ["Воскресенье", "Понедельник", "Вторник", "Среда", "Четверг", "Пятница", "Суббота"],
        shortWeekdays: ["Вс", "Пн", "Вт", "Ср", "Чт", "Пт", "Сб"],
        today: "Сегодня",
        
        // Названия молитв
        fajr: "Фаджр",
        sunrise: "Восход",
        dhuhr: "Зухр",
        asr: "Аср",
        maghrib: "Магриб",
        isha: "Иша",
        
        // Элементы интерфейса
        location: "Местоположение",
        changeLocation: "Изменить местоположение",
        searchLocation: "Поиск города...",
        popularLocations: "Популярные места",
        calculationMethod: "Метод расчета",
        nextPrayer: "Следующий намаз",
        todayPrayerTimes: "Расписание на сегодня",
        monthlySchedule: "Месячное расписание",
        showMonthly: "Показать месячное расписание",
        hideMonthly: "Скрыть месячное расписание",
        prayerTimesFor: "Время намаза на",
        
        // Футер и прочее
        dataSource: "Данные предоставлены API AlAdhan.com",
        geoLocationButton: "Использовать мое местоположение",
        close: "Закрыть",
        
        // Время
        timeRemaining: "осталось",
        hoursAbbr: "ч",
        minutesAbbr: "м",
        
        // Названия методов расчета
        methods: [
            "Всемирная Исламская Лига",
            "Исламское Общество Северной Америки (ISNA)",
            "Египетское Управление Геодезии",
            "Университет Умм аль-Кура, Мекка",
            "Университет Исламских Наук, Карачи",
            "Институт Геофизики, Тегеранский Университет",
            "Шиитский метод, Институт Лева, Кум"
        ]
    },
    
    // Арабский язык
    ar: {
        // Заголовок и общее
        appTitle: "مواقيت الصلاة",
        loading: "جار التحميل...",
        
        // Даты
        months: ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"],
        weekdays: ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"],
        shortWeekdays: ["أحد", "اثن", "ثلا", "أرب", "خمس", "جمع", "سبت"],
        today: "اليوم",
        
        // Названия молитв
        fajr: "الفجر",
        sunrise: "الشروق",
        dhuhr: "الظهر",
        asr: "العصر",
        maghrib: "المغرب",
        isha: "العشاء",
        
        // Элементы интерфейса
        location: "الموقع",
        changeLocation: "تغيير الموقع",
        searchLocation: "ابحث عن مدينة...",
        popularLocations: "المواقع الشائعة",
        calculationMethod: "طريقة الحساب",
        nextPrayer: "الصلاة القادمة",
        todayPrayerTimes: "مواقيت الصلاة اليوم",
        monthlySchedule: "جدول الشهر",
        showMonthly: "عرض جدول الشهر",
        hideMonthly: "إخفاء جدول الشهر",
        prayerTimesFor: "مواقيت الصلاة ليوم",
        
        // Футер и прочее
        dataSource: "البيانات مقدمة من AlAdhan.com API",
        geoLocationButton: "استخدم موقعي",
        close: "إغلاق",
        
        // Время
        timeRemaining: "متبقي",
        hoursAbbr: "س",
        minutesAbbr: "د",
        
        // Названия методов расчета
        methods: [
            "رابطة العالم الإسلامي",
            "الجمعية الإسلامية لأمريكا الشمالية (ISNA)",
            "الهيئة المصرية العامة للمساحة",
            "جامعة أم القرى، مكة المكرمة",
            "جامعة العلوم الإسلامية، كراتشي",
            "معهد الجيوفيزياء، جامعة طهران",
            "الطريقة الشيعية، معهد ليفا، قم"
        ]
    },
    
    // Французский язык
    fr: {
        // Заголовок и общее
        appTitle: "Horaires de Prière",
        loading: "Chargement...",
        
        // Даты
        months: ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"],
        weekdays: ["Dimanche", "Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"],
        shortWeekdays: ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"],
        today: "Aujourd'hui",
        
        // Названия молитв
        fajr: "Fajr",
        sunrise: "Lever du soleil",
        dhuhr: "Dhuhr",
        asr: "Asr",
        maghrib: "Maghrib",
        isha: "Isha",
        
        // Элементы интерфейса
        location: "Emplacement",
        changeLocation: "Changer d'emplacement",
        searchLocation: "Rechercher une ville...",
        popularLocations: "Emplacements populaires",
        calculationMethod: "Méthode de calcul",
        nextPrayer: "Prochaine prière",
        todayPrayerTimes: "Horaires du jour",
        monthlySchedule: "Calendrier mensuel",
        showMonthly: "Afficher le calendrier mensuel",
        hideMonthly: "Masquer le calendrier mensuel",
        prayerTimesFor: "Horaires de prière pour",
        
        // Футер и прочее
        dataSource: "Données fournies par l'API AlAdhan.com",
        geoLocationButton: "Utiliser ma position",
        close: "Fermer",
        
        // Время
        timeRemaining: "restant",
        hoursAbbr: "h",
        minutesAbbr: "m",
        
        // Названия методов расчета
        methods: [
            "Ligue Islamique Mondiale",
            "Société Islamique d'Amérique du Nord (ISNA)",
            "Autorité Générale Égyptienne de la Topographie",
            "Université Umm al-Qura, La Mecque",
            "Université des Sciences Islamiques, Karachi",
            "Institut de Géophysique, Université de Téhéran",
            "Chiite Ithna-Ashari, Institut Leva, Qom"
        ]
    }
};

// Функции для работы с переводами
const translationsManager = {
    // Получение текущего языка из localStorage или установка языка по умолчанию (английский)
    getCurrentLanguage: function() {
        return localStorage.getItem('language') || 'en';
    },
    
    // Установка языка приложения
    setLanguage: function(lang) {
        localStorage.setItem('language', lang);
        document.documentElement.setAttribute('lang', lang);
        
        // Если язык арабский, добавляем направление справа налево
        if (lang === 'ar') {
            document.body.setAttribute('dir', 'rtl');
        } else {
            document.body.removeAttribute('dir');
        }
    },
    
    // Получение перевода по ключу для текущего языка
    getTranslation: function(key) {
        const lang = this.getCurrentLanguage();
        const langData = translations[lang] || translations.en; // Если нет перевода, используем английский
        
        // Разбиваем ключ на части для доступа к вложенным свойствам
        const keys = key.split('.');
        let result = langData;
        
        for (const k of keys) {
            if (result && result[k] !== undefined) {
                result = result[k];
            } else {
                // Если перевод не найден, возвращаем ключ
                console.warn(`Translation not found for key: ${key} in language: ${lang}`);
                return key;
            }
        }
        
        return result;
    },
    
    // Локализация всего интерфейса
    localizeUI: function() {
        const lang = this.getCurrentLanguage();
        
        // Обновляем выбранный язык в селекторе
        const langSelect = document.getElementById('language-select');
        if (langSelect) {
            langSelect.value = lang;
        }
        
        // Локализация заголовка приложения
        document.getElementById('app-title').textContent = this.getTranslation('appTitle');
        
        // Локализация метки местоположения
        document.getElementById('location-title').textContent = this.getTranslation('location');
        
        // Локализация поля поиска местоположения
        const searchInput = document.getElementById('location-search-input');
        if (searchInput) {
            searchInput.placeholder = this.getTranslation('searchLocation');
        }
        
        // Локализация списка популярных мест
        document.getElementById('popular-locations-title').textContent = this.getTranslation('popularLocations');
        
        // Локализация метода расчета
        document.getElementById('calculation-method-title').textContent = this.getTranslation('calculationMethod');
        
        // Локализация следующей молитвы
        document.getElementById('next-prayer-title').textContent = this.getTranslation('nextPrayer');
        
        // Локализация расписания на сегодня
        document.getElementById('today-prayer-title').textContent = this.getTranslation('todayPrayerTimes');
        
        // Локализация названий молитв
        document.getElementById('fajr-label').textContent = this.getTranslation('fajr');
        document.getElementById('sunrise-label').textContent = this.getTranslation('sunrise');
        document.getElementById('dhuhr-label').textContent = this.getTranslation('dhuhr');
        document.getElementById('asr-label').textContent = this.getTranslation('asr');
        document.getElementById('maghrib-label').textContent = this.getTranslation('maghrib');
        document.getElementById('isha-label').textContent = this.getTranslation('isha');
        
        // Локализация кнопки месячного расписания
        document.getElementById('monthly-view-label').textContent = 
            document.getElementById('monthly-schedule').classList.contains('hidden') ? 
            this.getTranslation('showMonthly') : this.getTranslation('hideMonthly');
        
        // Локализация текста подвала
        document.getElementById('footer-text').textContent = this.getTranslation('dataSource');
        
        // Локализация селектора метода расчета
        const methodSelect = document.getElementById('calculation-method');
        if (methodSelect) {
            const methods = this.getTranslation('methods');
            Array.from(methodSelect.options).forEach((option, index) => {
                if (methods[index]) {
                    option.textContent = methods[index];
                }
            });
        }
        
        // Обновляем текущий год в подвале
        document.getElementById('current-year').textContent = new Date().getFullYear();
    }
};