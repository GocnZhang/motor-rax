const { join, relative, dirname } = require('path');

const ADAPTER_REPLACER = '@@ADAPTER@@';
const adapterPath = join(__dirname, '../src/adapter');

const HISTORY_REPLACER = '@@HISTORY@@';
const historyPath = join(__dirname, '../src/history');

const GETID_REPLACER = '@@GETID@@';
const getIdPath = join(__dirname, '../src/getId');

module.exports = function({ types: t }, { platform = 'ali' }) {
  const targetAdapterFilename = join(adapterPath, platform);
  const historyFilename = platform === 'quickapp' ? join(historyPath, platform) : join(__dirname, '../src/history/miniapp');
  const getIdFilename = platform === 'quickapp' ? join(getIdPath, platform) : join(__dirname, '../src/getId/miniapp');

  return {
    name: 'import-adapter-replace-plugin',
    visitor: {
      StringLiteral(path, { filename }) {
        const { node } = path;
        if (node.value === ADAPTER_REPLACER) {
          let rel = relative(dirname(filename), targetAdapterFilename);
          if (rel[0] !== '.') rel = './' + rel; // add `./` prefix for relative filename.

          path.replaceWith(t.stringLiteral(rel));
        } else if (node.value === HISTORY_REPLACER) {
          let rel = relative(dirname(filename), historyFilename);
          if (rel[0] !== '.') rel = './' + rel; // add `./` prefix for relative filename.

          path.replaceWith(t.stringLiteral(rel));
        } else if (node.value === GETID_REPLACER) {
          let rel = relative(dirname(filename), getIdFilename);
          if (rel[0] !== '.') rel = './' + rel; // add `./` prefix for relative filename.

          path.replaceWith(t.stringLiteral(rel));
        }
      },
    }
  };
};
