import Router from '../router';
import HomePage from '../pages/HomePage';
import TutorialPage from '../pages/TutorialPage';
import MainTutorialPage from '../pages/MainTutorialPage';

import { APP_ID, GROUP_PARAM } from '../constants';
import { resetLocalCurrentPage, setLocalCurrentPage, getLocalCurrentPage } from '../utils';

class AppController {
  router: Router;

  homePage: HomePage;

  tutorialPage: TutorialPage;

  mainTutorialPage: MainTutorialPage;

  page = 0;

  group = 0;

  constructor() {
    this.homePage = new HomePage();
    this.tutorialPage = new TutorialPage({ onHandlePageChange: this.handlePageChange });
    this.mainTutorialPage = new MainTutorialPage();

    const routesActions = {
      home: () => this.drawHomePage(),
      tutorial: () => this.drawMainTutorialPage(),
      tutorialPage: () => this.drawTutorialPage(),
      sprint: () => this.drawSprintPage(),
      audioGame: () => this.drawAudioGamePage(),
      statistics: () => this.drawStatisticsPage(),
    };
    this.router = new Router({ routesActions, callback: this.resetPages });
  }

  init() {
    this.router.init();
    const group = Number(this.router.param?.replace(GROUP_PARAM, '')) - 1;
    if (group) {
      this.group = group;
    }

    const currentPage = getLocalCurrentPage();
    if (currentPage !== null && currentPage !== 0) {
      this.page = Number(currentPage);
    }
  }

  resetPages = () => {
    // TODO: Place here all reset actions of pages for switch by router
    this.tutorialPage.sound.stop();
  };

  handlePageChange = ({ group, page }: { group: number; page: number }) => {
    this.group = group;
    this.page = page;
    setLocalCurrentPage(this.page);
  };

  drawHomePage() {
    this.homePage.draw();
  }

  drawMainTutorialPage() {
    this.mainTutorialPage.draw();
    resetLocalCurrentPage();
  }

  drawTutorialPage() {
    const group = Number(this.router.param?.replace(GROUP_PARAM, '')) - 1;
    this.group = group;

    const currentPage = getLocalCurrentPage();

    if (currentPage !== null) {
      this.page = Number(currentPage);
    }

    this.tutorialPage.init({ group: this.group, page: this.page });
  }

  drawSprintPage() {
    const appEl = document.getElementById(APP_ID) as HTMLElement;
    // You can pass group and page into this.sprintPage.init();
    appEl.innerHTML = `
        <h1>
          Игра "Спринт" group = ${this.group}, page = ${this.page}
        </h1> 
        `;
  }

  drawAudioGamePage() {
    const appEl = document.getElementById(APP_ID) as HTMLElement;
    appEl.innerHTML = `
        <h1>
          Игра "Аудиовызов"  group = ${this.group}, page = ${this.page}
        </h1> 
        `;
  }

  drawStatisticsPage() {
    const appEl = document.getElementById(APP_ID) as HTMLElement;
    appEl.innerHTML = `
        <h1>
          Статистика
        </h1> 
        `;
  }
}

export default AppController;
