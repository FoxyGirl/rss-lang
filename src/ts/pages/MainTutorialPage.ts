import { APP_ID } from '../constants';

class MainTutorialPage {
  draw({ isAuthorized }: { isAuthorized: boolean }) {
    const appEl = document.getElementById(APP_ID) as HTMLElement;
    appEl.innerHTML = `
    <section class="tutorial">
      <ul class="tutorial__list">
        ${this.drawLinks(6).join('')}
      </ul>
      ${isAuthorized ? '<h2>Авторизован</h2>' : ''}
    </section>
        `;
  }

  drawLinks(count: number) {
    return [...Array(count)].map(
      (_, ind) => ` <li class="tutorial__item"><a href="#tutorialPage?group=${ind + 1}">Раздел</a></li>`
    );
  }
}

export default MainTutorialPage;
