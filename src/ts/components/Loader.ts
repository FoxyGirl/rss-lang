import { APP_ID } from '../constants';

class Loader {
  draw() {
    const appEl = document.getElementById(APP_ID) as HTMLElement;

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
