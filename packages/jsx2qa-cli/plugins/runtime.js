const { join } = require('path');
const { copySync, writeFileSync, readJSONSync, readFileSync } = require('fs-extra');
const { minify } = require('terser');

/**
 * Runtime packages should be a dependency of jsx2qa-cli,
 * for convenient to copy vendors.
 */
const runtime = '@ali/motor-jsx2mp-runtime';
const runtimePackageJSONPath = require.resolve(join(runtime, 'package.json'));
const runtimePackageJSON = readJSONSync(runtimePackageJSONPath);
const runtimePackagePath = join(runtimePackageJSONPath, '..');

module.exports = class JSX2MPRuntimePlugin {
  constructor({ platform = 'ali', mode = 'build' }) {
    this.platform = platform;
    this.mode = mode;
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      'JSX2MPRuntimePlugin',
      (compilation, callback) => {
        const runtimeTargetPath = runtimePackageJSON.miniprogram && runtimePackageJSON.miniprogram[this.platform]
          ? runtimePackageJSON.miniprogram[this.platform]
          : runtimePackageJSON.main || 'index.js';
        const sourceFile = require.resolve(join(runtimePackagePath, runtimeTargetPath));
        const targetFile = join(compiler.outputPath, 'npm/jsx2mp-runtime.js');

        if (this.mode === 'build') {
          const sourceCode = minify(readFileSync(sourceFile, 'utf-8')).code;
          try {
            writeFileSync(targetFile, sourceCode);
          } catch (error) {
            console.log('runtime writeFileSync error', error);
            callback();
          }
        } else {
          copySync(sourceFile, targetFile);
        }
        callback();
      }
    );
  }
};
