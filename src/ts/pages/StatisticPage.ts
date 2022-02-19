import { IStatistic } from '../types';
// import api from '../api';
// import { API_URL, APP_ID, GROUP_PAGE_LIMIT, WORDS_PAGE_LIMIT } from '../constants';

class StatisticPage {
  countDayGameSprint: number;

  countNewTodayWordsSprint: number;

  maxRightAnswersSprint: number;

  countRightAnswersSprint: number;

  countNumQuestionsSprint: number;

  unicNotTodayWordsSprint: string[];

  unicTodayUseWordsSprint: string[];

  countDayGameAudiobattle: number;

  countNewTodayWordsAudiobattle: number;

  maxRightAnswersAudiobattle: number;

  countRightAnswersAudiobattle: number;

  countNumQuestionsAudiobattle: number;

  unicNotTodayWordsAudiobattle: string[];

  unicTodayUseWordsAudiobattle: string[];

  constructor() {
    this.countDayGameSprint = 0;
    this.countNewTodayWordsSprint = 0;
    this.maxRightAnswersSprint = 0;
    this.countRightAnswersSprint = 0;
    this.countNumQuestionsSprint = 0;
    this.unicNotTodayWordsSprint = [];
    this.unicTodayUseWordsSprint = [];

    this.countDayGameAudiobattle = 0;
    this.countNewTodayWordsAudiobattle = 0;
    this.maxRightAnswersAudiobattle = 0;
    this.countRightAnswersAudiobattle = 0;
    this.countNumQuestionsAudiobattle = 0;
    this.unicNotTodayWordsAudiobattle = [];
    this.unicTodayUseWordsAudiobattle = [];
  }

  drawStatistic() {
    if (localStorage.getItem('statistics') === null) {
      const statistics = {
        audiobattle: [],
        sprint: [],
      };
      localStorage.setItem('statistics', JSON.stringify(statistics));
    }
    this.audiobattleStatistic();
    this.sprintStatistic();
    const persentRightAnswerSprint = !Number.isNaN(
      Math.round(this.countRightAnswersSprint / this.countNumQuestionsSprint)
    )
      ? Math.round((this.countRightAnswersSprint / this.countNumQuestionsSprint) * 100)
      : 0;
    const persentRightAnswerAudiobattle = !Number.isNaN(
      Math.round(this.countRightAnswersAudiobattle / this.countNumQuestionsAudiobattle)
    )
      ? Math.round((this.countRightAnswersAudiobattle / this.countNumQuestionsAudiobattle) * 100)
      : 0;

    const countDayGame = this.countDayGameAudiobattle + this.countDayGameSprint;
    let persentRightAnswer = Math.round(
      ((this.countRightAnswersSprint + this.countRightAnswersAudiobattle) /
        (this.countNumQuestionsSprint + this.countNumQuestionsAudiobattle)) *
        100
    );

    persentRightAnswer = !Number.isNaN(persentRightAnswer) ? persentRightAnswer : 0;

    const maxRightAnswers = Math.max(this.maxRightAnswersAudiobattle, this.maxRightAnswersSprint);

    const unicNotTodayWords = Array.from(
      new Set([...this.unicNotTodayWordsSprint, ...this.unicNotTodayWordsAudiobattle])
    );
    const unicTodayUseWords = Array.from(
      new Set([...this.unicTodayUseWordsAudiobattle, ...this.unicTodayUseWordsSprint])
    );
    const unicAllUseWords = new Set([...unicNotTodayWords, ...unicTodayUseWords]);
    const countNewTodayWords = Array.from(unicAllUseWords).length - unicNotTodayWords.length;
    return `
    <div class="statistic__section">
    <div class="statistic__section-container">
      <div class="statistic__block">
        <h2 class="statistic__title">Статистика</h2>
        <h3 class="statistic__subtitle">Общая статистика за день</h3>
        <div class="statistic__container">
          <div class="statistic__point-container">
            <span class="statistic__point-text">Количество сыгранных игр:</span
            ><span class="statistic__point-data">${countDayGame}</span>
          </div>
          <div class="statistic__point-container">
            <span class="statistic__point-text">Количество новых слов:</span
            ><span class="statistic__point-data">${countNewTodayWords}</span>
          </div>
          <div class="statistic__point-container">
            <span class="statistic__point-text">Процент правильных ответов:</span
            ><span class="statistic__point-data">${persentRightAnswer}</span>
          </div>
          <div class="statistic__point-container">
            <span class="statistic__point-text">Самая длинная серия правильных ответов:</span
            ><span class="statistic__point-data">${maxRightAnswers}</span>
          </div>
        </div>
      </div>
      <div class="statistic__block">
        <h3 class="statistic__subtitle">Статистика по играм</h3>
        <div class="statistic__game-block">
          <div class="statistic__container">
            ${this.drawGameStatistic(
              'Спринт',
              this.countDayGameSprint,
              this.countNewTodayWordsSprint,
              persentRightAnswerSprint,
              this.maxRightAnswersSprint
            )}
          </div>
          <div class="statistic__container">
            ${this.drawGameStatistic(
              'Аудиовызов',
              this.countDayGameAudiobattle,
              this.countNewTodayWordsAudiobattle,
              persentRightAnswerAudiobattle,
              this.maxRightAnswersAudiobattle
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
    `;
  }

  audiobattleStatistic() {
    this.countDayGameAudiobattle = 0;
    this.countNewTodayWordsAudiobattle = 0;
    this.maxRightAnswersAudiobattle = 0;
    this.countRightAnswersAudiobattle = 0;
    this.countNumQuestionsAudiobattle = 0;
    const statisticsData: IStatistic = JSON.parse(localStorage.getItem('statistics') || '{}');
    const now = new Date();
    const date = `${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear()}`;
    const todayStatistic = [];
    const allNotTodayWords = [];
    const todayUseWords = [];

    for (let i = 0; i < statisticsData.audiobattle.length; i += 1) {
      if (statisticsData.audiobattle[i].data !== date) {
        allNotTodayWords.push(...statisticsData.audiobattle[i].useWords);
      }
      if (statisticsData.audiobattle[i].data === date) {
        todayStatistic.push(statisticsData.audiobattle[i]);
        todayUseWords.push(...statisticsData.audiobattle[i].useWords);
      }
    }

    this.countDayGameAudiobattle = todayStatistic.length;

    for (let i = 0; i < todayStatistic.length; i += 1) {
      this.maxRightAnswersAudiobattle =
        todayStatistic[i].maxRightAnswers > this.maxRightAnswersAudiobattle
          ? todayStatistic[i].maxRightAnswers
          : this.maxRightAnswersAudiobattle;
      this.countRightAnswersAudiobattle += todayStatistic[i].countRightAnswers;
      this.countNumQuestionsAudiobattle += todayStatistic[i].countNumQuestions;
    }

    const unicNotTodayWords = new Set(allNotTodayWords);
    const unicTodayUseWords = new Set(todayUseWords);
    this.unicNotTodayWordsAudiobattle = Array.from(unicNotTodayWords);
    this.unicTodayUseWordsAudiobattle = Array.from(unicTodayUseWords);
    const unicAllUseWords = new Set([...this.unicNotTodayWordsAudiobattle, ...this.unicTodayUseWordsAudiobattle]);

    this.countNewTodayWordsAudiobattle = Array.from(unicAllUseWords).length - this.unicNotTodayWordsAudiobattle.length;
  }

  sprintStatistic() {
    this.countDayGameSprint = 0;
    this.countNewTodayWordsSprint = 0;
    this.maxRightAnswersSprint = 0;
    this.countRightAnswersSprint = 0;
    this.countNumQuestionsSprint = 0;
    const statisticsData: IStatistic = JSON.parse(localStorage.getItem('statistics') || '{}');
    const now = new Date();
    const date = `${now.getDate()}.${now.getMonth() + 1}.${now.getFullYear()}`;
    const todayStatistic = [];
    const allNotTodayWords = [];
    const todayUseWords = [];

    for (let i = 0; i < statisticsData.sprint.length; i += 1) {
      if (statisticsData.sprint[i].data !== date) {
        allNotTodayWords.push(...statisticsData.sprint[i].useWords);
      }
      if (statisticsData.sprint[i].data === date) {
        todayStatistic.push(statisticsData.sprint[i]);
        todayUseWords.push(...statisticsData.sprint[i].useWords);
      }
    }

    this.countDayGameSprint = todayStatistic.length;

    for (let i = 0; i < todayStatistic.length; i += 1) {
      this.maxRightAnswersSprint =
        todayStatistic[i].maxRightAnswers > this.maxRightAnswersSprint
          ? todayStatistic[i].maxRightAnswers
          : this.maxRightAnswersSprint;
      this.countRightAnswersSprint += todayStatistic[i].countRightAnswers;
      this.countNumQuestionsSprint += todayStatistic[i].countNumQuestions;
    }

    const unicNotTodayWords = new Set(allNotTodayWords);
    const unicTodayUseWords = new Set(todayUseWords);
    this.unicNotTodayWordsSprint = Array.from(unicNotTodayWords);
    this.unicTodayUseWordsSprint = Array.from(unicTodayUseWords);
    const unicAllUseWords = new Set([...this.unicNotTodayWordsSprint, ...this.unicTodayUseWordsSprint]);

    this.countNewTodayWordsSprint = Array.from(unicAllUseWords).length - this.unicNotTodayWordsSprint.length;
  }

  drawGameStatistic(
    gameName: string,
    countDayGame: number,
    countNewTodayWords: number,
    persentRightAnswer: number,
    maxRightAnswers: number
  ) {
    return `
      <h4 class="statistic__container-title">${gameName}</h4>
      <div class="statistic__point-container">
        <span class="statistic__point-text">Количество сыгранных игр:</span
        ><span class="statistic__point-data">${countDayGame}</span>
      </div>
      <div class="statistic__point-container">
        <span class="statistic__point-text">Количество новых слов:</span
        ><span class="statistic__point-data">${countNewTodayWords}</span>
      </div>
      <div class="statistic__point-container">
        <span class="statistic__point-text">Процент правильных ответов:</span
        ><span class="statistic__point-data">${persentRightAnswer}</span>
      </div>
      <div class="statistic__point-container">
        <span class="statistic__point-text">Самая длинная серия правильных ответов:</span
        ><span class="statistic__point-data">${maxRightAnswers}</span>
      </div>
  `;
  }
}

export default StatisticPage;
