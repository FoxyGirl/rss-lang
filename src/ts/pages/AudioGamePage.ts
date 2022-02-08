/* eslint-disable no-restricted-syntax */
import { IWord } from '../types';
import api from '../api';
import { APP_ID, GROUP_WORDS_PAGE_LIMIT, WORDS_PAGE_LIMIT } from '../constants';

class AudioGamePage {
  data: IWord[];

  page: number;

  group: number;

  rightAnswerIndex: number;

  result: { [key: string]: boolean };

  constructor() {
    this.data = [];
    this.page = 0;
    this.group = 0;
    this.rightAnswerIndex = 0;
    this.result = {};
  }

  async init() {
    const appEl = document.getElementById(APP_ID) as HTMLElement;
    appEl.innerHTML = this.drawSelectLevel();
    const startAudiobattleBtn = document.querySelector('.start-audiobattle') as HTMLButtonElement;

    startAudiobattleBtn.addEventListener('click', async () => {
      const pageQuestionWords = this.getRandomIntInclusive(0, GROUP_WORDS_PAGE_LIMIT - 1);
      const audiobattleLevel = Number((document.querySelector('.audiobattle-select-level') as HTMLSelectElement).value);
      appEl.innerHTML = '<div class="audiobattle-page-question"></div>';
      this.data = await api.getWords(pageQuestionWords, audiobattleLevel);
      this.createQuestion(this.data, this.rightAnswerIndex);
      appEl.innerHTML += this.drawNextQuestion();
      this.playAudio();
    });

    appEl.addEventListener('click', (event: MouseEvent) => {
      const target = event.target as HTMLButtonElement;
      if (target.classList.contains('audiobattle-answer-btn')) {
        const answer = Number(target.dataset.index);
        const rightAnswerContainer = document.querySelector('.audiobattle-right-answer-container') as HTMLDivElement;
        rightAnswerContainer.innerHTML = this.drawAnswer(this.data, this.rightAnswerIndex);
        if (this.rightAnswerIndex === answer) {
          target.classList.add('true');
          // this.result[`${String(answer)}`] = true;
          this.result[this.rightAnswerIndex] = true;
          // (document.querySelector('.audiobattle-correct-sound') as HTMLAudioElement).play();
        } else {
          target.classList.add('false');
          this.result[this.rightAnswerIndex] = false;
          // (document.querySelector('.audiobattle-wrong-sound') as HTMLAudioElement).play();
        }
      }
      if (target.classList.contains('audiobattle-btn')) {
        this.playAudio();
      }
      if (target.classList.contains('audiobattle-next')) {
        if (this.rightAnswerIndex < WORDS_PAGE_LIMIT - 1) {
          this.rightAnswerIndex += 1;
          this.createQuestion(this.data, this.rightAnswerIndex);
          this.playAudio();
        } else {
          appEl.innerHTML = this.drawResults();
          this.rightAnswerIndex = 0;
          this.data = [];
          this.result = {};
        }
      }
    });

    document.addEventListener('keypress', (event: KeyboardEvent) => {
      if (
        event.keyCode === 49 ||
        event.keyCode === 50 ||
        event.keyCode === 51 ||
        event.keyCode === 52 ||
        event.keyCode === 53
      ) {
        const pressElem = document.querySelector(
          `.answers .audiobattle-answer-btn[data="${event.keyCode}"]`
        ) as HTMLButtonElement;
        const answer = Number(pressElem.dataset.index);
        const rightAnswerContainer = document.querySelector('.audiobattle-right-answer-container') as HTMLDivElement;
        rightAnswerContainer.innerHTML = this.drawAnswer(this.data, this.rightAnswerIndex);
        if (this.rightAnswerIndex === answer) {
          pressElem.classList.add('true');
          // this.result[`${String(answer)}`] = true;
          this.result[this.rightAnswerIndex] = true;
          // (document.querySelector('.audiobattle-correct-sound') as HTMLAudioElement).play();
        } else {
          pressElem.classList.add('false');
          this.result[this.rightAnswerIndex] = false;
          // (document.querySelector('.audiobattle-wrong-sound') as HTMLAudioElement).play();
        }
      }
      if (event.keyCode === 32) {
        this.playAudio();
      }

      if (event.keyCode === 13) {
        if (this.rightAnswerIndex < WORDS_PAGE_LIMIT - 1) {
          this.rightAnswerIndex += 1;
          this.createQuestion(this.data, this.rightAnswerIndex);
          this.playAudio();
        } else {
          appEl.innerHTML = this.drawResults();
          this.rightAnswerIndex = 0;
          this.data = [];
          this.result = {};
        }
      }
    });
  }

  drawSelectLevel() {
    return `
      <select class="audiobattle-select-level" name="select">
        <option value="0" selected>1</option>
        <option value="1">2</option>
        <option value="2">3</option>
        <option value="3">4</option>
        <option value="4">5</option>
        <option value="5">6</option>
      </select>
      <button class="start-audiobattle">start</button>
      `;
  }

  drawNextQuestion() {
    return `
      <div class="btn-container">
        <button class="audiobattle-next">Следующий</button>
        <audio class="audiobattle-correct-sound" src="assets/mp3/correct.mp3"></audio>
        <audio class="audiobattle-wrong-sound" src="assets/mp3/wrong.mp3"></audio>
      </div>
    `;
  }

  renderQuestion(words: IWord[], arr: number[], rightAnswerIndex: number) {
    return `
    <div class="audiobattle-right-answer-container">
      <div class="btn-container">
        <button class="audiobattle-btn">play</button>
      </div>
      <div class="audiobattle-right-answer">
        <audio src="https://react-learnwords-example.herokuapp.com/${words[rightAnswerIndex].audio}"></audio>
      </div>
    </div>
    <div class="answers">
      <button class="audiobattle-answer-btn" data="49" data-index="${arr[0]}">${words[arr[0]].wordTranslate}</button>
      <button class="audiobattle-answer-btn" data="50" data-index="${arr[1]}">${words[arr[1]].wordTranslate}</button>
      <button class="audiobattle-answer-btn" data="51" data-index="${arr[2]}">${words[arr[2]].wordTranslate}</button>
      <button class="audiobattle-answer-btn" data="52" data-index="${arr[3]}">${words[arr[3]].wordTranslate}</button>
      <button class="audiobattle-answer-btn" data="53" data-index="${arr[4]}">${words[arr[4]].wordTranslate}</button>
    </div>
    `;
  }

  drawAnswer(words: IWord[], rightAnswerIndex: number) {
    return `
    <div>
      <img src="https://react-learnwords-example.herokuapp.com/${words[rightAnswerIndex].image}" alt="" /></div>
    <div>
      <button>play</button>
      <span>${words[rightAnswerIndex].word}</span>
    </div>`;
  }

  drawResults() {
    return `
      <div class="audiobatttle-result">
        <h2>Результат</h2>
        <div>Верно</div>
        <div class="audiobatttle-correct-answer">${this.drawCorrectResult(this.data, this.result)}</div>
        <hr />
        <div>Ошибка</div>
        <div class="audiobatttle-wrong-answer">${this.drawWrongResult(this.data, this.result)}</div>
      </div>
    `;
  }

  drawCorrectResult(data: IWord[], result: { [key: string]: boolean }) {
    // eslint-disable-next-line no-restricted-syntax
    // eslint-disable-next-line guard-for-in
    let html = '';
    for (const prop in result) {
      if (result[prop] === true) {
        html += `
          <div>
            <button>play</button>
            <span>${data[Number(prop)].word}</span>
            <span>-</span>
            <span>${data[Number(prop)].wordTranslate}</span>
          </div>`;
      }
    }

    return html;
  }

  drawWrongResult(data: IWord[], result: { [key: string]: boolean }) {
    // eslint-disable-next-line no-restricted-syntax
    // eslint-disable-next-line guard-for-in
    let html = '';

    for (const prop in result) {
      if (result[prop] === false) {
        html += `
          <div>
            <button>play</button> 
            <span>${data[Number(prop)].word}</span>
            <span>-</span>
            <span>${data[Number(prop)].wordTranslate}</span>
          </div>`;
      }
    }

    return html;
  }

  playAudio() {
    const audio = document.querySelector('audio') as HTMLAudioElement;
    /* audio.src = `https://react-learnwords-example.herokuapp.com/${src}`; */
    audio.play();
  }

  shuffledArr(arr: number[]) {
    arr.sort(() => Math.random() - 0.5);
    return arr;
  }

  getRandomIntInclusive(min: number, max: number) {
    const a = Math.ceil(min);
    const b = Math.floor(max);
    return Math.floor(Math.random() * (b - a + 1)) + a;
  }

  createQuestion(wordsList: IWord[], rightAnswerIndex: number) {
    const audiobattleQuestion = document.querySelector('.audiobattle-page-question') as HTMLDivElement;
    const arr: number[] = [];
    for (let i = 0; i < wordsList.length; i += 1) {
      arr.push(i);
    }
    let newArr = this.shuffledArr(arr);
    const del = newArr.indexOf(rightAnswerIndex);
    newArr.splice(del, 1);
    newArr = newArr.slice(0, 4);
    newArr.push(rightAnswerIndex);
    newArr = this.shuffledArr(newArr);
    audiobattleQuestion.innerHTML = this.renderQuestion(wordsList, newArr, rightAnswerIndex);
  }
}

export default AudioGamePage;
