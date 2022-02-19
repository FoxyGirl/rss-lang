import Router from '../router';
import HomePage from '../pages/HomePage';
import TutorialPage from '../pages/TutorialPage';
import AudioGamePage from '../pages/AudioGamePage';
import SprintPage from '../pages/SprintPage';
import StatisticPage from '../pages/StatisticPage';
import MainTutorialPage from '../pages/MainTutorialPage';

import { APP_ID, GROUP_PARAM } from '../constants';
import { resetLocalCurrentPage, setLocalCurrentPage, getLocalCurrentPage } from '../utils';

class AppController {
  router: Router;

  homePage: HomePage;

  tutorialPage: TutorialPage;

  mainTutorialPage: MainTutorialPage;

  sprintPage: SprintPage;

  audioGamePage: AudioGamePage;

  statisticPage: StatisticPage;

  page = 0;

  group = 0;

  isGameFromTutorial = false;

  constructor() {
    this.homePage = new HomePage();
    this.tutorialPage = new TutorialPage({
      onHandlePageChange: this.handlePageChange,
      onHandleGameClick: this.handleGameClick,
    });
    this.mainTutorialPage = new MainTutorialPage();
    this.sprintPage = new SprintPage();
    this.audioGamePage = new AudioGamePage();
    this.statisticPage = new StatisticPage();

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

    if (!this.isGameFromTutorial) {
      this.sprintPage.selectLevel();
    }

    // To run game with setted params: group and page
    if (this.isGameFromTutorial) {
      console.log(`
        drawSprintPage
        group = ${this.group}, page = ${this.page}`);
      this.isGameFromTutorial = false;
      this.sprintPage.startFromPage(this.group, this.page);
    }
  }

  drawAudioGamePage() {
    const group = Number(this.router.param?.replace(GROUP_PARAM, '')) - 1;

    // To restore game in case reload page
    if (!Number.isNaN(group) && !this.isGameFromTutorial) {
      this.restoreDataForGame(group);
    }

    if (!this.isGameFromTutorial) {
      this.audioGamePage.selectLevel();
    }

    // To run game with setted params: group and page
    if (this.isGameFromTutorial) {
      console.log(`
      drawAudioGamePage
        group = ${this.group}, page = ${this.page}`);
      this.isGameFromTutorial = false;
      this.audioGamePage.startFromPage(this.group, this.page);
    }
  }

  restoreDataForGame(group: number) {
    this.group = group;
    this.isGameFromTutorial = true;
  }

  drawStatisticsPage() {
    // this.statisticPage.draw()
    const appEl = document.getElementById(APP_ID) as HTMLElement;
    appEl.innerHTML = this.statisticPage.drawStatistic();
  }
}

export default AppController;
