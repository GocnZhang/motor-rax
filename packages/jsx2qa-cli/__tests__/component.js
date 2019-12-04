const { readFileSync } = require('fs');
const { join } = require('path');
const { execSync } = require('child_process');

const compileCommand = '../bin/jsx2qa.js build --type component --entry ./component --turn-off-check-update';

let jsonContent, jsContent, cssContent, axmlContent;

const currentCwd = process.cwd();
const cwd = currentCwd.indexOf('jsx2qa-cli') === -1 ? join(currentCwd, 'packages/jsx2qa-cli') : currentCwd;

const execSyncWithCwd = (command) => {
  execSync(command, {
    cwd
  });
};

beforeAll(() => {
  execSyncWithCwd(`cd demo && npm install --no-package-lock && ${compileCommand}`);

  // read from file and get compiled result
  jsonContent = readFileSync(join(cwd, 'demo/dist/src/component.json'), {encoding: 'utf8'});
  jsContent = readFileSync(join(cwd, 'demo/dist/src/component.js'), {encoding: 'utf8'});
  cssContent = readFileSync(join(cwd, 'demo/dist/src/component.css'), {encoding: 'utf8'});
  axmlContent = readFileSync(join(cwd, 'demo/dist/src/component.ux'), {encoding: 'utf8'});
});

// afterAll(() => {
//   execSyncWithCwd('rm -rf demo/dist');
// });

describe('Component compiled result', () => {
  it('should return correct ux', () => {
    expect(axmlContent).toEqual(
      `<template>
    <block a:if="{{$ready}}"><view class="__rax-view my-view">
      Hello World!
      <rax-image source="{{ uri: _d0 }}" c="{{_d1 && _d2}}" d="{{_d0 ? _d1 : _d2}}" __tagId="0" /></view></block>
</template>
<script>
    "use strict";var _jsx2mpRuntime=require("./npm/jsx2mp-runtime"),_index=require("./npm/rax-view/lib/index.js"),img="./assets/rax.png",a=0,b=1;function Index(){(0,_index.custom)(),this._updateChildProps("0",{source:{uri:img},c:a&&b,d:img?a:b}),this._updateData({_d0:img,_d1:a,_d2:b}),this._updateMethods({})}var __def__=Index;Component((0,_jsx2mpRuntime.createComponent)(__def__));
</script>`);
  });

  it('should return correct js', () => {
    expect(jsContent).toEqual(
      '"use strict";var _jsx2mpRuntime=require("./npm/@ali/motor-jsx2mp-runtime"),_index=require("./npm/rax-view/lib/index.js"),img="./assets/rax.png",a=0,b=1;function Index(){(0,_index.custom)(),this._updateChildProps("0",{source:{uri:img},c:a&&b,d:img?a:b}),this._updateData({_d0:img,_d1:a,_d2:b}),this._updateMethods({})}var __def__=Index;Component((0,_jsx2mpRuntime.createComponent)(__def__));'
    );
  });

  it('should return correct css', () => {
    expect(cssContent).toEqual(
      '.my-view{color:red}'
    );
  });

  it('should return correct json', () => {
    expect(jsonContent).toEqual(
      `{
  "component": true,
  "usingComponents": {
    "rax-image": "./npm/rax-image/lib/miniapp/index"
  }
}
`
    );
  });
});
