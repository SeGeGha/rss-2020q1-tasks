import { movieComponent, searchComponent } from './search/main';
import { keyboardComponent } from './virtualKeyboard/main';

window.addEventListener('DOMContentLoaded', () => {
  searchComponent();
  movieComponent('John Wick');
  keyboardComponent();
});
