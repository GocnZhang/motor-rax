const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path')
const { downloadGithubRepoLatestRelease } = require('./utils/quickapp');
const spinner = require('./utils/spinner');
const { unzip } = require('./utils/file');
const defaultManifestJSON = require('./utils/defaultManifest.json');

function generateQuickAppManifest (options) {
  const quickappJSON = defaultManifestJSON;
  const { distDirectory, workDirectory } = options;
  let router = {};
  let display = {};
  if (fs.existsSync(path.join(distDirectory, '/src/app.json'))) {
    // 生成 router
    const appConfig = fs.readJSONSync(path.join(distDirectory, '/src/app.json'));
    const pages = appConfig.pages || [];
    const routerPages = {};
    pages.forEach(element => {
      const pageConf = {
        component: path.basename(element)
      };
      routerPages[path.dirname(element)] = pageConf;
    });
    const routerEntry = pages.shift();
    router = {
      entry: path.dirname(routerEntry),
      pages: routerPages
    };

    // 生成 display
    const display = JSON.parse(JSON.stringify(appConfig.window || {}));
    display.pages = {};

    if (appConfig.window && appConfig.window.defaultTitle) {
      quickappJSON.name = appConfig.window.defaultTitle;
    }

    quickappJSON.router = router;
    quickappJSON.display = display;

    // 合并app.json里的config
    Object.assign(quickappJSON, appConfig.config)

    fs.writeFileSync(path.join(distDirectory, '/src/manifest.json'), JSON.stringify(quickappJSON, null, 2))
  }

  // 移除快应用下的app.js / app.config.json / app.json
  if (fs.existsSync(path.join(distDirectory, '/src/app.js'))) {
    fs.removeSync(path.join(distDirectory, '/src/app.js'));
  }
  if (fs.existsSync(path.join(distDirectory, '/src/app.json'))) {
    fs.removeSync(path.join(distDirectory, '/src/app.json'));
  }
  if (fs.existsSync(path.join(distDirectory, '/src/app.config.js'))) {
    fs.removeSync(path.join(distDirectory, '/src/app.config.js'));
  }

  // 如果存在app.ux文件则平移
  if (fs.existsSync(path.join(workDirectory, '/src/app.ux'))) {
    fs.copySync(path.join(workDirectory, '/src/app.ux'), path.join(distDirectory, '/src/app.ux'));
  }
}

async function prepareQuickAppEnvironment (workDirectory, distDirectory) {
  let isReady = false;
  let needDownload = false;
  if (fs.existsSync(path.join(distDirectory, 'sign'))) {
    needDownload = false;
  } else {
    needDownload = true;
  }
  if (needDownload) {
    spinner.start('开始下载快应用运行容器...');
    if (!fs.existsSync(path.join(distDirectory, 'download_temp.zip'))) {
      await downloadGithubRepoLatestRelease('alijk-fe/quickapp-container', workDirectory, distDirectory);
    }
    await unzip(path.join(distDirectory, 'download_temp.zip'));
    spinner.succeed('快应用运行容器下载完成');
  } else {
    console.log(`${chalk.green('✔ ')} 快应用容器已经准备好`);
  }
  isReady = true;
  return isReady;
}

module.exports = async (options = {}) => {
  let { entryPath, type, workDirectory, distDirectory, mode, constantDir, disableCopyNpm } = options;
  generateQuickAppManifest(options);
  const isReady = await prepareQuickAppEnvironment(workDirectory, distDirectory);
  if (!isReady) {
    console.log();
    console.log(chalk.red('快应用环境准备失败，请重试！'))
    process.exit(0);
    return;
  } else {
    console.log('\nWatching file changes...');
  }
}
