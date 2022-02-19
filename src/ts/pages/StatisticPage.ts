// import { IWord, IStatistic } from '../types';
// import api from '../api';
// import { API_URL, APP_ID, GROUP_PAGE_LIMIT, WORDS_PAGE_LIMIT } from '../constants';

class StatisticPage {
  draw() {
    return `
    <div class="statistic__section">
    <div class="statistic__section-container">
      <div class="statistic__block">
        <h2 class="statistic__title">Статистика</h2>
        <h3 class="statistic__subtitle">Общая статистика за день</h3>
        <div class="statistic__container">
          <div class="statistic__point-container">
            <span class="statistic__point-text">Количество сыгранных игр:</span
            ><span class="statistic__point-data">0</span>
          </div>
          <div class="statistic__point-container">
            <span class="statistic__point-text">Количество новых слов:</span
            ><span class="statistic__point-data">0</span>
          </div>
          <div class="statistic__point-container">
            <span class="statistic__point-text">Процент правильных ответов:</span
            ><span class="statistic__point-data">0</span>
          </div>
          <div class="statistic__point-container">
            <span class="statistic__point-text">Самая длинная серия правильных ответов:</span
            ><span class="statistic__point-data">0</span>
          </div>
        </div>
      </div>
      <div class="statistic__block">
        <h3 class="statistic__subtitle">Статистика по играм</h3>
        <div class="statistic__game-block">
          <div class="statistic__container">
            <h4 class="statistic__container-title">Спринт</h4>
            <div class="statistic__point-container">
              <span class="statistic__point-text">Количество сыгранных игр:</span
              ><span class="statistic__point-data">0</span>
            </div>
            <div class="statistic__point-container">
              <span class="statistic__point-text">Количество новых слов:</span
              ><span class="statistic__point-data">0</span>
            </div>
            <div class="statistic__point-container">
              <span class="statistic__point-text">Процент правильных ответов:</span
              ><span class="statistic__point-data">0</span>
            </div>
            <div class="statistic__point-container">
              <span class="statistic__point-text">Самая длинная серия правильных ответов:</span
              ><span class="statistic__point-data">0</span>
            </div>
          </div>
          <div class="statistic__container">
            <h4 class="statistic__container-title">Аудиовызов</h4>
            <div class="statistic__point-container">
              <span class="statistic__point-text">Количество сыгранных игр:</span
              ><span class="statistic__point-data">0</span>
            </div>
            <div class="statistic__point-container">
              <span class="statistic__point-text">Количество новых слов:</span
              ><span class="statistic__point-data">0</span>
            </div>
            <div class="statistic__point-container">
              <span class="statistic__point-text">Процент правильных ответов:</span
              ><span class="statistic__point-data">0</span>
            </div>
            <div class="statistic__point-container">
              <span class="statistic__point-text">Самая длинная серия правильных ответов:</span
              ><span class="statistic__point-data">0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
    `;
  }
}

export default StatisticPage;
