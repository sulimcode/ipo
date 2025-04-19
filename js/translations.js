// Объект с переводами
const translations = {
    en: {
        // Общие элементы
        appTitle: 'Prayer Times',
        loading: 'Loading...',
        
        // Местоположение
        location: 'Location',
        changeLocation: 'Change Location',
        searchLocation: 'Search location...',
        useGeolocation: 'Use My Location',
        popularLocations: 'Popular Locations',
        
        // Расчет
        calculationMethod: 'Calculation Method',
        methods: [
            'Shia Ithna-Ashari',
            'University of Islamic Sciences, Karachi',
            'Islamic Society of North America (ISNA)',
            'Muslim World League',
            'Umm Al-Qura University, Makkah',
            'Egyptian General Authority of Survey',
            'Institute of Geophysics, University of Tehran',
            'Gulf Region',
            'Kuwait',
            'Qatar',
            'Majlis Ugama Islam Singapura, Singapore',
            'Union Organization Islamic de France',
            'Diyanet İşleri Başkanlığı, Turkey',
            'Spiritual Administration of Muslims of Russia',
            'Moonsighting Committee Worldwide'
        ],
        
        // Молитвы
        nextPrayer: 'Next Prayer',
        todayPrayerTimes: 'Today\'s Prayer Times',
        fajr: 'Fajr',
        sunrise: 'Sunrise',
        dhuhr: 'Dhuhr',
        asr: 'Asr',
        maghrib: 'Maghrib',
        isha: 'Isha',
        
        // Обратный отсчет
        timeRemaining: 'remaining',
        hoursAbbr: 'h',
        minutesAbbr: 'm',
        
        // Месячное расписание
        showMonthly: 'Show Monthly Schedule',
        hideMonthly: 'Hide Monthly Schedule',
        prayerTimesFor: 'Prayer Times for',
        months: [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ],
        shortWeekdays: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        
        // Футер
        dataSource: 'Data provided by AlAdhan.com Islamic API'
    },
    
    ru: {
        // Общие элементы
        appTitle: 'Время молитв',
        loading: 'Загрузка...',
        
        // Местоположение
        location: 'Местоположение',
        changeLocation: 'Изменить местоположение',
        searchLocation: 'Поиск местоположения...',
        useGeolocation: 'Использовать моё местоположение',
        popularLocations: 'Популярные места',
        
        // Расчет
        calculationMethod: 'Метод расчета',
        methods: [
            'Шиитский (Ithna-Ashari)',
            'Исламский университет наук, Карачи',
            'Исламское общество Северной Америки (ISNA)',
            'Всемирная исламская лига',
            'Университет Умм аль-Кура, Мекка',
            'Египетский генеральный орган исследований',
            'Институт геофизики, Тегеранский университет',
            'Регион Персидского залива',
            'Кувейт',
            'Катар',
            'Сингапур',
            'Исламская организация Франции',
            'Управление по делам религии, Турция',
            'Духовное управление мусульман России',
            'Всемирный комитет по наблюдению за луной'
        ],
        
        // Молитвы
        nextPrayer: 'Следующая молитва',
        todayPrayerTimes: 'Расписание молитв на сегодня',
        fajr: 'Фаджр',
        sunrise: 'Восход',
        dhuhr: 'Зухр',
        asr: 'Аср',
        maghrib: 'Магриб',
        isha: 'Иша',
        
        // Обратный отсчет
        timeRemaining: 'осталось',
        hoursAbbr: 'ч',
        minutesAbbr: 'м',
        
        // Месячное расписание
        showMonthly: 'Показать расписание на месяц',
        hideMonthly: 'Скрыть расписание на месяц',
        prayerTimesFor: 'Время молитв на',
        months: [
            'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
            'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
        ],
        shortWeekdays: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
        
        // Футер
        dataSource: 'Данные предоставлены исламским API AlAdhan.com'
    },
    
    ar: {
        // Общие элементы
        appTitle: 'مواقيت الصلاة',
        loading: 'جاري التحميل...',
        
        // Местоположение
        location: 'الموقع',
        changeLocation: 'تغيير الموقع',
        searchLocation: 'البحث عن موقع...',
        useGeolocation: 'استخدم موقعي',
        popularLocations: 'مواقع شائعة',
        
        // Расчет
        calculationMethod: 'طريقة الحساب',
        methods: [
            'الشيعة الإثنا عشرية',
            'جامعة العلوم الإسلامية، كراتشي',
            'الجمعية الإسلامية لأمريكا الشمالية (ISNA)',
            'رابطة العالم الإسلامي',
            'جامعة أم القرى، مكة المكرمة',
            'الهيئة المصرية العامة للمساحة',
            'معهد الجيوفيزياء، جامعة طهران',
            'منطقة الخليج',
            'الكويت',
            'قطر',
            'مجلس أوغاما إسلام سنغافورة',
            'اتحاد المنظمات الإسلامية في فرنسا',
            'رئاسة الشؤون الدينية، تركيا',
            'الإدارة الروحية لمسلمي روسيا',
            'لجنة رؤية الهلال العالمية'
        ],
        
        // Молитвы
        nextPrayer: 'الصلاة القادمة',
        todayPrayerTimes: 'مواقيت الصلاة اليوم',
        fajr: 'الفجر',
        sunrise: 'الشروق',
        dhuhr: 'الظهر',
        asr: 'العصر',
        maghrib: 'المغرب',
        isha: 'العشاء',
        
        // Обратный отсчет
        timeRemaining: 'متبقي',
        hoursAbbr: 'س',
        minutesAbbr: 'د',
        
        // Месячное расписание
        showMonthly: 'عرض الجدول الشهري',
        hideMonthly: 'إخفاء الجدول الشهري',
        prayerTimesFor: 'مواقيت الصلاة ليوم',
        months: [
            'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
            'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
        ],
        shortWeekdays: ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'],
        
        // Футер
        dataSource: 'البيانات مقدمة من واجهة برمجة التطبيقات الإسلامية AlAdhan.com'
    },
    
    tr: {
        // Общие элементы
        appTitle: 'Namaz Vakitleri',
        loading: 'Yükleniyor...',
        
        // Местоположение
        location: 'Konum',
        changeLocation: 'Konumu Değiştir',
        searchLocation: 'Konum ara...',
        useGeolocation: 'Konumumu Kullan',
        popularLocations: 'Popüler Konumlar',
        
        // Расчет
        calculationMethod: 'Hesaplama Yöntemi',
        methods: [
            'Şii İsna-Aşeri',
            'İslami Bilimler Üniversitesi, Karaçi',
            'Kuzey Amerika İslam Topluluğu (ISNA)',
            'Dünya İslam Birliği',
            'Ümmül Kura Üniversitesi, Mekke',
            'Mısır Genel Etüt İdaresi',
            'Jeofizik Enstitüsü, Tahran Üniversitesi',
            'Körfez Bölgesi',
            'Kuveyt',
            'Katar',
            'Singapur İslam Meclisi',
            'Fransa İslam Teşkilatları Birliği',
            'Diyanet İşleri Başkanlığı, Türkiye',
            'Rusya Müslümanları Ruhani İdaresi',
            'Dünya Hilal Gözlem Komitesi'
        ],
        
        // Молитвы
        nextPrayer: 'Sonraki Namaz',
        todayPrayerTimes: 'Bugünün Namaz Vakitleri',
        fajr: 'İmsak',
        sunrise: 'Güneş',
        dhuhr: 'Öğle',
        asr: 'İkindi',
        maghrib: 'Akşam',
        isha: 'Yatsı',
        
        // Обратный отсчет
        timeRemaining: 'kaldı',
        hoursAbbr: 's',
        minutesAbbr: 'd',
        
        // Месячное расписание
        showMonthly: 'Aylık Programı Göster',
        hideMonthly: 'Aylık Programı Gizle',
        prayerTimesFor: 'Namaz Vakitleri:',
        months: [
            'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
            'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
        ],
        shortWeekdays: ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt'],
        
        // Футер
        dataSource: 'Veriler AlAdhan.com İslami API tarafından sağlanmaktadır'
    }
};

// Менеджер для работы с переводами
const translationsManager = {
    // Установка языка в localStorage и документе
    setLanguage: function(lang) {
        localStorage.setItem('language', lang);
        document.documentElement.setAttribute('lang', lang);
        
        // Если язык арабский, добавляем направление справа налево
        if (lang === 'ar') {
            document.body.setAttribute('dir', 'rtl');
        } else {
            document.body.removeAttribute('dir');
        }
        
        // Сохраняем настройку на сервере
        this.saveLanguagePreference(lang);
    },
    
    // Получение текущего языка
    getCurrentLanguage: function() {
        return localStorage.getItem('language') || 'en';
    },
    
    // Получение данных настроек с сервера
    async fetchPreferences() {
        try {
            const response = await fetch('http://localhost:8000/api/preferences');
            if (response.ok) {
                const data = await response.json();
                console.log('Using local language preference');
                return data;
            }
        } catch (error) {
            console.error('Error fetching preferences:', error);
        }
        return null;
    },
    
    // Сохранение настроек языка на сервере
    async saveLanguagePreference(language) {
        try {
            const response = await fetch('http://localhost:8000/api/preferences/language', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ language })
            });
            
            if (response.ok) {
                console.log('Language preference saved on server');
            }
        } catch (error) {
            console.error('Error saving language preference:', error);
        }
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
        
        // Сохраняем настройку на сервере
        this.saveLanguagePreference(lang);
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