import Router from '../router';
import HomePage from '../pages/HomePage';

import { APP_ID } from '../constants';

class AppController {
  router: Router;

  homePage: HomePage;

  constructor() {
    this.homePage = new HomePage();

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
    const appEl = document.getElementById(APP_ID) as HTMLElement;
    appEl.innerHTML = `
        <h1>
          Учебник
        </h1> 
        `;
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
