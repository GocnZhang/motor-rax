/* global getCurrentPages, PROPS */
import router from '@system.router';
import { push, replace, go, goBack, canGo, goForward } from '../router';

let history;

export function createMiniAppHistory() {
  if (history) return history;
  return history = new MiniAppHistory();
}

export function getMiniAppHistory() {
  return history;
}

class MiniAppHistory {
  constructor() {
    this.location = new Location();

    // Apply actions for history.
    Object.assign(this, { push, replace, goBack, go, canGo, goForward });
  }

  get length() {
    return router.getLength();
  }
}

class Location {
  constructor() {
    this._currentPageOptions = {};
    this.hash = '';
  }

  __updatePageOption(pageOptions) {
    this._currentPageOptions = pageOptions;
  }

  get href() {
    return this.pathname + this.search;
  }

  get search() {
    let search = '';
    Object.keys(this._currentPageOptions).forEach((key, index) => {
      const query = `${key}=${this._currentPageOptions[key]}`;
      search += index === 0 ? '?' : '&';
      search += query;
    });
    return search;
  }

  get pathname() {
    const path = router.getState().path;
    return addLeadingSlash(path);
  }
}

function addLeadingSlash(str) {
  return str[0] === '/' ? str : '/' + str;
}
