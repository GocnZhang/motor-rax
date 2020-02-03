import { runApp, useAppLaunch } from 'rax-app';
import appConfig from './app.json';

useAppLaunch(function() {
  console.log(111);
})
runApp(appConfig)
