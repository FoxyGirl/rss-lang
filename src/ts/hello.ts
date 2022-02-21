const description = `
1) Стартовая страница и навигация +20
[x] вёрстка, дизайн, UI стартовой страницы приложения +10
[x] реализована навигация по страницам приложения +10

2) Настройки +15/40
[x] в настройках есть возможность включать/выключать звук, есть регулятор громкости звука. Если звук включён, есть звуковая индикация разная для правильных и неправильных ответов, звуковое сопровождение окончания раунда +10
[ ] в настройках есть возможность включать/выключать игру на время 0
[ ] в настройках можно указать время для ответа на вопрос 0
[±] при перезагрузке страницы приложения выбранные настройки сохраняются +5/10

3) Страница категорий +30
[x] вёрстка, дизайн, UI страницы категории +10
[x] карточка сыгранной категории внешне отличается от карточки категории, которая ещё не игралась +10
[x] на карточке сыгранной категории отображается результат прохождения раунда - количество вопросов, на которые был дан правильный ответ +10

4) Страница с вопросами +50
[x] вёрстка, дизайн, UI страницы с вопросами +10
[x] варианты ответов на вопросы генерируются случайным образом +10
[x] правильным и неправильным ответам пользователя соответствуют индикаторы разного цвета +10
[x] после того, как ответ выбран, появляется модальное окно с правильным ответом на вопрос и кнопкой "Продолжить". При клике по кнопке "Продолжить" пользователь переходит к следующему вопросу категории +10
[x] после окончания раунда выводится уведомление об окончании раунда и его результат - количество вопросов, на которые был дан правильный ответ.

5) Страница с результатами +50
[x] вёрстка, дизайн, UI страницы с результатами. Выполняются требования к вёрстке и оформлению приложения +10
[x] страница с результатами содержит превью всех картин категории +10
[x] картины, на вопросы про которые или про их авторов был дан правильный ответ, цветные; картины, на вопросы про которые или про их авторов был дан неправильный ответ, черно-белые +10
[x] при клике по картине выводится информация о ней - название, автор, год создания +10
[x] если раунд переигрывался, и результаты изменились, эти изменения отображаются на странице с результатами +10

6) Плавная смена изображений; картинки сначала загружаются, потом отображаются; нет ситуации, когда пользователь видит частично загрузившиеся изображения 0
7) Реализована анимация отдельных деталей интерфейса, также анимированы переходы и взаимодействия, чтобы работа с приложением шла плавным и непрерывным потоком 0
8) Реализована анимация отдельных деталей интерфейса, также анимированы переходы и взаимодействия, чтобы работа с приложением шла плавным и непрерывным потоком 0
`;
console.log('%c%s', 'color: blue', 'Самооценка Score: 165 / 220');
console.log(description);
