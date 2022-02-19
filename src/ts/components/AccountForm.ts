import { CallbackEmpty, FormStrings, LocalStorageKeys } from '../types';

import api from '../api';

interface FormElements extends HTMLCollection {
  name: HTMLInputElement;
  email: HTMLInputElement;
  password: HTMLInputElement;
}

class AccountForm {
  isLogin = true;

  onHandleLoginSuccess: CallbackEmpty;

  constructor({ onHandleLoginSuccess }: { onHandleLoginSuccess: CallbackEmpty }) {
    this.onHandleLoginSuccess = onHandleLoginSuccess;
  }

  draw() {
    const bodyEl = document.body as HTMLElement;
    const formSectionEl = document.createElement('section');
    formSectionEl.classList.add('form');

    formSectionEl.innerHTML = `
        <div class="form__overlay">
            <div class="form__container">
            <button class="btn  btn--close">Close</button>
            <h3 class="form__title">${this.isLogin ? FormStrings.login : FormStrings.signup}</h3>
            <form action="" class="form__body" id="accountForm">
                ${
                  !this.isLogin
                    ? `
                  <div class="form__line">
                    <input type="text" name="name" placeholder="Имя" minLength="2" maxLength="25">
                    <div class="form__error"></div>
                  </div>
                  `
                    : ''
                }
                <div class="form__line">
                  <input type="email" name="email" placeholder="Email" >
                  <div class="form__error"></div>
                </div>
                <div class="form__line">
                  <input type="password" name="password" placeholder="Пароль" maxLength="25" >
                  <div class="form__error"></div>
                </div>
                <div class="form__line">
                  <label class="input__label">
                      <input type="checkbox" id="showPassword"> Показать пароль
                  </label>
                </div>
                <div class="form__line">
                  <div class="form__error" id="serverError"></div>
                </div>
                <button class="btn  btn--long  btn--submit">${
                  this.isLogin ? FormStrings.login : FormStrings.signup
                }</button>
            </form>
            ${
              this.isLogin
                ? `
              <p class="form__line form__line--last">
                  Нет аккаунта? <a href="" id="signupLink">${FormStrings.signup}</a>
              </p>
              `
                : `
              <p class="form__line form__line--last">
                Есть аккаунт? <a href="" id="loginLink">${FormStrings.login}</a>
              </p>
              `
            }
            </div>
        </div>
        `;

    bodyEl.appendChild(formSectionEl);
    (formSectionEl.querySelector('input') as HTMLInputElement).focus();

    const closeEl = document.querySelector('.btn--close') as HTMLButtonElement;
    closeEl.addEventListener('click', this.remove);

    const overlayEl = document.querySelector('.form__overlay') as HTMLButtonElement;
    overlayEl.addEventListener('click', (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.classList.contains('form__overlay')) {
        this.remove();
      }
    });

    const accountFormEl = document.querySelector('#accountForm') as HTMLFormElement;

    accountFormEl.addEventListener('keyup', (e: KeyboardEvent) => {
      if (e.key === 'Escape' || e.key === 'Esc') {
        this.remove();
      }
    });

    this.clean();

    const showPasswordEl = document.querySelector('#showPassword') as HTMLInputElement;
    const inputPasswordEl = accountFormEl.querySelector('[name="password"]') as HTMLInputElement;

    showPasswordEl.addEventListener('input', (e: Event) => {
      const target = e.target as HTMLInputElement;

      if (target.checked) {
        inputPasswordEl.type = 'text';
      } else {
        inputPasswordEl.type = 'password';
      }
    });

    accountFormEl.addEventListener('submit', async (e: Event) => {
      e.preventDefault();

      const errorsEl = document.querySelectorAll('.form__error') as NodeListOf<HTMLElement>;
      Array.from(errorsEl).forEach((item) => {
        /* eslint-disable no-param-reassign */
        item.textContent = '';
      });

      (document.querySelector('#serverError') as HTMLElement).textContent = '';

      if (!this.validate()) {
        return;
      }

      const { name, email, password } = accountFormEl.elements as FormElements;

      if (this.isLogin) {
        const emailVal = email.value.trim();
        const passwordVal = password.value.trim();

        try {
          const data = await api.signin({ email: emailVal, password: passwordVal });
          const { name: userName, token, refreshToken, userId } = data;
          localStorage.setItem(LocalStorageKeys.token, token);
          localStorage.setItem(LocalStorageKeys.refreshToken, refreshToken);
          localStorage.setItem(LocalStorageKeys.userId, userId);
          localStorage.setItem(LocalStorageKeys.userName, userName);

          this.onHandleLoginSuccess();
          this.remove();
        } catch (error) {
          console.error(error);
          const errorEl = document.querySelector('#serverError') as HTMLElement;
          errorEl.textContent = (error as Error).message;
        }
      } else {
        const nameVal = name.value;
        const emailVal = email.value;
        const passwordVal = password.value;

        try {
          // it returns only id, email, name
          await api.createUser({ name: nameVal, email: emailVal, password: passwordVal });
          const dataSignin = await api.signin({ email: emailVal, password: passwordVal });
          const { name: userName, token, refreshToken, userId } = dataSignin;
          localStorage.setItem(LocalStorageKeys.token, token);
          localStorage.setItem(LocalStorageKeys.refreshToken, refreshToken);
          localStorage.setItem(LocalStorageKeys.userId, userId);
          localStorage.setItem(LocalStorageKeys.userName, userName);
          this.onHandleLoginSuccess();
          this.remove();
        } catch (error) {
          console.error(`Error ${error}`);
          const errorEl = document.querySelector('#serverError') as HTMLElement;
          errorEl.textContent = (error as Error).message;
        }
      }
    });

    const signupLink = document.querySelector('#signupLink') as HTMLAnchorElement;
    signupLink?.addEventListener('click', this.handleSignup);

    const loginLink = document.querySelector('#loginLink') as HTMLAnchorElement;
    loginLink?.addEventListener('click', this.handleLogin);
  }

  validate() {
    const accountFormEl = document.querySelector('#accountForm') as HTMLFormElement;
    const inputs = accountFormEl.querySelectorAll('input');

    const validateErrors: HTMLInputElement[] = [];
    Array.from(inputs).forEach((input) => {
      if (input.name === 'name' && input.value.trim().length < 2) {
        const errorEl = input.closest('.form__line')?.querySelector('.form__error') as HTMLElement;
        errorEl.textContent = 'Минимальная длина имени 2 символа';

        validateErrors.push(input);
      }

      /* eslint-disable no-useless-escape */
      const emailRegExp = /^[\w-\.]+@[\w-]+\.[a-z]{2,4}$/i;
      if (input.name === 'email' && !emailRegExp.test(input.value)) {
        const errorEl = input.closest('.form__line')?.querySelector('.form__error') as HTMLElement;
        errorEl.textContent = 'Нужно ввести валидный email';

        validateErrors.push(input);
      }

      if (input.name === 'password' && input.value.trim().length < 8) {
        const errorEl = input.closest('.form__line')?.querySelector('.form__error') as HTMLElement;
        errorEl.textContent = 'Минимальная длина пароля 8 символов';

        validateErrors.push(input);
      }
    });

    if (validateErrors.length === 0) {
      return true;
    }

    validateErrors[0].focus();
    return false;
  }

  clean() {
    const accountFormEl = document.querySelector('#accountForm') as HTMLFormElement;
    const inputs = accountFormEl.querySelectorAll('input');
    Array.from(inputs).forEach((input) => {
      /* eslint-disable no-param-reassign */
      input.value = '';
    });
  }

  handleLogin = (e: Event) => {
    e.preventDefault();
    this.isLogin = true;
    this.reDraw();
  };

  handleSignup = (e: Event) => {
    e.preventDefault();
    this.isLogin = false;
    this.reDraw();
  };

  reDraw() {
    const formSectionEl = document.querySelector('.form') as HTMLElement;
    const formConatinerEL = document.querySelector('.form__container') as HTMLElement;
    formConatinerEL.style.left = '150%';

    setTimeout(() => {
      formSectionEl.remove();
      this.draw();
    }, 300);
  }

  remove() {
    const formSectionEl = document.querySelector('.form') as HTMLElement;
    const formConatinerEL = document.querySelector('.form__container') as HTMLElement;
    formConatinerEL.style.left = '150%';

    setTimeout(() => {
      formSectionEl.remove();
    }, 300);
  }
}

export default AccountForm;
