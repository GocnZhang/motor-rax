/* global @system */
import router from '@system.router';

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
  Object.keys(data).map(item => {
    if (!(item in this._internal)) {
      this._internal.$set(item, data[item])
    } else {
      this._internal[item] = data[item]
    }
  })
}
