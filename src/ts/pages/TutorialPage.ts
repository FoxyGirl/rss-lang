import { IWord, Callback, CallbackEmpty, WordProps } from '../types';
import { APP_ID, GROUP_PAGE_LIMIT, GROUPS_NUMBER } from '../constants';
import api from '../api';

import { resetLocalCurrentPage } from '../utils';
import Pagination from '../components/Pagination';
import Sound from '../components/Sound';
import Loader from '../components/Loader';

class TutorialPage {
  data: IWord[];

  page: number;

  group: number;

  pagination: Pagination;

  sound: Sound;

  loader: Loader;

  wordId: string | null;

  isAuthorized = false;

  isHardWordsGroup = false;

  onHandlePageChange: Callback<{ group: number; page: number }>;

  onHandleGameClick: CallbackEmpty;

  constructor({
    group = 0,
    onHandlePageChange,
    onHandleGameClick,
  }: {
    group?: number;
    onHandlePageChange: Callback<{ group: number; page: number }>;
    onHandleGameClick: CallbackEmpty;
  }) {
    this.data = [];
    this.page = 0;
    this.group = group;
    this.pagination = new Pagination({ maxPage: GROUP_PAGE_LIMIT });
    this.sound = new Sound({});
    this.wordId = null;
    this.onHandlePageChange = onHandlePageChange;
    this.onHandleGameClick = onHandleGameClick;
    this.loader = new Loader();
  }

  async getWords() {
    if (this.isAuthorized && this.group < GROUPS_NUMBER) {
      await api
        .getWords(this.page, this.group)
        .then((data) => {
          this.data = data;
          const promises = data.map(({ id }) => api.getUserWord(id));

          return Promise.allSettled(promises);
        })
        .then((dataOptional) => {
          dataOptional.forEach((item, ind) => {
            if (item.status === 'fulfilled') {
              const { value } = item;
              this.data[ind].difficulty = value.difficulty;
            }
          });
        })
        .catch(console.error);
    }

    if (this.isAuthorized && this.isHardWordsGroup) {
      let difficultyData: { difficulty: string }[] = [];

      await api
        .getUserWords()
        .then((data) => {
          difficultyData = data.map((item) => ({ difficulty: item.difficulty }));
          const promises = data.map(({ wordId }) => api.getWord(wordId));

          return Promise.allSettled(promises);
        })
        .then((dataOptional) => {
          this.data = dataOptional.reduce((acc, item, ind) => {
            if (item.status === 'fulfilled' && item.value) {
              const { value } = item;
              value.difficulty = difficultyData[ind].difficulty;
              return [...acc, value];
            }
            return acc;
          }, [] as IWord[]);
        })
        .catch(console.error);
    }

    if (!this.isAuthorized) {
      await api
        .getWords(this.page, this.group)
        .then((data) => {
          this.data = data;
        })
        .catch(console.error);
    }
  }

  async init({ group = 0, page = 0, isAuthorized = false }) {
    this.group = group;
    this.page = page;
    this.isAuthorized = isAuthorized;
    this.isHardWordsGroup = this.group === GROUPS_NUMBER;

    await this.getWords();

    if (!this.isAuthorized && this.isHardWordsGroup) {
      window.location.href = '#tutorial';
    }

    this.clear();

    if (this.data.length === 0) {
      this.drawEmpty();
    } else {
      this.drawCards();
    }

    this.pagination.draw({
      hasPages: this.group !== GROUPS_NUMBER,
      currentPage: page,
      onChangePage: this.changePage,
    });

    this.drawGamesLinks();
    this.drawGroupLinks();
  }

  clear() {
    const appEl = document.getElementById(APP_ID) as HTMLElement;
    appEl.innerHTML = '';
  }

  drawEmpty() {
    const appEl = document.getElementById(APP_ID) as HTMLElement;
    appEl.innerHTML = `
      <h2 class="cards__empty">Слов для этого раздела не найдено :/</h2>
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

    ulEl.addEventListener('click', async (e: Event) => {
      const target = e.target as HTMLElement;

      if (target.tagName === 'BUTTON' && target.classList.contains('btn--sound')) {
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

      if (target.tagName === 'BUTTON' && target.classList.contains('btn--hard')) {
        const cardEL = target.closest('.cards__item') as HTMLElement;
        const wordId = cardEL.dataset?.id;

        if (wordId) {
          if (this.isHardWordsGroup) {
            await api
              .deleteUserWord(wordId)
              .then((data) => {
                if (data) {
                  const cardEl = document.querySelector(`.cards__item[data-id="${wordId}"]`) as HTMLElement;
                  cardEl.remove();
                }
              })
              .catch(console.error);
          } else {
            await api.createUserWord(wordId, { difficulty: WordProps.difficultyHard }).catch(console.error);

            await api
              .getUserWord(wordId)
              .then((data) => {
                const cardEl = document.querySelector(`.cards__item[data-id="${data.wordId}"]`) as HTMLElement;
                cardEl.classList.add('cards__item--hard');
                target.setAttribute('disabled', 'true');
              })
              .catch(console.error);
          }
        }
      }
    });

    this.disableHardBtns();
  }

  disableHardBtns() {
    if (this.isHardWordsGroup) {
      return;
    }

    const hardData = this.data.filter((item) => item.difficulty === WordProps.difficultyHard);
    hardData.forEach((item) => {
      const hardBtnEl = document.querySelector(`.cards__item[data-id="${item.id}"] .btn--hard`) as HTMLButtonElement;
      hardBtnEl.disabled = true;
    });
  }

  drawCard = (card: IWord) => {
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
      difficulty,
    } = card;

    const difficultyClass = difficulty === WordProps.difficultyHard ? 'cards__item--hard' : '';

    return `
    <li class="cards__item group--${this.group + 1}  ${difficultyClass}" data-id=${id}>
      <div class="cards__main">
        <img src="https://rss-words-3.herokuapp.com/${image}" alt="${word}" class="cards__img">
        <div class="cards__info">
          <div class="cards__word">${word}</div>
          <div class="cards__details">
            <span class="cards__translate">${wordTranslate}</span>
            <span class="cards__transcription">${transcription}</span>
            <button class="btn btn--sound"></button>
          </div>
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
      ${this.drawButtons()}
    </li>
    `;
  };

  drawButtons() {
    if (!this.isAuthorized) {
      return '';
    }

    const hardText = this.isHardWordsGroup ? 'Удалить' : 'Сложное';

    const buttonsSectionEl = `
    <div class="cards__buttons">      
      <button class="btn btn--hard">${hardText}</button>
      <button class="btn btn--learnt">Изученное</button>
    </div>
    `;
    return buttonsSectionEl;
  }

  async updateCardsSection() {
    const ulEl = document.querySelector('.cards__list') as HTMLElement;

    this.loader.draw('.cards__list');

    await this.getWords();

    const loaderEL = document.querySelector('.loader') as HTMLElement;
    loaderEL.remove();

    ulEl.innerHTML = this.data.map(this.drawCard).join('');

    this.disableHardBtns();
  }

  drawGroupLinks() {
    const sectionEl = document.createElement('section');
    sectionEl.classList.add('nav-groups');
    sectionEl.innerHTML = `
    <ul class="nav-groups__list">
      ${[...Array(6)]
        .map((_, ind) => {
          const activeClass = ind === this.group ? 'nav-groups__item--active' : '';
          return `
              <li class="nav-groups__item ${activeClass}">
                <a href="#tutorialPage?group=${ind + 1}">${ind + 1}</a>
              </li>
            `;
        })
        .join('')}
        ${
          this.isAuthorized
            ? `
            <li class="nav-groups__item ${this.isHardWordsGroup ? 'nav-groups__item--active' : ''}">
                <a href="#tutorialPage?group=${GROUPS_NUMBER + 1}">${GROUPS_NUMBER + 1}</a>
              </li>
            `
            : ''
        }
    </ul>
    `;

    const paginationEl = document.querySelector('.pagintation__container') as HTMLElement;
    paginationEl.appendChild(sectionEl);
    sectionEl.addEventListener('click', this.resetPage);
  }

  drawGamesLinks() {
    const sectionEl = document.createElement('section');
    sectionEl.classList.add('nav-games');
    sectionEl.innerHTML = `
    <ul class="nav-games__list">
      <li class="nav-games__item">
        <a href="#sprintGame?group=${this.group + 1}" class="btn">Спринт</a>
      </li>
      <li class="nav-games__item">
        <a href="#audioGame?group=${this.group + 1}" class="btn">Аудивызов</a>
      </li>
    </ul>
    `;
    const paginationEl = document.querySelector('.pagintation__container') as HTMLElement;
    paginationEl.appendChild(sectionEl);

    const gameLins = document.querySelector('.nav-games') as HTMLElement;

    gameLins.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;

      if (target.tagName === 'A') {
        this.onHandleGameClick();
      }
    });
  }

  resetPage = (e: Event) => {
    const target = e.target as HTMLElement;

    if (target.tagName === 'A') {
      resetLocalCurrentPage();
      this.onHandlePageChange({ group: this.group, page: 0 });
    }
  };

  changePage = (page: number) => {
    this.page = page;

    this.updateCardsSection();
    this.sound.reset();
    this.onHandlePageChange({ group: this.group, page: this.page });
  };
}

export default TutorialPage;
