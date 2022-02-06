import { CallbackEmpty } from '../types';
import { APP_ID } from '../constants';

class Pagination {
  draw({
    isNextActive,
    isPrevActive,
    currentPage = 0,
    onNextPage,
    onPrevPage,
  }: {
    isNextActive: boolean;
    isPrevActive: boolean;
    currentPage?: number;
    onNextPage: CallbackEmpty;
    onPrevPage: CallbackEmpty;
  }) {
    const appEl = document.getElementById(APP_ID) as HTMLElement;

    const pagintationEl = appEl.querySelector('.pagintation') as HTMLLIElement;
    const pagintationHTML = `
    <button class="btn  btn--prev">Prev</button>
    <span class="btn">${currentPage}</span>
    <button class="btn  btn--next">Next</button>
    `;

    if (pagintationEl) {
      pagintationEl.innerHTML = pagintationHTML;
    } else {
      const sectionEl = document.createElement('section');
      sectionEl.classList.add('pagintation');
      sectionEl.innerHTML = pagintationHTML;
      appEl.appendChild(sectionEl);
    }

    const nextButton = document.querySelector('.btn--next') as HTMLButtonElement;
    const prevButton = document.querySelector('.btn--prev') as HTMLButtonElement;

    nextButton.disabled = !isNextActive;
    prevButton.disabled = !isPrevActive;

    nextButton.addEventListener('click', () => {
      onNextPage();
    });

    prevButton.addEventListener('click', () => {
      onPrevPage();
    });
  }

  update({ isNextActive, isPrevActive }: { isNextActive: boolean; isPrevActive: boolean }) {
    const nextButton = document.querySelector('.btn--next') as HTMLButtonElement;
    const prevButton = document.querySelector('.btn--prev') as HTMLButtonElement;

    nextButton.disabled = !isNextActive;
    prevButton.disabled = !isPrevActive;
  }
}

export default Pagination;
