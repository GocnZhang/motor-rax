const { writeJSONSync, writeFileSync, existsSync, mkdirpSync } = require('fs-extra');
const { extname, dirname, join, relative } = require('path');
const { transformSync } = require('@babel/core');
const { minify, minifyJS, minifyCSS, minifyXML } = require('./utils/minifyCode');
const addSourceMap = require('./utils/addSourceMap');

function transformCode(rawContent, mode, externalPlugins = [], externalPreset = []) {
  const presets = [].concat(externalPreset);
  const plugins = externalPlugins.concat([
    require('@babel/plugin-proposal-export-default-from'), // for support of export defualt
    [
      require('babel-plugin-transform-define'),
      {
        'process.env.NODE_ENV': mode === 'build' ? 'production' : 'development',
      }
    ],
    [
      require('babel-plugin-minify-dead-code-elimination'),
      {
        optimizeRawSize: true,
        keepFnName: true
      }
    ],
  ]);


  const babelParserOption = {
    plugins: [
      'classProperties',
      'jsx',
      'flow',
      'flowComment',
      'trailingFunctionCommas',
      'asyncFunctions',
      'exponentiationOperator',
      'asyncGenerators',
      'objectRestSpread',
      ['decorators', { decoratorsBeforeExport: false }],
      'dynamicImport',
    ], // support all plugins
  };

  return transformSync(rawContent, {
    presets,
    plugins,
    parserOpts: babelParserOption
  });
}

/**
 * Process and write file
 * @param {object} content Compiled result
 * @param {string} raw Original file content
 * @param {object} options
 */
function output(content, raw, options) {
  const { mode, outputPath, externalPlugins = [], type } = options;
  let { code, config, json, css, map, template, assets, renderItems = [], importComponents = [] } = content;
  if (mode === 'build') {
    // Compile ES6 => ES5 and minify code
    code = minifyJS(transformCode(code,
      mode,
      externalPlugins.concat([require('@babel/plugin-proposal-class-properties')]),
      [require('@babel/preset-env')]
    ).code);
    if (config) {
      // Compile ES6 => ES5 and minify code
      config = minifyJS(transformCode(config,
        mode,
        externalPlugins.concat([require('@babel/plugin-proposal-class-properties')]),
        [require('@babel/preset-env')]
      ).code);
    }
    if (css) {
      css = minifyCSS(css);
    }
    if (template) {
      template = minifyXML(template);
    }
  } else {
    code = transformCode(code, mode, externalPlugins).code;
    // Add source map
    if (map) {
      code = addSourceMap(code, raw, map);
    }
  }
  if(type === 'app') {
    code = `<script>\n${code}\n</script>\n`;
  }
  // Write file
  writeFileWithDirCheck(outputPath.code, code);

  // Write ux components
  // if (renderItems && renderItems.length) {
  //   const renderItemRoot = outputPath.template.split('/').slice(0, -1).join('/');
  //   for (let i in renderItems) {
  //     const item = renderItems[i];
  //     Object.keys(item).forEach(fileName => {
  //       writeFileSync(`${renderItemRoot}/${fileName}.ux`, item[fileName]);
  //     });
  //   }
  // }
  if (json) {
    writeFileWithDirCheck(outputPath.json, json, 'json');
  }
  let uxTxt = '';
  if (template) {
    if (importComponents && importComponents.length) {
      uxTxt += importComponents.join('\n') + '\n';
    }
    uxTxt += `${template}\n`;
    if (code) {
      uxTxt += `<script>\n${code}\n</script>\n`
    }
    if (css && outputPath.css) {
      uxTxt += `<style src="./${relative(dirname(outputPath.template), outputPath.css)}"></style>\n`
    }
    writeFileWithDirCheck(outputPath.template, uxTxt);
  }
  if (css) {
    // 添加默认样式，并修改rpx为px
    writeFileWithDirCheck(outputPath.css, `
.__rax-view {
  border: 0 solid black;
  display:flex;
  flex-direction:column;
  align-content:flex-start;
  flex-shrink:0;
  box-sizing:border-box;
}
${css.replace(/rpx/g, 'px')}`);
  }
  if (config) {
    writeFileWithDirCheck(outputPath.config, config);
  }

  // Write extra assets
  if (assets) {
    Object.keys(assets).forEach((asset) => {
      const ext = extname(asset);
      let content = assets[asset];
      // css in js 生成的js文件中的rpx单位转化
      content = content.replace(/rpx/g, 'px');
      if (mode === 'build') {
        content = minify(content, ext);
      }
      const assetsOutputPath = join(outputPath.assets, asset);
      writeFileWithDirCheck(assetsOutputPath, content);
    });
  }
}


/**
 * mkdir before write file if dir does not exist
 * @param {string} filePath
 * @param {string|Buffer|TypedArray|DataView} content
 * @param {string}  [type=file] 'file' or 'json'
 */
function writeFileWithDirCheck(filePath, content, type = 'file') {
  const dirPath = dirname(filePath);
  if (!existsSync(dirPath)) {
    mkdirpSync(dirPath);
  }
  if (type === 'file') {
    writeFileSync(filePath, content);
  } else if (type === 'json') {
    writeJSONSync(filePath, content, { spaces: 2 });
  }
}

module.exports = output;
