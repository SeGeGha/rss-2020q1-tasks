import weatherApplication from './weather.app';
import eventsCreator from './events.creator';

document.addEventListener('DOMContentLoaded', () => {
  eventsCreator();
  weatherApplication.init();
});