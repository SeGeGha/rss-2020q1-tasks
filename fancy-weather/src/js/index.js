import weatherApplication from './weather.app';
import eventsCreator from './functionHelpers/events.creator';

document.addEventListener('DOMContentLoaded', () => {
  eventsCreator();
  weatherApplication.init();
});
