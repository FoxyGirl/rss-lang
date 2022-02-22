import { APP_ID } from '../constants';
import api from '../api';
import { getCurrentDate, reLogin } from '../utils';

class StatisticPage {
  countDayGameSprint: number;

  countNewTodayWordsSprint: number;

  maxRightAnswersSprint: number;

  countRightAnswersSprint: number;

  persentRightAnswerSprint: number;

  countNumQuestionsSprint: number;

  unicNotTodayWordsSprint: string[];

  unicTodayUseWordsSprint: string[];

  countDayGameAudiobattle: number;

  countNewTodayWordsAudiobattle: number;

  maxRightAnswersAudiobattle: number;

  countRightAnswersAudiobattle: number;

  persentRightAnswerAudiobattle: number;

  countNumQuestionsAudiobattle: number;

  unicNotTodayWordsAudiobattle: string[];

  unicTodayUseWordsAudiobattle: string[];

  countDayGame: number;

  countNewTodayWords: number;

  maxRightAnswers: number;

  persentRightAnswer: number;

  constructor() {
    this.countDayGameSprint = 0;
    this.countNewTodayWordsSprint = 0;
    this.maxRightAnswersSprint = 0;
    this.persentRightAnswerSprint = 0;
    this.countRightAnswersSprint = 0;
    this.countNumQuestionsSprint = 0;
    this.unicNotTodayWordsSprint = [];
    this.unicTodayUseWordsSprint = [];

    this.countDayGameAudiobattle = 0;
    this.countNewTodayWordsAudiobattle = 0;
    this.maxRightAnswersAudiobattle = 0;
    this.persentRightAnswerAudiobattle = 0;
    this.countRightAnswersAudiobattle = 0;
    this.countNumQuestionsAudiobattle = 0;
    this.unicNotTodayWordsAudiobattle = [];
    this.unicTodayUseWordsAudiobattle = [];

    this.countDayGame = 0;
    this.countNewTodayWords = 0;
    this.maxRightAnswers = 0;
    this.persentRightAnswer = 0;
  }

  async getStatistic() {
    await this.audiobattleStatistic();
    await this.sprintStatistic();
    this.persentRightAnswerSprint = !Number.isNaN(
      Math.round(this.countRightAnswersSprint / this.countNumQuestionsSprint)
    )
      ? Math.round((this.countRightAnswersSprint / this.countNumQuestionsSprint) * 100)
      : 0;
    this.persentRightAnswerAudiobattle = !Number.isNaN(
      Math.round(this.countRightAnswersAudiobattle / this.countNumQuestionsAudiobattle)
    )
      ? Math.round((this.countRightAnswersAudiobattle / this.countNumQuestionsAudiobattle) * 100)
      : 0;

    this.countDayGame = this.countDayGameAudiobattle + this.countDayGameSprint;
    this.persentRightAnswer = Math.round(
      ((this.countRightAnswersSprint + this.countRightAnswersAudiobattle) /
        (this.countNumQuestionsSprint + this.countNumQuestionsAudiobattle)) *
        100
    );

    this.persentRightAnswer = !Number.isNaN(this.persentRightAnswer) ? this.persentRightAnswer : 0;

    this.maxRightAnswers = Math.max(this.maxRightAnswersAudiobattle, this.maxRightAnswersSprint);

    const unicNotTodayWords = Array.from(
      new Set([...this.unicNotTodayWordsSprint, ...this.unicNotTodayWordsAudiobattle])
    );
    const unicTodayUseWords = Array.from(
      new Set([...this.unicTodayUseWordsAudiobattle, ...this.unicTodayUseWordsSprint])
    );
    const unicAllUseWords = new Set([...unicNotTodayWords, ...unicTodayUseWords]);
    this.countNewTodayWords = Array.from(unicAllUseWords).length - unicNotTodayWords.length;
    const appEl = document.getElementById(APP_ID) as HTMLElement;
    appEl.innerHTML = this.drawStatistic();
  }

  drawStatistic() {
    return `
    <div class="statistic__section">
    <div class="statistic__section-container">
      <div class="statistic__block">
        <h2 class="statistic__title">Статистика</h2>
        <h3 class="statistic__subtitle">Общая статистика за день</h3>
        <div class="statistic__container">
          <div class="statistic__point-container">
            <span class="statistic__point-text">Количество сыгранных игр:</span
            ><span class="statistic__point-data">${this.countDayGame}</span>
          </div>
          <div class="statistic__point-container">
            <span class="statistic__point-text">Количество новых слов:</span
            ><span class="statistic__point-data">${this.countNewTodayWords}</span>
          </div>
          <div class="statistic__point-container">
            <span class="statistic__point-text">Процент правильных ответов:</span
            ><span class="statistic__point-data">${this.persentRightAnswer}</span>
          </div>
          <div class="statistic__point-container">
            <span class="statistic__point-text">Самая длинная серия правильных ответов:</span
            ><span class="statistic__point-data">${this.maxRightAnswers}</span>
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
              this.persentRightAnswerSprint,
              this.maxRightAnswersSprint
            )}
          </div>
          <div class="statistic__container">
            ${this.drawGameStatistic(
              'Аудиовызов',
              this.countDayGameAudiobattle,
              this.countNewTodayWordsAudiobattle,
              this.persentRightAnswerAudiobattle,
              this.maxRightAnswersAudiobattle
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
    `;
  }

  async audiobattleStatistic() {
    this.countDayGameAudiobattle = 0;
    this.countNewTodayWordsAudiobattle = 0;
    this.maxRightAnswersAudiobattle = 0;
    this.countRightAnswersAudiobattle = 0;
    this.countNumQuestionsAudiobattle = 0;

    try {
      const statisticSerw = await api.getUserStatistics();
      const date = getCurrentDate();
      const todayStatistic = [];
      const allNotTodayWords = [];
      const todayUseWords = [];

      for (let i = 0; i < statisticSerw.optional.statistics.audio.length; i += 1) {
        if (statisticSerw.optional.statistics.audio[i].date !== date) {
          allNotTodayWords.push(...statisticSerw.optional.statistics.audio[i].useWords);
        }

        if (statisticSerw.optional.statistics.audio[i].date === date) {
          todayStatistic.push(statisticSerw.optional.statistics.audio[i]);
          todayUseWords.push(...statisticSerw.optional.statistics.audio[i].useWords);
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

      this.countNewTodayWordsAudiobattle =
        Array.from(unicAllUseWords).length - this.unicNotTodayWordsAudiobattle.length;
    } catch (error) {
      reLogin(error as Error);
    }
  }

  async sprintStatistic() {
    this.countDayGameSprint = 0;
    this.countNewTodayWordsSprint = 0;
    this.maxRightAnswersSprint = 0;
    this.countRightAnswersSprint = 0;
    this.countNumQuestionsSprint = 0;

    const statisticSerw = await api.getUserStatistics();

    const date = getCurrentDate();
    const todayStatistic = [];
    const allNotTodayWords = [];
    const todayUseWords = [];

    for (let i = 0; i < statisticSerw.optional.statistics.sprint.length; i += 1) {
      if (statisticSerw.optional.statistics.sprint[i].date !== date) {
        allNotTodayWords.push(...statisticSerw.optional.statistics.sprint[i].useWords);
      }

      if (statisticSerw.optional.statistics.sprint[i].date === date) {
        todayStatistic.push(statisticSerw.optional.statistics.sprint[i]);
        todayUseWords.push(...statisticSerw.optional.statistics.sprint[i].useWords);
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

  drawNoAutorization() {
    return `
    <div class="statistic__section">
      <div class="statistic__section-container">
        <h2 lass="statistic__title" >Статистика доступна только для авторизированных пользователей<h2/>
      <div/>
    <div/>
    `;
  }
}

export default StatisticPage;
