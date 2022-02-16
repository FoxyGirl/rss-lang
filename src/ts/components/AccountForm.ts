import { FormStrings } from '../types';

import api from '../api';

interface FormElements extends HTMLCollection {
  name: HTMLInputElement;
  email: HTMLInputElement;
  password: HTMLInputElement;
}

class AccountForm {
  isLogin = true;

  draw() {
    const bodyEl = document.body as HTMLElement;
    const formSectionEl = document.createElement('section');
    formSectionEl.classList.add('form');

    formSectionEl.innerHTML = `
        <div class="form__overlay">
            <div class="form__container">
            <h3 class="form__title">${this.isLogin ? FormStrings.Login : FormStrings.Signup}</h3>
            <form action="" class="form__body" id="accountForm">
                ${
                  !this.isLogin
                    ? `
                  <div class="form__line">
                    <input type="text" name="name" placeholder="Имя" required>
                    <div class="form__error"></div>
                  </div>
                  `
                    : ''
                }
                <div class="form__line">
                  <input type="email" name="email" placeholder="Email" required>
                  <div class="form__error"></div>
                </div>
                <div class="form__line">
                  <input type="password" name="password" placeholder="Пароль" required>
                  <div class="form__error"></div>
                </div>
                <div class="form__line">
                  <label class="input__label">
                      <input type="checkbox" id="showPassword"> Показать пароль
                  </label>
                </div>
                <button class="btn  btn--long  btn--submit">${
                  this.isLogin ? FormStrings.Login : FormStrings.Signup
                }</button>
            </form>
            ${
              this.isLogin
                ? `
              <p class="form__line form__line--last">
                  Нет аккаунта? <a href="" id="signupLink">${FormStrings.Signup}</a>
              </p>
              `
                : `
              <p class="form__line form__line--last">
                Есть аккаунт? <a href="" id="loginLink">${FormStrings.Login}</a>
              </p>
              `
            }
            </div>
        </div>
        `;

    bodyEl.appendChild(formSectionEl);

    const accountFormEl = document.querySelector('#accountForm') as HTMLFormElement;

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
      const elements = { ...accountFormEl.elements };
      console.log('>>>> elements', elements);
      // const email = elements.email;
      // const email = (accountFormEl.elements as FormElements).email;
      // const password = (accountFormEl.elements as FormElements).password;

      const { name, email, password } = accountFormEl.elements as FormElements;

      console.log('>>>> elements email', email);
      console.log('>>>> elements password', password);
      console.log('>>>> elements name', name);

      if (this.isLogin) {
        const emailVal = email.value;
        const passwordVal = password.value;

        console.log('call login API');
        const data = await api.signin({ email: emailVal, password: passwordVal });
        console.log('data', data);
      } else {
        const nameVal = name.value;
        const emailVal = email.value;
        const passwordVal = password.value;

        console.log('call Signup API');
        const data = await api.createUser({ name: nameVal, email: emailVal, password: passwordVal });
        console.log('data', data);
      }
    });

    // email: "12@tut.by"
    // id: "620c1f871c13c90016557a4c"
    // name: "Елена"

    // const btnSubmit = document.querySelector('.btn--submit') as HTMLButtonElement;

    // btnSubmit.addEventListener('click', (e: Event) => {
    //   console.log('Submit');
    //   e.preventDefault();
    //   const formConatinerEL = document.querySelector('.form__container') as HTMLElement;
    //   formConatinerEL.style.left = '150%';

    //   setTimeout(() => {
    //     formSectionEl.remove();
    //   }, 300);
    // });

    const signupLink = document.querySelector('#signupLink') as HTMLAnchorElement;

    signupLink?.addEventListener('click', (e: Event) => {
      e.preventDefault();
      console.log('SIGNUP !!');
      this.isLogin = false;

      const formConatinerEL = document.querySelector('.form__container') as HTMLElement;
      formConatinerEL.style.left = '150%';

      setTimeout(() => {
        formSectionEl.remove();
        this.draw();
      }, 300);
    });

    const loginLink = document.querySelector('#loginLink') as HTMLAnchorElement;
    loginLink?.addEventListener('click', (e: Event) => {
      e.preventDefault();
      console.log('LOGIN !!');
      this.isLogin = true;

      const formConatinerEL = document.querySelector('.form__container') as HTMLElement;
      formConatinerEL.style.left = '150%';

      setTimeout(() => {
        formSectionEl.remove();
        this.draw();
      }, 300);
    });
  }
}

export default AccountForm;
