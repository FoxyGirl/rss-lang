import { APP_ID } from '../constants';

class HomePage {
  draw() {
    const appEl = document.getElementById(APP_ID) as HTMLElement;
    appEl.innerHTML = `
    <div class="description-page__container">
    <section class="description">
      <h1 class="description__title">RSLang - удобное приложение для изучения английского языка!</h1>
      <p class="description__text">Приложение для эффективного изучения иностранных слов в игровой форме.</p>
      <p class="description__text">Включает в себя учебник и две мини-игры, которые сделают процесс изучения более интересным.</p>
      <p class="description__text">Кроме того, для зарегистрированных пользователей есть возможность посмотреть статистику о своём процессе изучения.</p>
    </section>
    <section class="description team">
      <div class="description__container">
        <h2 class="description__title">О команде</h2>
        <div class="team__item">
          <div class="team__photo elena"></div>
          <div class="team__description">
            <h3 class="description__subtitle">Елена Павлова <span>team lead, developer</span></h3>
            <p class="description__text">Координировала работу команды. Разработала архитектуру приложения. Сделала учебник. Сделала базовые настройки проекта, начальную компоновку, настройку роутера, форму входа.</p>
            <a class="description__link" href="https://github.com/FoxyGirl" target="_blank" >FoxyGirl</a>
          </div>
        </div>
        <div class="team__item">
          <div class="team__photo alexi"></div>
          <div class="team__description">
            <h3 class="description__subtitle">Алексей Гурбан <span>developer</span></h3>
            <p class="description__text">Разработал игры "Спринт" и " Аудиовызов". Cделал сохранение результатов игр на сервер и страницу статистики</p>
            <a class="description__link" href="https://github.com/alexiStalin" target="_blank">alixiStalin</a>
          </div>
        </div>
      </div>
    </section> 
  </div>`;
  }
}

export default HomePage;
