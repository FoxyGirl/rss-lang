import { APP_ID, GROUPS_NUMBER } from '../constants';

class MainTutorialPage {
  draw({ isAuthorized }: { isAuthorized: boolean }) {
    const appEl = document.getElementById(APP_ID) as HTMLElement;
    appEl.innerHTML = `
    <section class="tutorial">
      <ul class="tutorial__list">
        ${this.drawLinks(GROUPS_NUMBER)}
        ${
          isAuthorized
            ? `<li class="tutorial__item"><a href="#tutorialPage?group=${GROUPS_NUMBER + 1}"  class="group--${
                GROUPS_NUMBER + 1
              }">Сложные</a></li>`
            : ''
        }
      </ul>
    </section>
        `;
  }

  drawLinks(count: number) {
    return [...Array(count)]
      .map(
        (_, ind) =>
          ` <li class="tutorial__item">
              <a href="#tutorialPage?group=${ind + 1}" class="group--${ind + 1}">Раздел</a>
            </li>`
      )
      .join('');
  }
}

export default MainTutorialPage;
