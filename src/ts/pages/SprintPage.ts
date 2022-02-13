import { IWord } from '../types';
import api from '../api';
import { APP_ID, GROUP_WORDS_PAGE_LIMIT, WORDS_PAGE_LIMIT, API_URL } from '../constants';

class SprintPage {
  data: IWord[];

  page: number;

  group: number;

  rightAnswerIndex: number;

  answerChange: number;

  result: { [key: string]: boolean };

  counterCorrectAnswer: number;

  timerId: NodeJS.Timer;

  counterPoints: number;

  constructor() {
    this.data = [];
    this.page = 0;
    this.group = 0;
    this.rightAnswerIndex = 0;
    this.answerChange = 0;
    this.counterCorrectAnswer = 0;
    this.counterPoints = 0;
    this.timerId = setInterval(() => {});
    this.result = {};
  }

  async init() {
    const appEl = document.getElementById(APP_ID) as HTMLElement;
    this.data = [];
    this.page = 0;
    this.group = 0;
    this.rightAnswerIndex = 0;
    this.answerChange = 0;
    this.counterCorrectAnswer = 0;
    this.counterPoints = 0;
    // eslint-disable-next-line no-restricted-syntax
    for (const prop in this.result) {
      if (Object.prototype.hasOwnProperty.call(this.result, prop)) {
        delete this.result[prop];
      }
    }
    appEl.innerHTML = this.drawSelectLevel();
    appEl.removeEventListener('click', this.handleMouse);
    document.removeEventListener('keyup', this.handleKeyboard);
    const startButton = document.querySelector('.start-sprint') as HTMLButtonElement;
    startButton.addEventListener('click', async () => {
      const pageQuestionWords = this.getRandomIntInclusive(0, GROUP_WORDS_PAGE_LIMIT - 1);
      const level = Number((document.querySelector('.sprint-select-level') as HTMLSelectElement).value);
      this.data = await api.getWords(pageQuestionWords, level);
      appEl.innerHTML = `<div class="time-container"><spans class="time"></spans></div>`;
      appEl.innerHTML += '<div class="sprint-page-question"><div/>';
      this.createQuestion();
      this.timer(60);
      this.clearSetInterval();
    });
    appEl.addEventListener('click', this.handleMouse);
    document.addEventListener('keyup', this.handleKeyboard);
  }

  handleMouse = (event: MouseEvent) => {
    const appEl = document.getElementById(APP_ID) as HTMLElement;
    const target = event.target as HTMLButtonElement;

    if (target.classList.contains('sprint-button-true')) {
      const flag = true;
      this.changeCorrectAnswer(flag);
      this.rightAnswerIndex += 1;
      if (this.rightAnswerIndex < 20) {
        this.createQuestion();
        this.createCorrectIndicator();
        this.addPoint();
      } else {
        appEl.innerHTML = this.drawResults(this.result);
        this.audioResult();
        this.playAgain();
      }
    }
    if (target.classList.contains('sprint-button-false')) {
      const flag = false;
      this.changeCorrectAnswer(flag);
      this.rightAnswerIndex += 1;
      if (this.rightAnswerIndex < 20) {
        this.createQuestion();
        this.createCorrectIndicator();
        this.addPoint();
      } else {
        appEl.innerHTML = this.drawResults(this.result);
        this.audioResult();
        this.playAgain();
      }
    }
  };

  handleKeyboard = (event: KeyboardEvent) => {
    const appEl = document.getElementById(APP_ID) as HTMLElement;
    if (event.keyCode === 37) {
      const flag = true;
      this.changeCorrectAnswer(flag);
      this.rightAnswerIndex += 1;
      if (this.rightAnswerIndex < 20) {
        this.createQuestion();
        this.createCorrectIndicator();
        this.addPoint();
      } else {
        appEl.innerHTML = this.drawResults(this.result);
        this.audioResult();
        this.playAgain();
      }
    }
    if (event.keyCode === 39) {
      const flag = false;
      this.changeCorrectAnswer(flag);
      this.rightAnswerIndex += 1;
      if (this.rightAnswerIndex < 20) {
        this.createQuestion();
        this.createCorrectIndicator();
        this.addPoint();
      } else {
        appEl.innerHTML = this.drawResults(this.result);
        this.audioResult();
        this.playAgain();
      }
    }
  };

  playAgain() {
    (document.querySelector('.result-play-again') as HTMLElement).addEventListener('click', () => {
      const appEl = document.getElementById(APP_ID) as HTMLElement;
      this.rightAnswerIndex = 0;
      this.counterCorrectAnswer = 0;
      this.counterPoints = 0;
      // eslint-disable-next-line no-restricted-syntax
      for (const prop in this.result) {
        if (Object.prototype.hasOwnProperty.call(this.result, prop)) {
          delete this.result[prop];
        }
      }
      appEl.innerHTML = `<div class="time-container"><spans class="time"></spans></div>`;
      appEl.innerHTML += '<div class="sprint-page-question"><div/>';
      this.createQuestion();
      this.timer(60);
      document.addEventListener('keyup', this.handleKeyboard);
    });
  }

  audioResult() {
    const resultContainer = document.querySelector('.result-container') as HTMLElement;
    resultContainer.addEventListener('click', (e) => {
      const target = e.target as HTMLButtonElement;
      if (target.classList.contains('result-word-play')) {
        const playSound = target.closest('div') as HTMLElement;
        const audio = playSound.querySelector('audio') as HTMLAudioElement;
        audio.play();
      }
    });
  }

  drawSelectLevel() {
    return `
    <div class="sprint-container">
          <h2 class="title">Спринт</h2>
          <div class="description-container">
            <p>«Спринт» - это тренировка для повторения заученных слов.</p>
            <div class="list-container">
              <ul class="">
                <li class="">Используйте мышь, чтобы выбрать.</li>
                <li class="">Используйте клавиши влево или вправо</li>
              </ul>
            </div>
          </div>
          <div class="select-container">
            <select class="sprint-select-level" name="select">
              <option value="0" selected>1</option>
              <option value="1">2</option>
              <option value="2">3</option>
              <option value="3">4</option>
              <option value="4">5</option>
              <option value="5">6</option>
            </select>
            <button class="start-sprint">Начать</button>
          </div>
        </div>
      `;
  }

  createQuestion = () => {
    const questionContainer = document.querySelector('.sprint-page-question') as HTMLDivElement;
    const question = this.data[this.rightAnswerIndex].word;
    console.log(question, this.data[this.rightAnswerIndex].wordTranslate);
    this.answerChange = this.getRandomIntInclusive(0, 1);
    if (this.answerChange === 1) {
      const answerOption = this.data[this.rightAnswerIndex].wordTranslate;
      questionContainer.innerHTML = this.renderQuestion(question, answerOption);
    } else {
      const answerOptionIndex = this.getRandomIntInclusive(0, WORDS_PAGE_LIMIT - 1, this.rightAnswerIndex);
      const answerOption = this.data[answerOptionIndex].wordTranslate;
      questionContainer.innerHTML = this.renderQuestion(question, answerOption);
    }
  };

  changeCorrectAnswer(flag: boolean) {
    if (flag) {
      if (this.answerChange === 1) {
        this.result[this.rightAnswerIndex] = true;
        this.counterCorrectAnswer += 1;
      } else {
        this.result[this.rightAnswerIndex] = false;
        this.counterCorrectAnswer = 0;
      }
    }
    if (!flag) {
      if (this.answerChange === 0) {
        this.result[this.rightAnswerIndex] = true;
        this.counterCorrectAnswer += 1;
      } else {
        this.result[this.rightAnswerIndex] = false;
        this.counterCorrectAnswer = 0;
      }
    }
  }

  createCorrectIndicator() {
    const a = this.counterCorrectAnswer;
    const circle = document.querySelectorAll<HTMLElement>('.circle');
    const rightAnswerColor = '#4caf4fbf';
    if (a === 0) {
      for (let i = 0; circle.length > i; i += 1) {
        circle[i].style.backgroundColor = 'white';
      }
    } else if (a % 3 === 0 || a > 12) {
      for (let i = 0; i < circle.length; i += 1) {
        circle[i].style.backgroundColor = rightAnswerColor;
      }
    } else if (a % 3 === 1) {
      circle[0].style.backgroundColor = rightAnswerColor;
    } else if (a % 3 === 2) {
      circle[0].style.backgroundColor = rightAnswerColor;
      circle[1].style.backgroundColor = rightAnswerColor;
    }
  }

  addPoint() {
    const sprintResult = document.querySelector('.sprint-result') as HTMLElement;

    const a = this.counterCorrectAnswer;
    if (a === 1 || a === 2 || a === 3) {
      this.counterPoints += 10;
    } else if (a === 4 || a === 5 || a === 6) {
      this.counterPoints += 20;
    } else if (a === 7 || a === 8 || a === 9) {
      this.counterPoints += 30;
    } else if (a > 9) {
      this.counterPoints += 40;
    }
    sprintResult.innerHTML = `${this.counterPoints}`;
  }

  renderQuestion(question: string, answerOption: string) {
    return `<div class="sprint-section" id="sprint-game-board">
    <h1 class="sprint-result">0</h1>
    <div class="sprint-card">
      <div class="sprint-card-answer">
        <div class="circle-container">
          <span class="circle"></span><span class="circle"></span><span class="circle"></span>
        </div>
          <h2 class="srint-word">${question}</h2>
          <h3 class="sprint-translate">${answerOption}</h3>   
      </div>
      <hr class="sprint-line" />
      <div class="sprint-button-container">
        <button class="sprint-button sprint-button-true">Верно</button
        ><button class="sprint-button sprint-button-false">Неверно</button>
      </div>
    </div>
  </div>
    `;
  }

  drawResults = (result: { [key: string]: boolean }) => {
    clearInterval(this.timerId);
    document.removeEventListener('keyup', this.handleKeyboard);
    let count = 0;
    let lengthObj = 0;
    // eslint-disable-next-line no-restricted-syntax
    for (const prop in result) {
      if (Object.prototype.hasOwnProperty.call(this.result, prop)) {
        lengthObj += 1;
        if (result[prop] === true) {
          count += 1;
        }
      }
    }
    return `
      <div class="result-section">
      <div class="result-container">
        <h2 class="result-title">Ваш результат</h2>
        <h2 class="result-correct-num">Знаю: ${count}</h2>
        ${this.drawCorrectResult(this.data, this.result)}
        <hr class="result-line" />
        <h2 class="result-wrong-num">Ошибок: ${lengthObj - count}</h2>
        ${this.drawWrongResult(this.data, this.result)}
      </div>
      <div class="result-button-container">
        <span class="result-btn result-play-again">Играть еще</span><a class="result-btn" href="/games#home">Главная</a>
      </div>
    </div>
    `;
  };

  drawCorrectResult(data: IWord[], result: { [key: string]: boolean }) {
    let html = '';
    // eslint-disable-next-line no-restricted-syntax
    for (const prop in result) {
      if (result[prop] === true) {
        html += `
        <div class="result-word-container">
        <button class="result-word-play">
          <span class="result-word-play-label"
            ><svg
              class="result-word-play-icon"
              focusable="false"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"
              ></path></svg></span
          ><span></span>
        </button>
        <audio src="${API_URL}/${data[Number(prop)].audio}"></audio>
        <div>
          <span class="result-word">${data[Number(prop)].word}</span><span class="result-word-dash"> - </span
          ><span class="result-word-translate">${data[Number(prop)].wordTranslate}</span>
        </div>
      </div>`;
      }
    }

    return html;
  }

  timer(timerValue: number) {
    const appEl = document.getElementById(APP_ID) as HTMLElement;
    let current = timerValue;
    const time = document.querySelector('.time') as HTMLElement;
    time.innerHTML = `${current}`;
    current -= 1;
    this.timerId = setInterval(() => {
      if (current > 0) {
        time.innerHTML = `${current}`;
        current -= 1;
      }
      if (current === 0) {
        time.innerHTML = `${current}`;
        clearInterval(this.timerId);
        appEl.innerHTML = this.drawResults(this.result);
        this.audioResult();
        this.playAgain();
      }
    }, 1000);
  }

  drawWrongResult(data: IWord[], result: { [key: string]: boolean }) {
    // eslint-disable-next-line no-restricted-syntax
    // eslint-disable-next-line guard-for-in
    let html = '';

    // eslint-disable-next-line no-restricted-syntax
    for (const prop in result) {
      if (result[prop] === false) {
        html += `
          <div class="result-word-container">
              <button class="result-word-play">
                <span class="result-word-play-label"
                  ><svg
                    class="result-word-play-icon"
                    focusable="false"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"
                    ></path></svg></span
                ><span></span>
              </button>
              <audio src="${API_URL}/${data[Number(prop)].audio}"></audio>
              <div>
                <span class="result-word">${data[Number(prop)].word}</span><span class="result-word-dash"> - </span
                ><span class="result-word-translate">${data[Number(prop)].wordTranslate}</span>
              </div>
            </div>`;
      }
    }

    return html;
  }

  playAudio(flag: boolean) {
    const audio = document.querySelector('audio') as HTMLAudioElement;
    if (flag) {
      audio.src = 'assets/audio/correct.mp3';
    } else {
      audio.src = 'assets/audio/wrong.mp3';
    }
    audio.play();
  }

  getRandomIntInclusive(min: number, max: number, exclude = -1): number {
    const a = Math.ceil(min);
    const b = Math.floor(max);
    const num = Math.floor(Math.random() * (b - a + 1)) + a;
    return num === exclude ? this.getRandomIntInclusive(min, max, exclude) : num;
  }

  clearSetInterval() {
    const header = document.querySelector('.page-header') as HTMLElement;

    header.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const link = target.getAttribute('href');
      if (link === '#audioGame' || link === '#statistics' || link === '#tutorial' || link === '#home') {
        clearInterval(this.timerId);
      }
    });
  }
}

export default SprintPage;
