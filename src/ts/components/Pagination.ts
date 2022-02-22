import { Callback } from '../types';

import { APP_ID } from '../constants';

class Pagination {
  page: number;

  maxPage: number;

  constructor({ maxPage }: { maxPage: number }) {
    this.page = 0;
    this.maxPage = maxPage;
  }

  draw({
    currentPage = 0,
    onChangePage,
    hasPages,
  }: {
    currentPage?: number;
    onChangePage: Callback<number>;
    hasPages: boolean;
  }) {
    this.page = currentPage;
    const { isNextActive: isNextActiveStart, isPrevActive: isPrevActiveStart } = this.getPaginationActives(this.page);

    const appEl = document.getElementById(APP_ID) as HTMLElement;

    const pagintationEl = appEl.querySelector('.pagintation') as HTMLLIElement;

    const pagesBtns = hasPages
      ? `
      <button class="btn  btn--prev">Prev</button>
        <span class="pagintaion__current-page">${this.page + 1} / ${this.maxPage + 1}</span>
      <button class="btn  btn--next">Next</button>
    `
      : '';

    const pagintationHTML = `
    <div class="pagintation__container">
      ${pagesBtns}
    </div>
    `;

    if (pagintationEl) {
      pagintationEl.innerHTML = pagintationHTML;
    } else {
      const sectionEl = document.createElement('section');
      sectionEl.classList.add('pagintation');
      sectionEl.innerHTML = pagintationHTML;
      appEl.appendChild(sectionEl);
    }

    if (!hasPages) {
      return;
    }

    const nextButton = document.querySelector('.btn--next') as HTMLButtonElement;
    const prevButton = document.querySelector('.btn--prev') as HTMLButtonElement;

    nextButton.disabled = !isNextActiveStart;
    prevButton.disabled = !isPrevActiveStart;

    nextButton.addEventListener('click', () => {
      const { isNextActive, isPrevActive } = this.getPaginationActives(this.page + 1);

      this.page += 1;
      onChangePage(this.page);

      this.update({
        isNextActive,
        isPrevActive,
        newPage: this.page,
      });
    });

    prevButton.addEventListener('click', () => {
      const { isNextActive, isPrevActive } = this.getPaginationActives(this.page - 1);

      this.page -= 1;
      onChangePage(this.page);

      this.update({
        isNextActive,
        isPrevActive,
        newPage: this.page,
      });
    });
  }

  update({ isNextActive, isPrevActive, newPage }: { isNextActive: boolean; isPrevActive: boolean; newPage: number }) {
    const nextButton = document.querySelector('.btn--next') as HTMLButtonElement;
    const prevButton = document.querySelector('.btn--prev') as HTMLButtonElement;
    const currentPageEl = document.querySelector('.pagintaion__current-page') as HTMLElement;

    nextButton.disabled = !isNextActive;
    prevButton.disabled = !isPrevActive;
    currentPageEl.textContent = `${newPage + 1} / ${this.maxPage + 1}`;
  }

  getPaginationActives = (page: number): { isNextActive: boolean; isPrevActive: boolean } => {
    const isNextActive = page < this.maxPage;
    const isPrevActive = page > 0;

    return { isNextActive, isPrevActive };
  };
}

export default Pagination;
