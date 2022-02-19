import { IWord } from '../types';
import api from '../api';
import { APP_ID, GROUP_PAGE_LIMIT, WORDS_PAGE_LIMIT, API_URL } from '../constants';
import Sound from '../components/Sound';

class SprintPage {
  data: IWord[];

  page: number;

  group: number;

  rightAnswerIndex: number;

  answerChange: number;

  result: { [key: string]: boolean };

  sounds: { [key: string]: Sound };

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
    this.sounds = {
      wrong: new Sound({ src: '../assets/audio/wrong.mp3' }),
      correct: new Sound({ src: '../assets/audio/correct.mp3' }),
    };
  }

  async selectLevel() {
    const appEl = document.getElementById(APP_ID) as HTMLElement;
    appEl.removeEventListener('click', this.handleMouse);
    document.removeEventListener('keyup', this.handleKeyboard);
    appEl.innerHTML = this.drawSelectLevel();
    const startButton = document.querySelector('.game-select__btn') as HTMLButtonElement;
    startButton.addEventListener('click', async () => {
      const pageQuestionWords = this.getRandomIntInclusive(0, GROUP_PAGE_LIMIT);
      const level = Number((document.querySelector('.game-select__level') as HTMLSelectElement).value);
      this.data = await api.getWords(pageQuestionWords, level);
      this.init();
    });
  }

  async startFromPage(group: number, page: number) {
    this.data = await api.getWords(page, group);
    this.init();
  }

  async init() {
    const appEl = document.getElementById(APP_ID) as HTMLElement;
    this.rightAnswerIndex = 0;
    this.answerChange = 0;
    this.counterCorrectAnswer = 0;
    this.counterPoints = 0;
    this.result = {};
    appEl.innerHTML = `<div class="sprint-page__time-container"><spans class="sprint-page__time"></spans></div>`;
    appEl.innerHTML += '<div class="sprint-page__question"><div/>';
    this.createQuestion();
    this.timer(60);
    appEl.addEventListener('click', this.handleMouse);
    document.addEventListener('keyup', this.handleKeyboard);
  }

  handleMouse = (event: MouseEvent) => {
    const appEl = document.getElementById(APP_ID) as HTMLElement;
    const target = event.target as HTMLButtonElement;

    if (target.classList.contains('sprint-page__button-true')) {
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
    if (target.classList.contains('sprint-page__button-false')) {
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
    (document.querySelector('.result__play-again') as HTMLElement).addEventListener('click', () => {
      const appEl = document.getElementById(APP_ID) as HTMLElement;
      this.rightAnswerIndex = 0;
      this.counterCorrectAnswer = 0;
      this.counterPoints = 0;
      this.result = {};
      appEl.innerHTML = `<div class="sprint-page__time-container"><spans class="sprint-page__time"></spans></div>`;
      appEl.innerHTML += '<div class="sprint-page__question"><div/>';
      this.createQuestion();
      this.timer(60);
      document.addEventListener('keyup', this.handleKeyboard);
    });
  }

  audioResult() {
    const resultContainer = document.querySelector('.result__container') as HTMLElement;
    resultContainer.addEventListener('click', (e) => {
      const target = e.target as HTMLButtonElement;
      if (target.classList.contains('result__word-play')) {
        const playSound = target.closest('div') as HTMLElement;
        const audio = playSound.querySelector('audio') as HTMLAudioElement;
        audio.play();
      }
    });
  }

  drawSelectLevel() {
    return `
    <div class="game-select__container">
          <h2>Спринт</h2>
          <div>
            <p>«Спринт» - это тренировка для повторения заученных слов.</p>
            <div class="game-select__list-container">
              <ul class="game-select__list">
                <li class="game-select__list--item">Используйте мышь, чтобы выбрать.</li>
                <li class="game-select__list--item">Используйте клавиши влево или вправо</li>
              </ul>
            </div>
          </div>
          <div class="select-container">
          <span>Сложность<span/>
            <select class="game-select__level" name="select">
              <option value="0" selected>1</option>
              <option value="1">2</option>
              <option value="2">3</option>
              <option value="3">4</option>
              <option value="4">5</option>
              <option value="5">6</option>
            </select>
            <button class="game-select__btn">Начать</button>
          </div>
        </div>
      `;
  }

  createQuestion = () => {
    const questionContainer = document.querySelector('.sprint-page__question') as HTMLDivElement;
    const question = this.data[this.rightAnswerIndex].word;
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
        this.sounds.correct.rePlay();
      } else {
        this.result[this.rightAnswerIndex] = false;
        this.counterCorrectAnswer = 0;
        this.sounds.wrong.rePlay();
      }
    }
    if (!flag) {
      if (this.answerChange === 0) {
        this.result[this.rightAnswerIndex] = true;
        this.counterCorrectAnswer += 1;
        this.sounds.correct.rePlay();
      } else {
        this.result[this.rightAnswerIndex] = false;
        this.counterCorrectAnswer = 0;
        this.sounds.wrong.rePlay();
      }
    }
  }

  createCorrectIndicator() {
    const a = this.counterCorrectAnswer;
    const circle = document.querySelectorAll<HTMLElement>('.sprint-page__circle');
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
    const sprintResult = document.querySelector('.sprint-page__result') as HTMLElement;

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
    return `
    <div class="sprint-page__section" id="sprint-game-board">
      <h1 class="sprint-page__result">0</h1>
      <div class="sprint-page__card">
        <div class="sprint-page__answer">
          <div class="sprint-page__circles">
            <span class="sprint-page__circle"></span><span class="sprint-page__circle"></span><span class="sprint-page__circle"></span>
          </div>
            <h2 class="srint-page__word">${question}</h2>
            <h3 class="srint-page__translate">${answerOption}</h3>   
        </div>
        <hr class="sprint-page__line" />
        <div class="sprint-page__button-container">
          <button class="sprint-page__button sprint-page__button-true">Верно</button
          ><button class="sprint-page__button sprint-page__button-false">Неверно</button>
        </div>
      </div>
    </div>
    `;
  }

  drawResults = (result: { [key: string]: boolean }) => {
    clearInterval(this.timerId);
    document.removeEventListener('keyup', this.handleKeyboard);
    const lengthObj = Object.keys(result).length;
    const count = Object.values(result).reduce((acc, item) => (item ? acc + 1 : acc), 0);
    return `
      <div class="result__section">
      <div class="result__container">
        <h2 class="result__title">Ваш результат</h2>
        <h2 class="result__correct-num">Знаю: ${count}</h2>
        ${this.drawCorrectResult(this.data, this.result)}
        <hr class="result__line" />
        <h2 class="result__wrong-num">Ошибок: ${lengthObj - count}</h2>
        ${this.drawWrongResult(this.data, this.result)}
      </div>
      <div class="result__button-container">
        <span class="result__btn result__play-again">Играть еще</span><a class="result__btn" href="/games#home">Главная</a>
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
        <div class="result__word-container">
        <button class="result__word-play">
          <span class="result__word-play--label"
            ><svg
              class="result__word-play--icon"
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
          <span class="result__word">${data[Number(prop)].word}</span><span class="result__word-dash"> - </span
          ><span class="result__word-translate">${data[Number(prop)].wordTranslate}</span>
        </div>
      </div>`;
      }
    }

    return html;
  }

  timer(timerValue: number) {
    const appEl = document.getElementById(APP_ID) as HTMLElement;
    let current = timerValue;
    const time = document.querySelector('.sprint-page__time') as HTMLElement;
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
          <div class="result__word-container">
              <button class="result__word-play">
                <span class="result__word-play--label"
                  ><svg
                    class="result__word-play--icon"
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
                <span class="result__word">${data[Number(prop)].word}</span><span class="result__word-dash"> - </span
                ><span class="result__word-translate">${data[Number(prop)].wordTranslate}</span>
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
}

export default SprintPage;
