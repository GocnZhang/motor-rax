const chalk = require('chalk');
const fs = require('fs-extra');
const path = require('path')
const { downloadGithubRepoLatestRelease } = require('./utils/quickapp');
const spinner = require('./utils/spinner');
const { unzip } = require('./utils/file');

function generateQuickAppManifest() {

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
    await downloadGithubRepoLatestRelease('alijk-fe/quickapp-container', workDirectory, distDirectory);
    await unzip(path.join(distDirectory, 'download_temp.zip'));
    spinner.succeed('快应用运行容器下载完成');
  } else {
    console.log(`${chalk.green('✔ ')} 快应用容器已经准备好`);
  }
  // process.chdir(distDirectory)
}

module.exports = async (options = {}) => {
  let { entryPath, type, workDirectory, distDirectory, mode, constantDir, disableCopyNpm } = options;
  generateQuickAppManifest();
  const isReady = await prepareQuickAppEnvironment(workDirectory, distDirectory);
  if (!isReady) {
    console.log();
    console.log(chalk.red('快应用环境准备失败，请重试！'))
    process.exit(0);
    return;
  }
}
