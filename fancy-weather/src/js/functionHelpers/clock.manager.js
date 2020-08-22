import moment from 'moment';
import { dayTime, yearSeason } from '../directories/values';

export default {
  renderElement: null,
  intervalId: null,
  currentTimezone: null,
  currentDate: null,

  init(renderElem, timezoneOffsetSec, appLanguage) {
    moment.locale(appLanguage);
    this.turnOff();

    this.renderElement = renderElem;
    this.currentTimezone = timezoneOffsetSec / 60;

    this.turnOn();
  },

  turnOn() {
    this.implementer();
    this.intervalId = setInterval(() => {
      this.implementer();
    }, 1000);
  },

  implementer() {
    this.currentDate = moment().utcOffset(this.currentTimezone).format('ddd D MMMM, HH:mm:ss');
    this.renderElement.textContent = this.currentDate;
  },

  turnOff() {
    clearInterval(this.intervalId);
  },

  getDateInfo() {
    const hours = +moment().utcOffset(this.currentTimezone).format('HH');
    const month = new Date().getMonth();
    const currentYearSeason = yearSeason[month];
    const currentDayTime = (hours >= 6 && hours < 12) ? dayTime.morning 
      : (hours >= 12 && hours < 17) ? dayTime.day
      : (hours >= 17 && hours < 23) ? dayTime.evening : dayTime.night;

    return {
      currentYearSeason,
      currentDayTime,
    };
  },

  getNextDayName(dayCount) {
    return moment().add(dayCount, 'd').utcOffset(this.currentTimezone).format('dddd');
  },
};
