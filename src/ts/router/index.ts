import { RoutesActions, CallbackEmpty } from '../types';

class Router {
  static readonly ACTIVE_CLASSNAME = 'nav__link--active';

  routes: string[] = [];

  defaultRoute = '';

  currentRoute: string;

  param: string | undefined;

  routesActions: RoutesActions;

  callback: CallbackEmpty | undefined;

  constructor({ routesActions, callback }: { routesActions: RoutesActions; callback?: CallbackEmpty }) {
    this.routes = Object.keys(routesActions);
    const [firstRoute] = this.routes;
    this.defaultRoute = firstRoute;
    this.currentRoute = this.defaultRoute;
    this.routesActions = routesActions;
    this.callback = callback;
  }

  getPageAndParam = (pathStr: string) => {
    if (pathStr.includes('?')) {
      const [page, param] = pathStr.split('?');
      return { page, param };
    }

    return this.routes.includes(pathStr) ? { page: pathStr } : { page: this.defaultRoute };
  };

  getCurrentRoute = (): string => {
    return this.currentRoute;
  };

  switchRoute = () => {
    const url = window.location.href;
    const lastEl = url.split('#').pop();
    if (!lastEl) {
      return;
    }
    const { page, param } = this.getPageAndParam(lastEl);

    const navEl = document.querySelector(`.${Router.ACTIVE_CLASSNAME}`) as HTMLLinkElement;
    if (navEl) {
      navEl.classList.remove(Router.ACTIVE_CLASSNAME);
    }

    this.currentRoute = page;
    this.param = param;

    if (typeof this.callback === 'function') {
      this.callback();
    }

    this.routesActions[page]();
    const activeLinkEl = document.querySelector(`[href="#${page}"]`) as HTMLLinkElement;
    if (activeLinkEl) {
      activeLinkEl.classList.add(Router.ACTIVE_CLASSNAME);
    }
  };

  init() {
    // Listen on hash change:
    window.addEventListener('hashchange', this.switchRoute);
    // Listen on page load:
    window.addEventListener('load', this.switchRoute);
  }
}

export default Router;
