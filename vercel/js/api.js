/**
 * API functions for Prayer Times App
 */

// API base URL - это же статический сайт, поэтому используем фиксированные URL для API
const API_BASE_URL = 'https://api.aladhan.com/v1';
const GEOCODING_API = 'https://api.bigdatacloud.net/data/reverse-geocode-client';

/**
 * Функция для получения времен молитв на указанную дату
 * @param {number} latitude Широта
 * @param {number} longitude Долгота
 * @param {number} method Метод расчета (по умолчанию: 2 - Egyptian General Authority of Survey)
 * @returns {Promise} Промис с данными о временах молитв
 */
async function getPrayerTimes(latitude, longitude, method = 2) {
  try {
    const today = new Date();
    const date = `${today.getDate()}-${today.getMonth() + 1}-${today.getFullYear()}`;
    const url = `${API_BASE_URL}/timings/${date}?latitude=${latitude}&longitude=${longitude}&method=${method}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch prayer times');
    }
    
    const data = await response.json();
    return processApiResponse(data, { latitude, longitude });
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    throw error;
  }
}

/**
 * Функция для получения месячного расписания молитв
 * @param {number} latitude Широта
 * @param {number} longitude Долгота
 * @param {number} month Месяц (1-12)
 * @param {number} year Год (например, 2025)
 * @param {number} method Метод расчета
 * @returns {Promise} Промис с данными о месячном расписании
 */
async function getMonthlyPrayerTimes(latitude, longitude, month, year, method = 2) {
  try {
    const url = `${API_BASE_URL}/calendar/${year}/${month}?latitude=${latitude}&longitude=${longitude}&method=${method}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch monthly prayer times');
    }
    
    const data = await response.json();
    return processMonthlyApiResponse(data, { month, year });
  } catch (error) {
    console.error('Error fetching monthly prayer times:', error);
    throw error;
  }
}

/**
 * Функция для получения местоположения по координатам
 * @param {number} latitude Широта
 * @param {number} longitude Долгота
 * @returns {Promise} Промис с данными о местоположении
 */
async function getLocationByCoordinates(latitude, longitude) {
  try {
    const url = `${GEOCODING_API}?latitude=${latitude}&longitude=${longitude}&localityLanguage=${getCurrentLanguage()}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch location data');
    }
    
    const data = await response.json();
    
    // Обработка данных о местоположении
    return {
      name: data.city || data.locality || 'Unknown location',
      country: data.countryName || '',
      latitude: latitude,
      longitude: longitude,
      value: `${latitude}-${longitude}`
    };
  } catch (error) {
    console.error('Error fetching location data:', error);
    throw error;
  }
}

/**
 * Функция для получения списка популярных местоположений на текущем языке
 * @returns {Array} Массив популярных местоположений
 */
function getPopularLocations() {
  const language = getCurrentLanguage();
  
  // Базовые локации для разных языков
  if (language === 'ar') {
    return [
      {
        name: "مكة",
        country: "المملكة العربية السعودية",
        latitude: 21.4225,
        longitude: 39.8262,
        value: "mecca-saudi-arabia"
      },
      {
        name: "المدينة المنورة",
        country: "المملكة العربية السعودية",
        latitude: 24.5247,
        longitude: 39.5692,
        value: "medina-saudi-arabia"
      },
      {
        name: "اسطنبول",
        country: "تركيا",
        latitude: 41.0082,
        longitude: 28.9784,
        value: "istanbul-turkey"
      },
      {
        name: "القاهرة",
        country: "مصر",
        latitude: 30.0444,
        longitude: 31.2357,
        value: "cairo-egypt"
      },
      {
        name: "دبي",
        country: "الإمارات العربية المتحدة",
        latitude: 25.2048,
        longitude: 55.2708,
        value: "dubai-uae"
      }
    ];
  } else if (language === 'ru') {
    return [
      {
        name: "Мекка",
        country: "Саудовская Аравия",
        latitude: 21.4225,
        longitude: 39.8262,
        value: "mecca-saudi-arabia"
      },
      {
        name: "Медина",
        country: "Саудовская Аравия",
        latitude: 24.5247,
        longitude: 39.5692,
        value: "medina-saudi-arabia"
      },
      {
        name: "Стамбул",
        country: "Турция",
        latitude: 41.0082,
        longitude: 28.9784,
        value: "istanbul-turkey"
      },
      {
        name: "Каир",
        country: "Египет",
        latitude: 30.0444,
        longitude: 31.2357,
        value: "cairo-egypt"
      },
      {
        name: "Дубай",
        country: "ОАЭ",
        latitude: 25.2048,
        longitude: 55.2708,
        value: "dubai-uae"
      }
    ];
  } else if (language === 'fr') {
    return [
      {
        name: "La Mecque",
        country: "Arabie Saoudite",
        latitude: 21.4225,
        longitude: 39.8262,
        value: "mecca-saudi-arabia"
      },
      {
        name: "Médine",
        country: "Arabie Saoudite",
        latitude: 24.5247,
        longitude: 39.5692,
        value: "medina-saudi-arabia"
      },
      {
        name: "Istanbul",
        country: "Turquie",
        latitude: 41.0082,
        longitude: 28.9784,
        value: "istanbul-turkey"
      },
      {
        name: "Le Caire",
        country: "Égypte",
        latitude: 30.0444,
        longitude: 31.2357,
        value: "cairo-egypt"
      },
      {
        name: "Dubaï",
        country: "Émirats Arabes Unis",
        latitude: 25.2048,
        longitude: 55.2708,
        value: "dubai-uae"
      }
    ];
  } else {
    // Английский (по умолчанию)
    return [
      {
        name: "Mecca",
        country: "Saudi Arabia",
        latitude: 21.4225,
        longitude: 39.8262,
        value: "mecca-saudi-arabia"
      },
      {
        name: "Medina",
        country: "Saudi Arabia",
        latitude: 24.5247,
        longitude: 39.5692,
        value: "medina-saudi-arabia"
      },
      {
        name: "Istanbul",
        country: "Turkey",
        latitude: 41.0082,
        longitude: 28.9784,
        value: "istanbul-turkey"
      },
      {
        name: "Cairo",
        country: "Egypt",
        latitude: 30.0444,
        longitude: 31.2357,
        value: "cairo-egypt"
      },
      {
        name: "Dubai",
        country: "United Arab Emirates",
        latitude: 25.2048,
        longitude: 55.2708,
        value: "dubai-uae"
      }
    ];
  }
}

/**
 * Функция для поиска местоположений по названию
 * Так как это статический сайт, мы будем просто фильтровать популярные местоположения
 * @param {string} query Строка запроса
 * @returns {Array} Массив найденных местоположений
 */
function searchLocations(query) {
  if (!query || query.length < 2) {
    return [];
  }
  
  const locations = getPopularLocations();
  const lowerQuery = query.toLowerCase();
  
  return locations.filter(location => 
    location.name.toLowerCase().includes(lowerQuery) || 
    location.country.toLowerCase().includes(lowerQuery)
  );
}

/**
 * Обработка ответа API для времен молитв
 * @param {Object} apiResponse Ответ API
 * @param {Object} options Дополнительные параметры
 * @returns {Object} Обработанные данные о временах молитв
 */
function processApiResponse(apiResponse, options) {
  const { data } = apiResponse;
  const { timings, date, meta } = data;
  
  // Извлекаем времена молитв и преобразуем в 24-часовой формат
  const prayerTimes = [
    { name: 'Fajr', time: timings.Fajr },
    { name: 'Sunrise', time: timings.Sunrise },
    { name: 'Dhuhr', time: timings.Dhuhr },
    { name: 'Asr', time: timings.Asr },
    { name: 'Maghrib', time: timings.Maghrib },
    { name: 'Isha', time: timings.Isha }
  ];
  
  // Конвертируем время в минуты для легкого сравнения
  const prayerTimesWithMinutes = prayerTimes.map(prayer => {
    const [hours, minutes] = prayer.time.split(':');
    const timeInMinutes = parseInt(hours) * 60 + parseInt(minutes);
    return {
      ...prayer,
      timeInMinutes
    };
  });
  
  // Получаем текущее время в локации
  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const currentTimeInMinutes = currentHours * 60 + currentMinutes;
  
  // Определяем текущую и следующую молитву
  let currentPrayer = null;
  let nextPrayer = null;
  
  for (let i = 0; i < prayerTimesWithMinutes.length; i++) {
    const prayer = prayerTimesWithMinutes[i];
    
    // Если текущее время больше времени молитвы, эта молитва текущая или уже прошла
    if (currentTimeInMinutes >= prayer.timeInMinutes) {
      currentPrayer = prayer;
    }
    
    // Если текущее время меньше времени молитвы, это следующая молитва
    if (currentTimeInMinutes < prayer.timeInMinutes && !nextPrayer) {
      nextPrayer = prayer;
    }
  }
  
  // Если нет следующей молитвы сегодня, значит это первая молитва следующего дня
  if (!nextPrayer) {
    nextPrayer = prayerTimesWithMinutes[0];
  }
  
  // Если нет текущей молитвы (до первой молитвы дня), последняя молитва предыдущего дня
  if (!currentPrayer) {
    currentPrayer = prayerTimesWithMinutes[prayerTimesWithMinutes.length - 1];
  }
  
  // Отмечаем текущую и следующую молитву
  const prayerTimesWithStatus = prayerTimesWithMinutes.map(prayer => {
    const isCurrent = prayer.name === currentPrayer?.name;
    const isUpcoming = prayer.name === nextPrayer?.name;
    
    // Расчет оставшегося времени для следующей молитвы
    let remainingTime = null;
    if (isUpcoming) {
      let remainingMinutes = prayer.timeInMinutes - currentTimeInMinutes;
      
      // Если следующая молитва завтра
      if (remainingMinutes < 0) {
        remainingMinutes += 24 * 60; // Добавляем 24 часа
      }
      
      const hours = Math.floor(remainingMinutes / 60);
      const minutes = remainingMinutes % 60;
      
      remainingTime = `${hours}ч ${minutes}м`;
    }
    
    return {
      ...prayer,
      isCurrent,
      isUpcoming,
      remainingTime,
      // Форматируем время для отображения
      timeFormatted: formatTime(prayer.time)
    };
  });
  
  // Формируем итоговый объект
  return {
    date: date.readable,
    gregorianDate: `${date.gregorian.day} ${getMonthName(date.gregorian.month.number)} ${date.gregorian.year}`,
    islamicDate: `${date.hijri.day} ${getIslamicMonthName(date.hijri.month.number)} ${date.hijri.year}`,
    dayOfWeek: getWeekdayName(date.gregorian.weekday.en),
    location: `${options.latitude}, ${options.longitude}`,
    timezone: meta.timezone,
    latitude: options.latitude,
    longitude: options.longitude,
    times: prayerTimesWithStatus
  };
}

/**
 * Обработка ответа API для месячного расписания
 * @param {Object} apiResponse Ответ API
 * @param {Object} options Дополнительные параметры
 * @returns {Object} Обработанные данные о месячном расписании
 */
function processMonthlyApiResponse(apiResponse, options) {
  const { data } = apiResponse;
  const days = [];
  
  // Извлекаем первый и последний день для определения месяца и года
  const firstDay = data[0];
  const lastDay = data[data.length - 1];
  
  // Обрабатываем каждый день
  for (const dayData of data) {
    const { date, timings } = dayData;
    
    days.push({
      gregorianDate: date.gregorian.date,
      islamicDate: date.hijri.date,
      gregorianDay: parseInt(date.gregorian.day),
      islamicDay: parseInt(date.hijri.day),
      gregorianMonth: date.gregorian.month.number,
      islamicMonth: date.hijri.month.number,
      fajr: formatTime(timings.Fajr),
      sunrise: formatTime(timings.Sunrise),
      dhuhr: formatTime(timings.Dhuhr),
      asr: formatTime(timings.Asr),
      maghrib: formatTime(timings.Maghrib),
      isha: formatTime(timings.Isha)
    });
  }
  
  // Формируем итоговый объект
  return {
    gregorianMonth: getMonthName(options.month),
    gregorianYear: options.year,
    islamicMonth: getIslamicMonthName(firstDay.date.hijri.month.number),
    islamicYear: parseInt(firstDay.date.hijri.year),
    days
  };
}

/**
 * Получение текущего языка интерфейса
 * @returns {string} Код языка
 */
function getCurrentLanguage() {
  return localStorage.getItem('language') || 'en';
}

/**
 * Форматирование времени из 24-часового формата в более удобный
 * @param {string} time Время в формате 'HH:MM'
 * @returns {string} Отформатированное время
 */
function formatTime(time) {
  // Убираем секунды, если они есть
  return time.split(' ')[0].substring(0, 5);
}

/**
 * Получение названия месяца по его номеру
 * @param {number} monthNumber Номер месяца (1-12)
 * @returns {string} Название месяца
 */
function getMonthName(monthNumber) {
  const language = getCurrentLanguage();
  
  const months = {
    en: [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ],
    ru: [
      'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
      'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
    ],
    ar: [
      'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
      'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'
    ],
    fr: [
      'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
      'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ]
  };
  
  // Получаем массив месяцев для текущего языка или используем английский по умолчанию
  const monthsForLanguage = months[language] || months.en;
  
  return monthsForLanguage[monthNumber - 1];
}

/**
 * Получение названия исламского месяца по его номеру
 * @param {number} monthNumber Номер месяца (1-12)
 * @returns {string} Название месяца
 */
function getIslamicMonthName(monthNumber) {
  const language = getCurrentLanguage();
  
  const months = {
    en: [
      'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
      'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Shaban',
      'Ramadan', 'Shawwal', 'Dhu al-Qadah', 'Dhu al-Hijjah'
    ],
    ru: [
      'Мухаррам', 'Сафар', 'Раби аль-Авваль', 'Раби ас-Сани',
      'Джумада аль-Уля', 'Джумада ас-Сани', 'Раджаб', 'Шаабан',
      'Рамадан', 'Шавваль', 'Зу-ль-Када', 'Зу-ль-Хиджа'
    ],
    ar: [
      'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني',
      'جمادى الأولى', 'جمادى الآخرة', 'رجب', 'شعبان',
      'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة'
    ],
    fr: [
      'Mouharram', 'Safar', 'Rabi al-Awal', 'Rabi al-Thani',
      'Joumada al-Awal', 'Joumada al-Thani', 'Rajab', 'Chaabane',
      'Ramadan', 'Chawwal', 'Dhou al-Qida', 'Dhou al-Hijja'
    ]
  };
  
  // Получаем массив месяцев для текущего языка или используем английский по умолчанию
  const monthsForLanguage = months[language] || months.en;
  
  return monthsForLanguage[monthNumber - 1];
}

/**
 * Получение названия дня недели
 * @param {string} weekday День недели на английском
 * @returns {string} Переведенное название дня недели
 */
function getWeekdayName(weekday) {
  const language = getCurrentLanguage();
  
  const weekdays = {
    en: {
      'Monday': 'Monday',
      'Tuesday': 'Tuesday',
      'Wednesday': 'Wednesday',
      'Thursday': 'Thursday',
      'Friday': 'Friday',
      'Saturday': 'Saturday',
      'Sunday': 'Sunday'
    },
    ru: {
      'Monday': 'Понедельник',
      'Tuesday': 'Вторник',
      'Wednesday': 'Среда',
      'Thursday': 'Четверг',
      'Friday': 'Пятница',
      'Saturday': 'Суббота',
      'Sunday': 'Воскресенье'
    },
    ar: {
      'Monday': 'الإثنين',
      'Tuesday': 'الثلاثاء',
      'Wednesday': 'الأربعاء',
      'Thursday': 'الخميس',
      'Friday': 'الجمعة',
      'Saturday': 'السبت',
      'Sunday': 'الأحد'
    },
    fr: {
      'Monday': 'Lundi',
      'Tuesday': 'Mardi',
      'Wednesday': 'Mercredi',
      'Thursday': 'Jeudi',
      'Friday': 'Vendredi',
      'Saturday': 'Samedi',
      'Sunday': 'Dimanche'
    }
  };
  
  // Получаем объект дней недели для текущего языка или используем английский по умолчанию
  const weekdaysForLanguage = weekdays[language] || weekdays.en;
  
  return weekdaysForLanguage[weekday] || weekday;
}

// Экспортируем функции
window.prayerTimesApi = {
  getPrayerTimes,
  getMonthlyPrayerTimes,
  getLocationByCoordinates,
  getPopularLocations,
  searchLocations,
  getCurrentLanguage
};