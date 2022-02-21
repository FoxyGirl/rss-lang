import { IWord } from '../types';
import api from '../api';
import { API_URL, APP_ID, GROUP_PAGE_LIMIT, WORDS_PAGE_LIMIT } from '../constants';
import Sound from '../components/Sound';
import { shuffledArr, getRandomIntInclusive, saveStatistic } from '../utils';

class AudioGamePage {
  data: IWord[];

  page: number;

  group: number;

  rightAnswerIndex: number;

  sounds: { [key: string]: Sound };

  result: { [key: string]: boolean };

  flag: boolean;

  constructor() {
    this.data = [];
    this.page = 0;
    this.group = 0;
    this.rightAnswerIndex = 0;
    this.flag = true;
    this.result = {};
    this.sounds = {
      wrong: new Sound({ src: './assets/audio/wrong.mp3' }),
      correct: new Sound({ src: './assets/audio/correct.mp3' }),
    };
  }

  async selectLevel() {
    document.removeEventListener('keypress', this.handleKeyboard);
    const appEl = document.getElementById(APP_ID) as HTMLElement;
    appEl.innerHTML = this.drawSelectLevel();
    const startAudiobattleBtn = document.querySelector('.game-select__btn') as HTMLButtonElement;
    startAudiobattleBtn.addEventListener('click', async () => {
      const pageQuestionWords = getRandomIntInclusive(0, GROUP_PAGE_LIMIT);
      const audiobattleLevel = Number((document.querySelector('.game-select__level') as HTMLSelectElement).value);
      this.data = await api.getWords(pageQuestionWords, audiobattleLevel);
      this.init();
    });
  }

  async startFromPage(group: number, page: number) {
    this.data = await api.getWords(page, group);
    this.init();
  }

  init() {
    this.rightAnswerIndex = 0;
    this.flag = true;
    this.result = {};
    if (localStorage.getItem('statistics') === null) {
      const statistics = {
        audiobattle: [],
        sprint: [],
      };
      localStorage.setItem('statistics', JSON.stringify(statistics));
    }
    const appEl = document.getElementById(APP_ID) as HTMLElement;
    appEl.innerHTML = '<div class="audiobattle__section"></div>';
    this.createQuestion(this.data, this.rightAnswerIndex);
    this.playAudio();
    appEl.addEventListener('click', this.handleMouse);
    document.addEventListener('keypress', this.handleKeyboard);
  }

  handleMouse = async (event: MouseEvent) => {
    const appEl = document.getElementById(APP_ID) as HTMLElement;
    const target = event.target as HTMLButtonElement;

    if (target.classList.contains('audiobattle__answer-btn')) {
      const answer = Number(target.dataset.index);
      const rightAnswerContainer = document.querySelector('.audiobattle__correct-answer-container') as HTMLDivElement;
      rightAnswerContainer.innerHTML = this.drawAnswer(this.data, this.rightAnswerIndex);
      const answersElem = document.querySelectorAll<HTMLElement>(`.audiobattle__answer-btn`);
      for (let i = 0; i < answersElem.length; i += 1) {
        answersElem[i].setAttribute('disabled', 'disabled');

        if (answersElem[i].dataset.index === String(this.rightAnswerIndex)) {
          answersElem[i].classList.add('true');
        } else {
          answersElem[i].classList.add('false');
        }
      }
      const nextQuestion = document.querySelector('.audiobattle__next-question--container') as HTMLDivElement;
      nextQuestion.innerHTML = this.drawNextQuestion();

      if (this.rightAnswerIndex === answer) {
        this.result[this.rightAnswerIndex] = true;
        this.sounds.correct.rePlay();
      } else {
        this.result[this.rightAnswerIndex] = false;
        this.sounds.wrong.rePlay();
      }
    }

    if (target.classList.contains('audiobattle__btn-play')) {
      this.playAudio();
    }

    if (target.classList.contains('audiobattle__next')) {
      if (this.rightAnswerIndex < WORDS_PAGE_LIMIT - 1) {
        this.rightAnswerIndex += 1;
        this.createQuestion(this.data, this.rightAnswerIndex);
        this.playAudio();
      } else {
        appEl.innerHTML = this.drawResults(this.result);
        await saveStatistic(this.result, this.data, 'audio');
        this.playAgain();
        this.audioResult();
        this.rightAnswerIndex = 0;
        this.result = {};
      }
    }

    if (target.classList.contains('audiobattle__no-answer-btn')) {
      const rightAnswerContainer = document.querySelector('.audiobattle__correct-answer-container') as HTMLDivElement;
      rightAnswerContainer.innerHTML = this.drawAnswer(this.data, this.rightAnswerIndex);
      this.result[this.rightAnswerIndex] = false;
      const answersElem = document.querySelectorAll<HTMLElement>(`.audiobattle__answer-btn`);
      for (let i = 0; i < answersElem.length; i += 1) {
        answersElem[i].setAttribute('disabled', 'disabled');
        if (answersElem[i].dataset.index === String(this.rightAnswerIndex)) {
          answersElem[i].classList.add('true');
        } else {
          answersElem[i].classList.add('false');
        }
      }
      this.sounds.wrong.rePlay();
      const nextQuestion = document.querySelector('.audiobattle__next-question--container') as HTMLDivElement;
      nextQuestion.innerHTML = this.drawNextQuestion();
    }

    if (target.classList.contains('audiobattle__correct-answer--play')) {
      this.playAudio();
    }
  };

  handleKeyboard = async (event: KeyboardEvent) => {
    const appEl = document.getElementById(APP_ID) as HTMLElement;
    if (event.key === '1' || event.key === '2' || event.key === '3' || event.key === '4' || event.key === '5') {
      const nextQuestion = document.querySelector('.audiobattle__next-question--container') as HTMLDivElement;
      nextQuestion.innerHTML = this.drawNextQuestion();
      const pressElem = document.querySelector(`.audiobattle__answer-btn[data="${event.key}"]`) as HTMLButtonElement;

      if (!pressElem.hasAttribute('disabled')) {
        const answersElem = document.querySelectorAll<HTMLElement>(`.audiobattle__answer-btn`);
        for (let i = 0; i < answersElem.length; i += 1) {
          answersElem[i].setAttribute('disabled', 'disabled');

          if (answersElem[i].dataset.index === String(this.rightAnswerIndex)) {
            answersElem[i].classList.add('true');
          } else {
            answersElem[i].classList.add('false');
          }
        }
        const answer = Number(pressElem.dataset.index);
        const rightAnswerContainer = document.querySelector('.audiobattle__correct-answer-container') as HTMLDivElement;
        rightAnswerContainer.innerHTML = this.drawAnswer(this.data, this.rightAnswerIndex);

        if (this.rightAnswerIndex === answer) {
          this.result[this.rightAnswerIndex] = true;
          this.sounds.correct.rePlay();
        } else {
          this.result[this.rightAnswerIndex] = false;
          this.sounds.wrong.rePlay();
        }
      }
    }

    if (event.key === ' ') {
      this.playAudio();
    }

    if (event.key === 'Enter') {
      const nextQuestion = document.querySelector('.audiobattle__next-question--container') as HTMLElement;
      const noAnswer = document.querySelector('.audiobattle__no-answer-btn');
      const rightAnswerContainer = document.querySelector('.audiobattle__correct-answer-container') as HTMLDivElement;
      rightAnswerContainer.innerHTML = this.drawAnswer(this.data, this.rightAnswerIndex);

      if (this.rightAnswerIndex < WORDS_PAGE_LIMIT - 1 && noAnswer === null) {
        this.rightAnswerIndex += 1;
        this.createQuestion(this.data, this.rightAnswerIndex);
        this.playAudio();
      } else if (this.rightAnswerIndex === WORDS_PAGE_LIMIT - 1 && noAnswer === null) {
        appEl.innerHTML = this.drawResults(this.result);
        await saveStatistic(this.result, this.data, 'audio');
        this.playAgain();
        this.audioResult();

        this.rightAnswerIndex = 0;
        this.result = {};
      } else if (noAnswer !== null) {
        this.result[this.rightAnswerIndex] = false;
        const answersElem = document.querySelectorAll<HTMLElement>(`.audiobattle__answer-btn`);
        for (let i = 0; i < answersElem.length; i += 1) {
          answersElem[i].setAttribute('disabled', 'disabled');

          if (answersElem[i].dataset.index === String(this.rightAnswerIndex)) {
            answersElem[i].classList.add('true');
          } else {
            answersElem[i].classList.add('false');
          }
        }
        this.sounds.wrong.rePlay();
        nextQuestion.innerHTML = this.drawNextQuestion();
      }
    }
  };

  playAgain() {
    (document.querySelector('.result__play-again') as HTMLElement).addEventListener('click', () => {
      const appEl = document.getElementById(APP_ID) as HTMLElement;
      this.rightAnswerIndex = 0;
      this.result = {};
      appEl.innerHTML = '<div class="audiobattle__section"></div>';
      this.createQuestion(this.data, this.rightAnswerIndex);
      this.playAudio();
      document.addEventListener('keypress', this.handleKeyboard);
    });
  }

  drawSelectLevel() {
    return `
    <div class="game-select__container">
      <h2>Аудиовызов</h2>
      <div>
        <p>«Аудиовызов» - это тренировка которая улучшает восприятие речи на слух.</p>
        <div class="game-select__list-container">
          <ul class="game-select__list">
            <li class="game-select__list--item">Используйте мышь, чтобы выбрать.</li>
            <li class="game-select__list--item">Используйте цифровые клавиши от 1 до 5 для выбора ответа.</li>
            <li class="game-select__list--item">Используйте клавишу пробел для повторного звучания слова.</li>
            <li class="game-select__list--item">Используйте клавишу Enter для переходу к следующему слову.</li>
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

  drawNextQuestion() {
    return `
      <div class="audiobattle__btn-container">
        <button class="audiobattle__next">Следующий</button>
      </div>
    `;
  }

  renderQuestion(words: IWord[], arr: number[], rightAnswerIndex: number) {
    return `
    <div class="audiobattle__correct-answer-container">
      <div class="audiobattle__btn-container"> 
        <button class="audiobattle__btn-play">
          <span class="audiobattle__btn-play-label"
            ><svg
              class="audiobattle__btn-play-icon"
              focusable="false"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"
              ></path></svg></span
          ><span></span>
        </button>
      </div>
       <div class="audiobattle-right-answer">
         <audio src="${API_URL}/${words[rightAnswerIndex].audio}"></audio>
       </div>
    </div>
    <div class="audiobattle__answers">
    ${arr
      .map(
        (item, ind) =>
          `<button class="audiobattle__answer-btn" data="${ind + 1}" data-index="${item}">${ind + 1}. ${
            words[item].wordTranslate
          }</button>`
      )
      .join('')}
    </div>
    <div class="audiobattle__next-question--container">
      <div class="audiobattle__btn-container">
        <button class="audiobattle__no-answer-btn">Не знаю</button>
      </div>
    <div/>
    `;
  }

  drawAnswer(words: IWord[], rightAnswerIndex: number) {
    return `
    <div class="audiobattle__correct-answer--container">
      <div class="audiobattle__img-container">
        <img src="${API_URL}/${words[rightAnswerIndex].image}" alt="" />
        <audio src="${API_URL}/${words[rightAnswerIndex].audio}"></audio>
      </div>
      <div>
        <button class="audiobattle__correct-answer--play">
          <span
            ><svg
              focusable="false"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"
              ></path></svg></span
          ><span></span>
        </button>
        <span class="audiobattle__correct-answer-world">${words[rightAnswerIndex].word}</span>
      </div>
    </div>`;
  }

  drawResults = (result: { [key: string]: boolean }) => {
    document.removeEventListener('keypress', this.handleKeyboard);
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
        <span class="result__btn result__play-again">Играть еще</span><a class="result__btn" href="/#home">Главная</a>
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

  drawWrongResult(data: IWord[], result: { [key: string]: boolean }) {
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

  playAudio() {
    const audio = document.querySelector('audio') as HTMLAudioElement;
    audio.play();
  }

  createQuestion(wordsList: IWord[], rightAnswerIndex: number) {
    const audiobattleQuestion = document.querySelector('.audiobattle__section') as HTMLDivElement;
    const arr = [...Array(wordsList.length)].map((_, ind) => ind);
    let newArr = shuffledArr(arr);
    const del = newArr.indexOf(rightAnswerIndex);
    newArr.splice(del, 1);
    newArr = newArr.slice(0, 4);
    newArr.push(rightAnswerIndex);
    newArr = shuffledArr(newArr);
    audiobattleQuestion.innerHTML = this.renderQuestion(wordsList, newArr, rightAnswerIndex);
  }
}

export default AudioGamePage;
