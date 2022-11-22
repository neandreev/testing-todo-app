/**
 * Переменная, содержащая в себе различие timestamp
 * времени часового пояса пользователя от часового пояса UTC+0.
 */
const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;

export default timezoneOffset;
