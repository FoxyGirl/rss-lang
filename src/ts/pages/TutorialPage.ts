import { IWord } from '../types';
import { APP_ID, GROUP_PAGE_LIMIT } from '../constants';
import api from '../api';

import Pagination from '../components/Pagination';

class TutorialPage {
  data: IWord[];

  page: number;

  group: number;

  pagination: Pagination;

  constructor() {
    this.data = [];
    this.page = 0;
    this.group = 0;
    this.pagination = new Pagination({ maxPage: GROUP_PAGE_LIMIT });
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
        const prevMutedBtn = document.querySelector('.btn--mute') as HTMLElement;
        if (prevMutedBtn) {
          prevMutedBtn.classList.remove('btn--mute');
        }

        target.classList.toggle('btn--mute');

        const cardEL = target.closest('.cards__item') as HTMLElement;
        console.log('cardEL id ', cardEL.dataset.id);
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
  };
}

export default TutorialPage;
