import cardsNamesDirectory from './cardsDirectory.js';

const statistics = {
  table: document.querySelector('.statistics'),
  words: {},
  init() {
    if (localStorage.getItem('appStatistics')) {
      const data = JSON.parse(localStorage.getItem('appStatistics'));

      Object.entries(data).forEach((arr) => {
        const name = arr[0];
        const value = arr[1];
        const row = document.createElement('tr');

        value.forEach((v) => {
          const cell = document.createElement('td');

          cell.textContent = v;

          row.appendChild(cell);
        });

        this.words[name] = row;
        row.classList.add('row-word');
        this.table.append(row);
      });
    } else {
      Object.entries(cardsNamesDirectory).forEach((arr) => {
        const categoryName = arr[0];
        const wordArr = arr[1]; // Pair values, example 'bear' - 'медведь'

        wordArr.forEach((word) => {
          const row = document.createElement('tr');

          for (let i = 0; i < 7; i += 1) { // Number of columns
            const cell = document.createElement('td');

            cell.textContent = (i === 0) ? categoryName : word[i - 1] || 0;

            row.appendChild(cell);
          }
          this.words[word[0]] = row;
          row.classList.add('row-word');
          this.table.append(row);
        });
      });
    }
  },
  counter(wordName, ...playMode) {
    const row = this.words[wordName];
    const cellClickNumber = row.querySelectorAll('td')[3];
    const cellCorrect = row.querySelectorAll('td')[4];
    const cellWrong = row.querySelectorAll('td')[5];
    const cellPercentWrong = row.querySelectorAll('td')[6];
    const [switchMode, resultAnswer] = [...playMode];

    if (switchMode) { // Play mode
      if (resultAnswer) {
        cellCorrect.innerText = +cellCorrect.innerText + 1;
      } else {
        cellWrong.innerText = +cellWrong.innerText + 1;
      }
      cellPercentWrong.innerText = `${Math.round(100 * (cellWrong.innerText / cellCorrect.innerText))}%`;
    } else { // Train mode
      cellClickNumber.innerText = +cellClickNumber.innerText + 1;
    }
    this.saveData();
  },

  sort(eventTarget) {
    const header = this.table.querySelectorAll('th');
    console.log(Array.from(header).findIndex((item) => item === eventTarget));
  //  const arr =
  },

  resetData() {
    localStorage.removeItem('appStatistics');
    const header = this.table.firstElementChild;
    this.table.textContent = '';
    this.table.append(header);
    this.words = {};
    this.init();
  },

  saveData() {
    const dataObj = {};
    Object.entries(this.words).forEach((arr) => {
      const td = arr[1].querySelectorAll('td');
      const arrs = [];
      td.forEach((td) => {
        arrs.push(td.textContent);
      });
      dataObj[arr[0]] = arrs;
    });

    localStorage.setItem('appStatistics', JSON.stringify(dataObj));
  },
};

export default statistics;
