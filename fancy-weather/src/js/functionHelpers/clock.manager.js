import moment from 'moment';
import valuesDirectory from '../directories/values.directory';

const { dayTime, yearSeason } = valuesDirectory;

const clockManager = {
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
    const hours = new Date(this.currentDate).getHours();
    const month = new Date().getMonth();
    const currentDayTime = (hours < 6 || hours > 22) ? dayTime.night : dayTime.day;
    const currentYearSeason = yearSeason[month];

    return {
      currentYearSeason,
      currentDayTime,
    };
  },

  getNextDayName(dayCount) {
    return moment().add(dayCount, 'd').utcOffset(this.currentTimezone).format('dddd');
  },
};

export default clockManager;
