import Router from '../router';

class AppController {
  router: Router;

  constructor() {
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
    (document.querySelector('#app h1') as HTMLElement).textContent = 'Главная';
  }

  drawTutorialPage() {
    const titleEl = document.querySelector('#app h1') as HTMLElement;
    titleEl.textContent = 'Учебник';
  }

  drawSprintPage() {
    (document.querySelector('#app h1') as HTMLElement).textContent = 'Игра "Спринт"';
  }

  drawAudioGamePage() {
    (document.querySelector('#app h1') as HTMLElement).textContent = 'Игра "Аудиовызов"';
  }

  drawStatisticsPage() {
    (document.querySelector('#app h1') as HTMLElement).textContent = 'Статистика';
  }
}

export default AppController;
