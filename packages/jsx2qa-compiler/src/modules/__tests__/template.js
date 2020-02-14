const t = require('@babel/types');
const { _transformTemplate, _transformComTemplate } = require('../template');
const { parseCode } = require('../../parser');
const getDefaultExportedPath = require('../../utils/getDefaultExportedPath');
const genExpression = require('../../codegen/genExpression');

const code = `
import { createElement, Component } from 'rax';
import View from 'rax-view';
import Image from 'rax-image';

export default class Logo extends Component{
  render() {
    return (
      <View>
        <Image
          ref="hello"
          style={styles.logo}
          onClick={this.mathRodom.bind(this)}
          source={{
            uri: '//gw.alicdn.com/tfs/TB1MRC_cvb2gK0jSZK9XXaEgFXa-1701-1535.png',
          }}
        />
        <Text>hello world</Text>
      </View>
    );
  }
};`;
const functionCode = `
    import { createElement, Component } from 'rax';
    export default () => {
      return (
        <View>
          <Image
            ref="hello"
            style={styles.logo}
            onClick={this.mathRodom.bind(this)}
            source={{
              uri: '//gw.alicdn.com/tfs/TB1MRC_cvb2gK0jSZK9XXaEgFXa-1701-1535.png',
            }}
          />
          <Text>hello world</Text>
        </View>
      );
    };`;

describe('Transform template', () => {
  it('templateAST add template tag in class component', () => {
    const ast = parseCode(code);
    const defaultExportedPath = getDefaultExportedPath(ast, code);
    const { templateAST, renderFunctionPath } = _transformTemplate(defaultExportedPath, code, {});
    expect(genExpression(templateAST)).toEqual(`<template pagePath="true"><div class="page-container __rax-view"><View>
        <Image ref="hello" style={styles.logo} onClick={this.mathRodom.bind(this)} source={{
        uri: '//gw.alicdn.com/tfs/TB1MRC_cvb2gK0jSZK9XXaEgFXa-1701-1535.png'
      }} />
        <Text>hello world</Text>
      </View></div></template>`);
  });
  it('renderFunctionPath removed in class component', () => {
    const ast = parseCode(code);
    const defaultExportedPath = getDefaultExportedPath(ast, code);
    const { templateAST, renderFunctionPath } = _transformTemplate(defaultExportedPath, code, {});
    expect(genExpression(renderFunctionPath.node)).toEqual(`render() {}`);
  });
  it('templateAST add template tag in function component', () => {
    const ast = parseCode(functionCode);
    const defaultExportedPath = getDefaultExportedPath(ast, functionCode);
    const { templateAST, renderFunctionPath } = _transformTemplate(defaultExportedPath, functionCode, {});
    expect(genExpression(templateAST)).toEqual(`<template pagePath="true"><div class="page-container __rax-view"><View>
          <Image ref="hello" style={styles.logo} onClick={this.mathRodom.bind(this)} source={{
        uri: '//gw.alicdn.com/tfs/TB1MRC_cvb2gK0jSZK9XXaEgFXa-1701-1535.png'
      }} />
          <Text>hello world</Text>
        </View></div></template>`);
  });
  it('renderFunctionPath removed in class component', () => {
    const ast = parseCode(functionCode);
    const defaultExportedPath = getDefaultExportedPath(ast, functionCode);
    const { templateAST, renderFunctionPath } = _transformTemplate(defaultExportedPath, functionCode, {});
    expect(genExpression(renderFunctionPath.node)).toEqual(`() => {}`);
  });
  // it('add text', () => {
  //   const textCode = `
  //   import { createElement, Component } from 'rax';
  //   import View from 'rax-view';
  //   import Image from 'rax-image';
    
  //   export default class Logo extends Component{
  //     render() {
  //       return (
  //         <div>
  //           <Image
  //             ref="hello"
  //             style={styles.logo}
  //             onClick={this.mathRodom.bind(this)}
  //             source={{
  //               uri: '//gw.alicdn.com/tfs/TB1MRC_cvb2gK0jSZK9XXaEgFXa-1701-1535.png',
  //             }}
  //           />
  //           hello world
  //           <div>123</div>
  //         </div>
  //       );
  //     }
  //   };`
  //   const ast = parseCode(textCode);
  //   const defaultExportedPath = getDefaultExportedPath(ast, textCode);
  //   const { templateAST } = _transformTemplate(defaultExportedPath, textCode, {});
  //   const result = _transformComTemplate({
  //     templateAST,
  //   }).templateAST
  //   expect(genExpression(result)).toEqual(`<template pagePath="true"><div class="page-container __rax-view"><div>
  //           <Image ref="hello" style={styles.logo} onClick={this.mathRodom.bind(this)} source={{
  //       uri: '//gw.alicdn.com/tfs/TB1MRC_cvb2gK0jSZK9XXaEgFXa-1701-1535.png'
  //     }} /><text>
  //           hello world
  //           </text><div><text>123</text></div>
  //         </div></div></template>`);
  // });
  // it('expression add text', () => {
  //   const textCode = `
  //   import { createElement, Component } from 'rax';
  //   import View from 'rax-view';
  //   import Image from 'rax-image';
    
  //   export default class Logo extends Component{
  //     render() {
  //       return (
  //         <div>
  //           <Image
  //             ref="hello"
  //             style={styles.logo}
  //             onClick={this.mathRodom.bind(this)}
  //             source={{
  //               uri: '//gw.alicdn.com/tfs/TB1MRC_cvb2gK0jSZK9XXaEgFXa-1701-1535.png',
  //             }}
  //           />
  //           hello world
  //           <div>{count}</div>
  //         </div>
  //       );
  //     }
  //   };`
  //   const ast = parseCode(textCode);
  //   const defaultExportedPath = getDefaultExportedPath(ast, textCode);
  //   const { templateAST } = _transformTemplate(defaultExportedPath, textCode, {});
  //   const result = _transformComTemplate({
  //     templateAST,
  //   }).templateAST
  //   expect(genExpression(result)).toEqual(`<template pagePath="true"><div class="page-container __rax-view"><div>
  //           <Image ref="hello" style={styles.logo} onClick={this.mathRodom.bind(this)} source={{
  //       uri: '//gw.alicdn.com/tfs/TB1MRC_cvb2gK0jSZK9XXaEgFXa-1701-1535.png'
  //     }} /><text>
  //           hello world
  //           </text><div><text>{count}</text></div>
  //         </div></div></template>`);
  // });
});
