import Router from '../router';
import HomePage from '../pages/HomePage';
import TutorialPage from '../pages/TutorialPage';
import MainTutorialPage from '../pages/MainTutorialPage';

import { APP_ID, GROUP_PARAM } from '../constants';

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
  }

  resetPages = () => {
    // TODO: Place here all reset actions of pages for switch by router
    this.tutorialPage.sound.stop();
  };

  handlePageChange = ({ group, page }: { group: number; page: number }) => {
    this.group = group;
    this.page = page;
  };

  drawHomePage() {
    this.homePage.draw();
  }

  drawMainTutorialPage() {
    this.mainTutorialPage.draw();
  }

  drawTutorialPage() {
    const group = Number(this.router.param?.replace(GROUP_PARAM, '')) - 1;
    this.tutorialPage.init(group);
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
