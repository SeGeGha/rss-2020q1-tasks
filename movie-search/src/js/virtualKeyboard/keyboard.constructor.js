import keyDirectory from '../directory/keyDirectory';
import {
  searchInput, searchLoader, english, russian,
} from '../directory/globalVariables';
import { handlerInputValue } from '../search/main';

class Keyboard {
  constructor() {
    this.main = null;
    this.keysContainer = null;
    this.keys = [];
    this.language = null;
    this.property = {
      capsLock: {
        press: false,
        repeat: false,
      },
      shift: {
        press: false,
        repeat: false,
      },
      alt: {
        press: false,
        repeat: false,
      },
    };
  }

  init() {
    this.main = document.createElement('div');
    this.keysContainer = document.createElement('div');

    this.main.classList.add('keyboard');
    this.keysContainer.classList.add('keyboard__keys');
    this.keysContainer.appendChild(this.createKeys());

    this.keys = this.keysContainer.querySelectorAll('.keyboard__key');

    this.main.appendChild(this.keysContainer);
    document.body.insertAdjacentElement('beforeend', this.main);
  }

  createKeys() {
    this.language = localStorage.getItem('k-boardLanguage') ? localStorage.getItem('k-boardLanguage') : english;

    const fragment = document.createDocumentFragment();

    Object.keys(keyDirectory).forEach((key) => {
      const keyElement = document.createElement('button');

      keyElement.setAttribute('type', 'button');
      keyElement.setAttribute('data-keycode', key.replace(/[a-z -]/g, ''));
      keyElement.setAttribute('data-get-value', keyDirectory[key].getValue);
      keyElement.classList.add('keyboard__key');

      switch (key) {
        case 'keycode-8':
          this.createButtonStyle.call(keyElement, 'Backspace', 'key_large-wide');
          break;
        case 'keycode-9':
          this.createButtonStyle.call(keyElement, 'Tab', 'key_xs-wide');
          break;
        case 'keycode-20':
          this.createButtonStyle.call(keyElement, 'Caps Lock', 'key_small-wide', 'key_activated');
          break;
        case 'keycode-13':
          this.createButtonStyle.call(keyElement, 'Enter', 'key_xl-wide');
          break;
        case 'keycode-left-16':
          this.createButtonStyle.call(keyElement, 'Shift', 'key_large-wide');
          break;
        case 'keycode-right-16':
          this.createButtonStyle.call(keyElement, 'Shift', 'key_medium-wide');
          break;
        case 'keycode-32':
          this.createButtonStyle.call(keyElement, 'Space', 'key_xxl-wide');
          break;
        case 'keycode-left-17':
        case 'keycode-right-17':
          this.createButtonStyle.call(keyElement, 'Ctrl');
          break;
        case 'keycode-left-18':
        case 'keycode-right-18':
          this.createButtonStyle.call(keyElement, 'Alt');
          break;
        case 'keycode-91':
          this.createButtonStyle.call(keyElement, 'Win');
          break;
        case 'keycode-46':
          this.createButtonStyle.call(keyElement, 'Del');
          break;
        case 'language': {
          const langButtonName = this.language.substring(0, 3).toUpperCase();
          keyElement.setAttribute('data-keycode', key);
          this.createButtonStyle.call(keyElement, langButtonName, 'key_language');
          break;
        }
        default:
          keyElement.textContent = keyDirectory[key][this.language].standardKeyName;
          break;
      }
      fragment.appendChild(keyElement);
    });
    return fragment;
  }

  createButtonStyle(nameButton, ...className) {
    this.classList.add(...className);
    this.textContent = nameButton;
  }

  keyPress(event, keyUp = false) {
    const textPosition = searchInput.selectionStart;
    let keyPress = null;

    if (event.type === 'mousedown' || event.type === 'mouseup') {
      keyPress = event.target;
    } else {
      const keyRight = ['ShiftRight', 'AltRight', 'ControlRight'].includes(event.code);
      const keysArray = keyRight ? Array.from(this.keys).reverse() : Array.from(this.keys);

      keyPress = keysArray.find((key) => +key.dataset.keycode === event.keyCode);
    }

    function changeText([startPosition, deleteCount, newText], direction, number) {
      const textValue = searchInput.value.split('');

      textValue.splice(startPosition, deleteCount, newText);
      searchInput.value = textValue.join('');

      this.carriageMove.call(searchInput, direction, textPosition, number);
    }

    if (keyPress && !keyUp) {
      switch (keyPress.dataset.keycode) {
        case '8': // Backspace key
          changeText.apply(this, [[textPosition - 1, 1], 'left']);
          break;
        case '9': // Tab key
          changeText.apply(this, [[textPosition, 0, '  '], 'right', 2]);
          break;
        case '16': // Shift key
          this.property.shift.press = true;

          if (!this.property.shift.repeat) {
            this.property.shift.repeat = !this.property.shift.repeat;

            if (event.altKey) {
              this.changeLanguage();
            } else {
              this.switchValueKeys();
            }
          }
          break;
        case '18': // Alt key
          this.property.alt.press = true;

          if (!this.property.alt.repeat) {
            this.property.alt.repeat = !this.property.alt.repeat;

            if (event.shiftKey) {
              this.changeLanguage();
            }
          }
          break;
        case '20': // Caps Lock key
          if (!this.property.capsLock.repeat) {
            keyPress.classList.toggle('key_active');

            this.property.capsLock.press = !this.property.capsLock.press;
            this.property.capsLock.repeat = !this.property.capsLock.repeat;

            this.switchValueKeys();
          }
          break;
        case '32': // Space key
          changeText.apply(this, [[textPosition, 0, ' '], 'right']);
          break;
        case '37': // Left arrow-key
          changeText.apply(this, [[], 'left']);
          break;
        case '38': // Up arrow-key
          changeText.apply(this, [[], 'top']);
          break;
        case '39': // Right arrow-key
          changeText.apply(this, [[], 'right']);
          break;
        case '40': // Down arrow-key
          changeText.apply(this, [[], 'down']);
          break;
        case '46': // Delete key
          changeText.apply(this, [[textPosition, 1], 'left', 0]);
          break;
        case 'language':
          this.changeLanguage();
          break;
        default:
          if (keyPress.dataset.getValue === 'true') {
            changeText.apply(this, [[textPosition, 0, keyPress.textContent], 'right']);
          }
          break;
      }

      if (keyPress.getAttribute('type') === 'button') {
        keyPress.classList.add('key_hover', 'key_pressed');
      }
    }

    if (keyPress && keyUp) {
      keyPress.classList.remove('key_hover', 'key_pressed');

      switch (keyPress.dataset.keycode) {
        case '13': // Enter key
          searchLoader.classList.add('active');
          handlerInputValue();
          break;
        case '20':
          this.property.capsLock.repeat = !this.property.capsLock.repeat;
          break;
        case '16':
          this.property.shift.press = false;
          this.property.shift.repeat = !this.property.shift.repeat;
          this.switchValueKeys();
          break;
        case '18':
          this.property.alt.press = false;
          this.property.alt.repeat = !this.property.alt.repeat;
          break;
        default:
          break;
      }
    }
  }

  carriageMove(direction, currentPosition, step = 1) {
    switch (direction) {
      case 'left':
        this.selectionStart = (currentPosition - step < 0) ? 0 : currentPosition - step;
        break;
      case 'top':
        this.selectionStart = 0;
        break;
      case 'right':
        this.selectionStart = currentPosition + step;
        break;
      case 'down':
        this.selectionStart = this.value.length;
        break;
      default:
        break;
    }
    this.selectionEnd = this.selectionStart;
  }

  changeLanguage() {
    switch (this.language) {
      case english:
        this.language = russian;
        break;
      case russian:
        this.language = english;
        break;
      default:
        break;
    }

    localStorage.setItem('k-boardLanguage', this.language);
    this.keys[this.keys.length - 1].textContent = this.language.substring(0, 3).toUpperCase();

    this.switchValueKeys();
  }

  switchValueKeys() {
    const code = [this.property.shift.press, this.property.alt.press, this.property.capsLock.press].join(', ');

    this.keys.forEach((item) => {
      const button = item;

      if (button.getAttribute('data-get-value') === 'true') {
        const keyMap = keyDirectory[`keycode-${button.dataset.keycode}`][this.language];

        switch (code) {
          case 'true, false, false':
            button.textContent = keyMap.shiftKeyName;
            break;
          case 'true, false, true':
            button.textContent = keyMap.shiftKeyName.toLowerCase();
            break;
          case 'true, true, true':
          case 'false, true, true':
          case 'false, false, true':
            button.textContent = keyMap.standardKeyName.toUpperCase();
            break;
          default:
            button.textContent = keyMap.standardKeyName;
            break;
        }
      }
    });
  }

  hideKeyboard() {
    this.main.classList.remove('active');
  }
}

export default Keyboard;
