import cardsNamesDirectory from './cardsDirectory';
import { changeCard } from './changerCards';

const statistics = {
  table: document.querySelector('.statistics'),
  words: [],
  sortParameters: {},
  init() {
    const data = Object.entries(cardsNamesDirectory);
    // Create table row

    data.forEach((arr) => {
      const [categoryName, categoryWords] = arr;

      categoryWords.forEach((item) => {
        const row = document.createElement('tr');
        const columnCount = 7;
        const arrValues = [];

        for (let i = 0; i < columnCount; i += 1) {
          const cell = document.createElement('td');

          cell.textContent = (i === 0) ? categoryName : item[[i - 1]] || 0;

          arrValues.push(cell.textContent);

          row.appendChild(cell);
        }

        this.words.push(arrValues);
        row.classList.add('row-word');
        this.table.append(row);
      });
    });

    if (localStorage.getItem('appStatistics')) {
      this.loadData();
    }
  },
  counter(wordName, ...playMode) {
    const rowIndex = this.words.findIndex((item) => item[1] === wordName);
    const row = this.table.querySelectorAll('.row-word')[rowIndex];
    const cells = row.querySelectorAll('td');
    let cellIndex = null;
    const [switchMode, resultAnswer] = [...playMode];

    if (switchMode) { // Play mode
      cellIndex = (resultAnswer) ? 4 : 5; // 4 - 'guessed'; 5 - 'mistakes'
    } else { // Train mode
      cellIndex = 3; // 3 - 'clicked'
    }

    cells[cellIndex].textContent = +cells[cellIndex].textContent + 1;
    this.words[rowIndex][cellIndex] = cells[cellIndex].textContent;

    if (switchMode) { // Play mode
      const cellPercent = cells[6]; // 6 - persentage mistakes
      const mistakesValue = +cells[5].textContent;
      const guessedValue = +cells[4].textContent;

      cellPercent.textContent = `${Math.round(100 * (mistakesValue / (mistakesValue + guessedValue)))}%`;
      this.words[rowIndex][6] = cellPercent.textContent;
    }

    this.saveData();
  },
  sortTable(eventTarget) {
    const header = this.table.querySelectorAll('th');
    const index = Array.from(header).findIndex((th) => th === eventTarget);

    const compareString = function compare(a, b) {
      let answer;

      if (a > b) {
        answer = 1;
      } else if (a < b) {
        answer = -1;
      } else {
        answer = 0;
      }

      return answer;
    };

    const compareNumber = function compare(a, b) {
      return parseInt(b, 10) - parseInt(a, 10);
    };

    const currentCompare = (index < 3) ? compareString : compareNumber;

    if (!this.sortParameters[index]) {
      this.words = this.words.sort((a, b) => currentCompare(a[index], b[index])); // Ascending sort
      this.sortParameters[index] = true;
    } else {
      this.words = this.words.sort((a, b) => currentCompare(b[index], a[index])); // Descending sort
      delete this.sortParameters[index];
    }

    this.setCellValue();
  },
  resetData() {
    localStorage.removeItem('appStatistics');
    const header = this.table.querySelector('.table-header');
    this.table.textContent = '';
    this.table.append(header);
    this.words = [];
    this.init();
  },
  saveData() {
    localStorage.setItem('appStatistics', JSON.stringify(this.words));
  },
  loadData() {
    this.words = JSON.parse(localStorage.getItem('appStatistics'));
    this.setCellValue();
  },
  setCellValue() {
    const tableRows = this.table.querySelectorAll('.row-word');

    tableRows.forEach((row, rowId) => {
      const cells = row.querySelectorAll('td');

      cells.forEach((item, columnId) => {
        const cell = item;
        cell.textContent = this.words[rowId][columnId];
      });
    });
  },
  getDifficultWords() {
    // Get all difficult words
    // index 6 - column with percentage mistakes
    let arrDifficultWords = this.words.filter((item) => parseInt(item[6], 10) > 0);
    // Sort in ascending order
    arrDifficultWords = arrDifficultWords.sort((a, b) => parseInt(b[6], 10) - parseInt(a[6], 10));
    // Create an object to send
    // index 1 - english name; index 2 - translate
    const obj = {
      'difficult words': arrDifficultWords.slice(0, 8).map((item) => [item[1], item[2], item[0]]),
    };

    changeCard(null, obj);
  },
};

export default statistics;
