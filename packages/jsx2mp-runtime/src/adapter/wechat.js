/* global wx */
import {
  COMPONENT_DID_MOUNT,
} from '../cycles';

export function redirectTo(options) {
  wx.redirectTo(options);
}

export function navigateTo(options) {
  wx.navigateTo(options);
}

export function navigateBack(options) {
  wx.navigateBack(options);
}

export function getComponentLifecycle({ mount, unmount }) {
  function attached() {
    return mount.apply(this, arguments);
  }

  function detached() {
    return unmount.apply(this, arguments);
  }

  return {
    lifetimes: {
      attached,
      detached,
    },
    // Keep compatibility to wx base library version < 2.2.3
    attached,
    detached,
  };
}

export function getPageLifecycle({ mount, unmount, show, hide }) {
  return {
    onLoad() {
      mount.apply(this, arguments);
    },
    onReady() {}, // noop
    onUnload() {
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
    properties: {
      TAGID: null,
      PARENTID: null,
    },
    options: {
      addGlobalClass: true,
    }
  };
}

export function attachEvent(isPage, config, proxiedMethods) {
  if (isPage) {
    Object.assign(config, proxiedMethods);
  } else {
    config.methods = proxiedMethods;
  }
}

export function updateData(data) {
  const setDataTask = [];
  let $ready = false;
  // In alibaba miniapp can use $spliceData optimize long list
  if (this._internal.$spliceData) {
    const useSpliceData = {};
    const useSetData = {};
    for (let key in data) {
      if (Array.isArray(data[key]) && diffArray(this.state[key], data[key])) {
        useSpliceData[key] = [this.state[key].length, 0].concat(data[key].slice(this.state[key].length));
      } else {
        if (diffData(this.state[key], data[key])) {
          useSetData[key] = data[key];
        }
      }
    }
    if (!isEmptyObj(useSetData)) {
      $ready = useSetData.$ready;
      setDataTask.push(new Promise(resolve => {
        this._internal.setData(useSetData, resolve);
      }));
    }
    if (!isEmptyObj(useSpliceData)) {
      setDataTask.push(new Promise(resolve => {
        this._internal.$spliceData(useSpliceData, resolve);
      }));
    }
  } else {
    setDataTask.push(new Promise(resolve => {
      $ready = data.$ready;
      this._internal.setData(data, resolve);
    }));
  }
  Promise.all(setDataTask).then(() => {
    if ($ready) {
      // trigger did mount
      this._trigger(COMPONENT_DID_MOUNT);
    }
    let callback;
    while (callback = this._pendingCallbacks.pop()) {
      callback();
    }
  });
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
