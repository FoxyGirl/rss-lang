import { IWord } from '../types';
import { APP_ID, WORDS_PAGE_LIMIT } from '../constants';
import api from '../api';
import { getPaginationActives } from '../utils';

import Pagination from '../components/Pagination';

class TutorialPage {
  static readonly MAX_COUNT = 20 * 5;

  data: IWord[];

  page: number;

  group: number;

  pagination: Pagination;

  constructor() {
    this.data = [];
    this.page = 0;
    this.group = 0;
    this.pagination = new Pagination();
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

    const { isNextActive, isPrevActive } = getPaginationActives(this.page, TutorialPage.MAX_COUNT, WORDS_PAGE_LIMIT);
    this.pagination.draw({
      isNextActive,
      isPrevActive,
      currentPage: this.page,
      onNextPage: this.nextCardPage,
      onPrevPage: this.prevCardPage,
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
  }

  drawCard(card: IWord) {
    const {
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
    <li class="cards__item" data-id="5e9f5ee35eb9e72bc21af4a0">
      <div class="cards__main">
        <img src="https://rss-words-3.herokuapp.com/${image}" alt="${word}" class="cards__img">
        <div class="cards__word">${word}</div>
        <div class="cards__details">
          <span class="cards__translate">${wordTranslate}</span>
          <span class="cards__transcription">${transcription}</span>
          <button class="btn btn--sound">Play</button>
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

    console.log('>>> updateCardsSection', this.page, ulEl);

    await api
      .getWords(this.page, this.group)
      .then((data) => {
        console.log('updateCardsSection data = ', data);
        this.data = data;
      })
      .catch(console.error);

    ulEl.innerHTML = this.data.map(this.drawCard).join('');
  }

  nextCardPage = () => {
    const { isNextActive, isPrevActive } = getPaginationActives(this.page, TutorialPage.MAX_COUNT, WORDS_PAGE_LIMIT);

    if (isNextActive) {
      this.page += 1;
      this.updateCardsSection();

      this.pagination.draw({
        isNextActive,
        isPrevActive,
        currentPage: this.page,
        onNextPage: this.nextCardPage,
        onPrevPage: this.prevCardPage,
      });
    }
  };

  prevCardPage = () => {
    const { isNextActive, isPrevActive } = getPaginationActives(this.page, TutorialPage.MAX_COUNT, WORDS_PAGE_LIMIT);
    console.log('>> isNextActive', isNextActive);

    if (isPrevActive) {
      this.page -= 1;
      this.updateCardsSection();

      this.pagination.draw({
        isNextActive,
        isPrevActive,
        currentPage: this.page,
        onNextPage: this.nextCardPage,
        onPrevPage: this.prevCardPage,
      });
    }
  };
}

export default TutorialPage;
