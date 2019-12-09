const updateNotifier = require('update-notifier');

const jsx2qaCliPkg = require('./package.json');
const jsx2qaLoaderPkg = require('@ali/jsx2qa-loader/package.json');
// eslint-disable-next-line
const jsx2qaCompilerPkg = require('@ali/jsx2qa-compiler/package.json');
const jsx2qaRuntimePkg = require('@ali/motor-jsx2mp-runtime/package.json');

const pkgVersion = [
  jsx2qaCliPkg,
  jsx2qaLoaderPkg,
  jsx2qaCompilerPkg,
  jsx2qaRuntimePkg
];

let needUpdate = false;

pkgVersion.forEach(pkg => {
  const notifier = updateNotifier({
    pkg,
    updateCheckInterval: 1000 * 60 * 60 * 24 * 7 // 1 week
  });
  if (notifier.update) {
    needUpdate = true;
  }
});

module.exports = needUpdate;
