import { APP_ID } from '../constants';

class Loader {
  draw(parentSelector = `#${APP_ID}`) {
    const appEl = document.querySelector(parentSelector) as HTMLElement;

    appEl.innerHTML = `
        <div class="loader">
            <div class="lds-roller">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div>
        `;
  }
}

export default Loader;
