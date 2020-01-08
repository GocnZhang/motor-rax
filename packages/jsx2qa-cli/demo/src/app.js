import { runApp, useAppLaunch } from 'rax-app';
import appConfig from './app.json';

runApp(appConfig);
useAppLaunch(() => {
  console.log('app launch')
})