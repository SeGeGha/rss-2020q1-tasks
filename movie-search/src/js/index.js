import { movieComponent, searchComponent } from './search';
import { keyboardComponent } from './keyboard';

window.addEventListener('DOMContentLoaded', () => {
  searchComponent();
  movieComponent('John Wick');
  keyboardComponent();
});
