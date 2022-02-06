import Router from '../router';
import HomePage from '../pages/HomePage';
import TutorialPage from '../pages/TutorialPage';

import { APP_ID } from '../constants';

class AppController {
  router: Router;

  homePage: HomePage;

  tutorialPage: TutorialPage;

  constructor() {
    this.homePage = new HomePage();
    this.tutorialPage = new TutorialPage();

    const routesActions = {
      home: () => this.drawHomePage(),
      tutorial: () => this.drawTutorialPage(),
      sprint: () => this.drawSprintPage(),
      audioGame: () => this.drawAudioGamePage(),
      statistics: () => this.drawStatisticsPage(),
    };
    this.router = new Router({ routesActions });
  }

  init() {
    this.router.init();
  }

  drawHomePage() {
    this.homePage.draw();
  }

  drawTutorialPage() {
    this.tutorialPage.init();
  }

  drawSprintPage() {
    const appEl = document.getElementById(APP_ID) as HTMLElement;
    appEl.innerHTML = `
        <h1>
          Игра "Спринт"
        </h1> 
        `;
  }

  drawAudioGamePage() {
    const appEl = document.getElementById(APP_ID) as HTMLElement;
    appEl.innerHTML = `
        <h1>
          Игра "Аудиовызов"
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
