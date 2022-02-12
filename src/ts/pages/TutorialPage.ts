import { IWord } from '../types';
import { APP_ID, GROUP_PAGE_LIMIT } from '../constants';
import api from '../api';

import Pagination from '../components/Pagination';
import Sound from '../components/Sound';

class TutorialPage {
  data: IWord[];

  page: number;

  group: number;

  pagination: Pagination;

  sound: Sound;

  wordId: string | null;

  constructor() {
    this.data = [];
    this.page = 0;
    this.group = 0;
    this.pagination = new Pagination({ maxPage: GROUP_PAGE_LIMIT });
    this.sound = new Sound({});
    this.wordId = null;
  }

  async init() {
    await api
      .getWords(this.page, this.group)
      .then((data) => {
        console.log('data = ', data);
        this.data = data;
      })
      .catch(console.error);
    this.draw();
    this.drawCards();

    this.pagination.draw({
      onChangePage: this.changePage,
    });
  }

  draw() {
    const appEl = document.getElementById(APP_ID) as HTMLElement;
    appEl.innerHTML = `
        <h1>
          Учебник
        </h1> 
        `;
  }

  drawCards() {
    const appEl = document.getElementById(APP_ID) as HTMLElement;
    const contentEl = document.createElement('div');
    contentEl.innerHTML = `
    <section class="cards">
        <ul class="cards__list">
          ${this.data.map(this.drawCard).join('')}
        </ul>
      </section>
    `;
    appEl.appendChild(contentEl);

    const ulEl = document.querySelector('.cards__list') as HTMLElement;

    ulEl.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;

      if (target.tagName === 'BUTTON') {
        const cardEL = target.closest('.cards__item') as HTMLElement;

        if (cardEL.dataset?.id !== this.wordId || this.sound.isNotAudioSet()) {
          this.wordId = cardEL.dataset?.id || null;
          const newSound = this.data.find(({ id }) => id === this.wordId);

          if (newSound) {
            const { audio, audioExample, audioMeaning } = newSound;
            this.sound.setSound([audio, audioMeaning, audioExample]);
          }
        }

        if (this.sound.isAllowedSound) {
          this.sound.stop();
        } else {
          this.sound.play();
        }

        const prevMutedBtn = document.querySelector('.btn--mute') as HTMLElement;
        if (prevMutedBtn && prevMutedBtn !== target) {
          prevMutedBtn.classList.remove('btn--mute');
        }

        target.classList.toggle('btn--mute');
      }
    });
  }

  drawCard(card: IWord) {
    const {
      id,
      word,
      image,
      transcription,
      wordTranslate,
      textMeaning,
      textExample,
      textMeaningTranslate,
      textExampleTranslate,
    } = card;

    return `
    <li class="cards__item" data-id=${id}>
      <div class="cards__main">
        <img src="https://rss-words-3.herokuapp.com/${image}" alt="${word}" class="cards__img">
        <div class="cards__word">${word}</div>
        <div class="cards__details">
          <span class="cards__translate">${wordTranslate}</span>
          <span class="cards__transcription">${transcription}</span>
          <button class="btn btn--sound"></button>
        </div>
      </div>
      <div class="cards__description">
        <p class="cards__meaning">${textMeaning}</p>
        <p class="cards__example">${textExample}</p>
      </div>
      <div class="cards__description">
        <p class="cards__meaning">${textMeaningTranslate}</p>
        <p class="cards__example">${textExampleTranslate}</p>
      </div>
    </li>
    `;
  }

  async updateCardsSection() {
    const ulEl = document.querySelector('.cards__list') as HTMLElement;

    await api
      .getWords(this.page, this.group)
      .then((data) => {
        console.log('updateCardsSection data = ', data);
        this.data = data;
      })
      .catch(console.error);

    ulEl.innerHTML = this.data.map(this.drawCard).join('');
  }

  changePage = (page: number) => {
    this.page = page;

    this.updateCardsSection();
    this.sound.reset();
  };
}

export default TutorialPage;
