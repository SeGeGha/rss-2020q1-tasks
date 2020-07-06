import Keyboard from './keyboard.constructor';
import { searchInput } from '../directory/globalVariables';

const keyboard = new Keyboard();
keyboard.init();

function handlerAction(event) {
  const isKeyboardEnabled = keyboard.main.classList.contains('active');

  if (isKeyboardEnabled) {
    switch (event.type) {
      case 'mousedown':
        if (event.target.dataset.keycode === '16') {
          const isPressed = event.target.classList.contains('key_pressed');
          keyboard.keyPress(event, isPressed);
        } else {
          keyboard.keyPress(event);
        }
        break;
      case 'mouseup':
        if (event.target.dataset.keycode !== '16') {
          keyboard.keyPress(event, true);
        }
        break;
      case 'blur':
        event.target.focus();
        break;
      default:
        break;
    }
  }
}

function keyboardComponent() {
  keyboard.keysContainer.addEventListener('mousedown', (event) => {
    handlerAction(event);
  });

  keyboard.keysContainer.addEventListener('mouseup', (event) => {
    handlerAction(event);
  });

  keyboard.keysContainer.addEventListener('contextmenu', (event) => {
    event.preventDefault();
  });

  searchInput.addEventListener('blur', (event) => {
    handlerAction(event);
  });
}

export { keyboardComponent, keyboard };
