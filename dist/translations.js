// Файл с переводами для всех поддерживаемых языков
const translations = {
  // Русский язык (по умолчанию)
  ru: {
    // Основное
    appName: "Время молитв",
    loading: "Загрузка...",
    today: "Сегодня",
    next: "Следующий",
    previous: "Предыдущий",
    
    // Шапка
    about: "О приложении",
    contact: "Контакты",
    
    // Выбор местоположения
    locationPlaceholder: "Введите название города...",
    useCurrentLocation: "Использовать текущее местоположение",
    locationNotFound: "Местоположение не найдено",
    
    // Молитвы
    nextPrayer: "Следующая молитва",
    prayerTimes: "Расписание молитв на сегодня",
    monthlySchedule: "Расписание на месяц",
    
    // Имена молитв
    prayers: {
      fajr: "Фаджр",
      sunrise: "Восход",
      dhuhr: "Зухр",
      asr: "Аср",
      maghrib: "Магриб",
      isha: "Иша"
    },
    
    // Месяцы
    months: {
      1: "Январь",
      2: "Февраль",
      3: "Март",
      4: "Апрель",
      5: "Май",
      6: "Июнь",
      7: "Июль",
      8: "Август",
      9: "Сентябрь",
      10: "Октябрь",
      11: "Ноябрь",
      12: "Декабрь"
    },
    
    // Дни недели
    daysOfWeek: {
      monday: "Понедельник",
      tuesday: "Вторник",
      wednesday: "Среда",
      thursday: "Четверг",
      friday: "Пятница",
      saturday: "Суббота",
      sunday: "Воскресенье"
    },
    
    // Месяцы исламского календаря
    islamicMonths: {
      1: "Мухаррам",
      2: "Сафар",
      3: "Раби аль-авваль",
      4: "Раби ас-сани",
      5: "Джумада аль-уля",
      6: "Джумада ас-сани",
      7: "Раджаб",
      8: "Шаабан",
      9: "Рамадан",
      10: "Шавваль",
      11: "Зуль-Каада",
      12: "Зуль-Хиджа"
    },
    
    // Таблица расписания
    scheduleTable: {
      date: "Дата",
      islamicDate: "Исламская дата"
    },
    
    // Сообщения
    messages: {
      geolocationSuccess: "Местоположение определено",
      geolocationError: "Не удалось определить местоположение",
      locationUpdated: "Местоположение обновлено",
      errorLoadingData: "Ошибка при загрузке данных"
    }
  },
  
  // Английский язык
  en: {
    // Основное
    appName: "Prayer Times",
    loading: "Loading...",
    today: "Today",
    next: "Next",
    previous: "Previous",
    
    // Шапка
    about: "About",
    contact: "Contact",
    
    // Выбор местоположения
    locationPlaceholder: "Enter city name...",
    useCurrentLocation: "Use current location",
    locationNotFound: "Location not found",
    
    // Молитвы
    nextPrayer: "Next prayer",
    prayerTimes: "Prayer times for today",
    monthlySchedule: "Monthly schedule",
    
    // Имена молитв
    prayers: {
      fajr: "Fajr",
      sunrise: "Sunrise",
      dhuhr: "Dhuhr",
      asr: "Asr",
      maghrib: "Maghrib",
      isha: "Isha"
    },
    
    // Месяцы
    months: {
      1: "January",
      2: "February",
      3: "March",
      4: "April",
      5: "May",
      6: "June",
      7: "July",
      8: "August",
      9: "September",
      10: "October",
      11: "November",
      12: "December"
    },
    
    // Дни недели
    daysOfWeek: {
      monday: "Monday",
      tuesday: "Tuesday",
      wednesday: "Wednesday",
      thursday: "Thursday",
      friday: "Friday",
      saturday: "Saturday",
      sunday: "Sunday"
    },
    
    // Месяцы исламского календаря
    islamicMonths: {
      1: "Muharram",
      2: "Safar",
      3: "Rabi' al-awwal",
      4: "Rabi' al-thani",
      5: "Jumada al-awwal",
      6: "Jumada al-thani",
      7: "Rajab",
      8: "Sha'ban",
      9: "Ramadan",
      10: "Shawwal",
      11: "Dhu al-Qi'dah",
      12: "Dhu al-Hijjah"
    },
    
    // Таблица расписания
    scheduleTable: {
      date: "Date",
      islamicDate: "Islamic date"
    },
    
    // Сообщения
    messages: {
      geolocationSuccess: "Location detected",
      geolocationError: "Failed to detect location",
      locationUpdated: "Location updated",
      errorLoadingData: "Error loading data"
    }
  },
  
  // Арабский язык
  ar: {
    // Основное
    appName: "أوقات الصلاة",
    loading: "جاري التحميل...",
    today: "اليوم",
    next: "التالي",
    previous: "السابق",
    
    // Шапка
    about: "حول",
    contact: "اتصل بنا",
    
    // Выбор местоположения
    locationPlaceholder: "أدخل اسم المدينة...",
    useCurrentLocation: "استخدم الموقع الحالي",
    locationNotFound: "الموقع غير موجود",
    
    // Молитвы
    nextPrayer: "الصلاة التالية",
    prayerTimes: "أوقات الصلاة اليوم",
    monthlySchedule: "جدول الشهر",
    
    // Имена молитв
    prayers: {
      fajr: "الفجر",
      sunrise: "الشروق",
      dhuhr: "الظهر",
      asr: "العصر",
      maghrib: "المغرب",
      isha: "العشاء"
    },
    
    // Месяцы
    months: {
      1: "يناير",
      2: "فبراير",
      3: "مارس",
      4: "أبريل",
      5: "مايو",
      6: "يونيو",
      7: "يوليو",
      8: "أغسطس",
      9: "سبتمبر",
      10: "أكتوبر",
      11: "نوفمبر",
      12: "ديسمبر"
    },
    
    // Дни недели
    daysOfWeek: {
      monday: "الاثنين",
      tuesday: "الثلاثاء",
      wednesday: "الأربعاء",
      thursday: "الخميس",
      friday: "الجمعة",
      saturday: "السبت",
      sunday: "الأحد"
    },
    
    // Месяцы исламского календаря
    islamicMonths: {
      1: "محرم",
      2: "صفر",
      3: "ربيع الأول",
      4: "ربيع الآخر",
      5: "جمادى الأولى",
      6: "جمادى الآخرة",
      7: "رجب",
      8: "شعبان",
      9: "رمضان",
      10: "شوال",
      11: "ذو القعدة",
      12: "ذو الحجة"
    },
    
    // Таблица расписания
    scheduleTable: {
      date: "التاريخ",
      islamicDate: "التاريخ الهجري"
    },
    
    // Сообщения
    messages: {
      geolocationSuccess: "تم تحديد الموقع",
      geolocationError: "فشل تحديد الموقع",
      locationUpdated: "تم تحديث الموقع",
      errorLoadingData: "خطأ في تحميل البيانات"
    }
  },
  
  // Французский язык
  fr: {
    // Основное
    appName: "Horaires de Prière",
    loading: "Chargement...",
    today: "Aujourd'hui",
    next: "Suivant",
    previous: "Précédent",
    
    // Шапка
    about: "À propos",
    contact: "Contact",
    
    // Выбор местоположения
    locationPlaceholder: "Entrez le nom de la ville...",
    useCurrentLocation: "Utiliser la position actuelle",
    locationNotFound: "Emplacement non trouvé",
    
    // Молитвы
    nextPrayer: "Prochaine prière",
    prayerTimes: "Horaires de prière pour aujourd'hui",
    monthlySchedule: "Calendrier mensuel",
    
    // Имена молитв
    prayers: {
      fajr: "Fajr",
      sunrise: "Lever du soleil",
      dhuhr: "Dhuhr",
      asr: "Asr",
      maghrib: "Maghrib",
      isha: "Isha"
    },
    
    // Месяцы
    months: {
      1: "Janvier",
      2: "Février",
      3: "Mars",
      4: "Avril",
      5: "Mai",
      6: "Juin",
      7: "Juillet",
      8: "Août",
      9: "Septembre",
      10: "Octobre",
      11: "Novembre",
      12: "Décembre"
    },
    
    // Дни недели
    daysOfWeek: {
      monday: "Lundi",
      tuesday: "Mardi",
      wednesday: "Mercredi",
      thursday: "Jeudi",
      friday: "Vendredi",
      saturday: "Samedi",
      sunday: "Dimanche"
    },
    
    // Месяцы исламского календаря
    islamicMonths: {
      1: "Mouharram",
      2: "Safar",
      3: "Rabi' al-Awal",
      4: "Rabi' al-Thani",
      5: "Joumada al-Oula",
      6: "Joumada al-Thani",
      7: "Rajab",
      8: "Cha'ban",
      9: "Ramadan",
      10: "Chawwal",
      11: "Dhou al-Qi'da",
      12: "Dhou al-Hijja"
    },
    
    // Таблица расписания
    scheduleTable: {
      date: "Date",
      islamicDate: "Date islamique"
    },
    
    // Сообщения
    messages: {
      geolocationSuccess: "Emplacement détecté",
      geolocationError: "Impossible de détecter l'emplacement",
      locationUpdated: "Emplacement mis à jour",
      errorLoadingData: "Erreur lors du chargement des données"
    }
  }
};