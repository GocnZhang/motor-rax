/* global my */

export function redirectTo(options) {
  my.redirectTo(options);
}

export function navigateTo(options) {
  my.navigateTo(options);
}

export function navigateBack(options) {
  my.navigateBack(options);
}

export function getComponentLifecycle({ mount, unmount }) {
  return {
    didMount() {
      mount.apply(this, arguments);
    },
    didUpdate() {}, // noop
    didUnmount() {
      unmount.apply(this, arguments);
    },
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
    props: {},
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
  // In alibaba miniapp can use $spliceData optimize long list
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
    this._internal.setData(useSetData);
  }
  if (!isEmptyObj(useSpliceData)) {
    this._internal.$spliceData(useSpliceData);
  }
}
