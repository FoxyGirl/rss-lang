import { APP_ID } from '../constants';

class HomePage {
  draw() {
    const appEl = document.getElementById(APP_ID) as HTMLElement;
    appEl.innerHTML = `
        <section class="description">
          <h1 class="description__title">RSLang - удобное приложение для изучения английского языка!</h1>
          <p class="description__text">Приложение для эффективного изучения иностранных слов в игровой форме.</p>
          <p class="description__text">Включает в себя учебник и две мини-игры, которые сделают процесс изучения более интересным.</p>
          <p class="description__text">Кроме того, для зарегистрированных пользователей есть возможность посмотреть статистику о своём процессе изучения.</p>
        </section>
        <section class="description  team">
          <h2 class="description__title">О команде</h2>
          <div class="team__item">
            <h3 class="description__subtitle">Елена Павлова <span>team lead, developer</span></h3>
            <p class="description__text">Координировала работу команды. Разработала архитектуру приложения. Сделала учебник.</p>
          </div>
          <div class="team__item">
            <h3 class="description__subtitle">Алексей Сталин <span>developer</span></h3>
            <p class="description__text">Разработал игры "Спринт" и " Аудиовызов".</p>
          </div>
        </section> 
        `;
  }
}

export default HomePage;
