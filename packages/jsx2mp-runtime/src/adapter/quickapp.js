/* global @system */
import router from '@system.router';
import {
  COMPONENT_DID_MOUNT,
} from '../cycles';

export function redirectTo(options) {
  options.uri = options.url;
  router.replace(options);
}

export function navigateTo(options) {
  options.uri = options.url;
  router.push(options);
}

export function navigateBack(options) {
  router.back();
}

export function getComponentLifecycle({ mount, unmount }) {
  return {
    onInit() {
      mount.apply(this, arguments);
    },
    onReady() {}, // noop
    onShow() {}, // noop
    onHide() {}, // noop
    onDestroy() {
      unmount.apply(this, arguments);
    },
  };
}

export function getPageLifecycle({ mount, unmount, show, hide }) {
  return {
    onInit() {
      mount.apply(this, arguments);
    },
    onReady() {}, // noop
    onDestroy() {
      unmount.apply(this, arguments);
    },
    onShow() {
      show.apply(this, arguments);
    },
    onHide() {
      hide.apply(this, arguments);
    }
  };
}

export function getComponentBaseConfig() {
  return {
    props: {},
  };
}

export function attachEvent(isPage, config, proxiedMethods) {
  Object.assign(config, proxiedMethods);
}

export function updateData(data) {
  let $ready = false;
  const useSetData = {};

  for (let key in data) {
    if (Array.isArray(data[key]) && diffArray(this.state[key], data[key])) {
      useSetData[key] = [this.state[key].length, 0].concat(data[key].slice(this.state[key].length));
    } else {
      if (diffData(this.state[key], data[key])) {
        useSetData[key] = data[key];
      }
    }
  }

  if (!isEmptyObj(useSetData)) {
    $ready = useSetData.$ready;
  }

  Object.keys(useSetData).map(item => {
    if (!(item in this._internal)) {
      this._internal.$set(item, useSetData[item])
    } else {
      this._internal[item] = useSetData[item]
    }
  });

  if ($ready) {
    // trigger did mount
    this._trigger(COMPONENT_DID_MOUNT);
  }
  let callback;
  while (callback = this._pendingCallbacks.pop()) {
    callback();
  }
}

function isEmptyObj(obj) {
  for (let key in obj) {
    return false;
  }
  return true;
}

function diffArray(prev, next) {
  if (!Array.isArray(prev)) return false;
  // Only concern about list append case
  if (next.length === 0) return false;
  if (prev.length === 0) return false;
  return next.slice(0, prev.length).every((val, index) => prev[index] === val);
}

function diffData(prevData, nextData) {
  const prevType = typeof prevData;
  const nextType = typeof nextData;
  if (prevType !== nextType) return true;
  if (prevType === 'object' && prevData !== null && nextData !== null) {
    const prevKeys = Object.keys(prevData);
    const nextKeys = Object.keys(nextData);
    if (prevKeys.length !== nextKeys.length) return true;
    if (prevKeys.length === 0) return false;
    return !prevKeys.every(key => prevData[key] === nextData[key] );
  } else {
    return prevData !== nextData;
  }
}
