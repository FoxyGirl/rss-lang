import Router from '../router';
import HomePage from '../pages/HomePage';
import TutorialPage from '../pages/TutorialPage';
import AudioGamePage from '../pages/AudioGamePage';
import SprintPage from '../pages/SprintPage';
import MainTutorialPage from '../pages/MainTutorialPage';
import AccountForm from '../components/AccountForm';

import { FormStrings, LocalStorageKeys } from '../types';
import { APP_ID, GROUP_PARAM } from '../constants';
import { resetLocalCurrentPage, setLocalCurrentPage, getLocalCurrentPage } from '../utils';

class AppController {
  router: Router;

  homePage: HomePage;

  tutorialPage: TutorialPage;

  mainTutorialPage: MainTutorialPage;

  accountForm: AccountForm;

  sprintPage: SprintPage;

  audioGamePage: AudioGamePage;

  page = 0;

  group = 0;

  isGameFromTutorial = false;

  isAuthorized = false;

  constructor() {
    this.homePage = new HomePage();
    this.tutorialPage = new TutorialPage({
      onHandlePageChange: this.handlePageChange,
      onHandleGameClick: this.handleGameClick,
    });
    this.mainTutorialPage = new MainTutorialPage();
    this.accountForm = new AccountForm({ onHandleLoginSuccess: this.handleLogin });
    this.sprintPage = new SprintPage();
    this.audioGamePage = new AudioGamePage();

    const routesActions = {
      home: () => this.drawHomePage(),
      tutorial: () => this.drawMainTutorialPage(),
      tutorialPage: () => this.drawTutorialPage(),
      sprintGame: () => this.drawSprintPage(),
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

    const token = localStorage.getItem(LocalStorageKeys.token);
    if (token) {
      this.isAuthorized = true;
    }

    if (this.isAuthorized) {
      const loginBtn = document.querySelector('.btn--login') as HTMLButtonElement;
      loginBtn.textContent = FormStrings.logout;
    }

    this.handleLoginBtn();
  }

  resetPages = () => {
    // TODO: Place here all reset actions of pages for switch by router
    this.tutorialPage.sound.stop();
    clearInterval(this.sprintPage.timerId);
    document.removeEventListener('keypress', this.audioGamePage.handleKeyboard);
    document.removeEventListener('keyup', this.sprintPage.handleKeyboard);
  };

  handlePageChange = ({ group, page }: { group: number; page: number }) => {
    this.group = group;
    this.page = page;
    setLocalCurrentPage(this.page);
  };

  handleGameClick = () => {
    this.isGameFromTutorial = true;
  };

  drawHomePage() {
    this.homePage.draw();
  }

  drawMainTutorialPage() {
    console.log('>>>> this.isAuthorized =', this.isAuthorized);
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
    const group = Number(this.router.param?.replace(GROUP_PARAM, '')) - 1;

    // To restore game in case reload page
    if (!Number.isNaN(group) && !this.isGameFromTutorial) {
      this.restoreDataForGame(group);
    }

    // To run game with setted params: group and page
    if (this.isGameFromTutorial) {
      console.log(`
        drawSprintPage
        group = ${this.group}, page = ${this.page}`);
      this.isGameFromTutorial = false;
    }
    this.sprintPage.init();
  }

  drawAudioGamePage() {
    const group = Number(this.router.param?.replace(GROUP_PARAM, '')) - 1;

    // To restore game in case reload page
    if (!Number.isNaN(group) && !this.isGameFromTutorial) {
      this.restoreDataForGame(group);
    }

    // To run game with setted params: group and page
    if (this.isGameFromTutorial) {
      console.log(`
      drawAudioGamePage
        group = ${this.group}, page = ${this.page}`);
      this.isGameFromTutorial = false;
    }

    this.audioGamePage.init();
  }

  restoreDataForGame(group: number) {
    this.group = group;
    this.isGameFromTutorial = true;
  }

  drawStatisticsPage() {
    const appEl = document.getElementById(APP_ID) as HTMLElement;
    appEl.innerHTML = `
        <h1>
          Статистика
        </h1> 
        `;
  }

  handleLoginBtn() {
    const loginBtn = document.querySelector('.btn--login') as HTMLButtonElement;
    loginBtn.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLButtonElement;
      if (target) {
        const text = target.textContent?.trim();

        const newText = text === FormStrings.login ? FormStrings.logout : FormStrings.login;
        target.textContent = newText;

        if (newText === FormStrings.logout) {
          this.accountForm.draw();
        }

        if (newText === FormStrings.login) {
          localStorage.removeItem(LocalStorageKeys.token);
          localStorage.removeItem(LocalStorageKeys.refreshToken);
          localStorage.removeItem(LocalStorageKeys.userId);
          localStorage.removeItem(LocalStorageKeys.userName);
          this.isAuthorized = false;
        }
      }
    });
  }

  handleLogin = () => {
    this.isAuthorized = true;
  };
}

export default AppController;
