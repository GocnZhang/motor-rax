const t = require('@babel/types');
const { _transformTemplate } = require('../template');
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
        hello world
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
          hello world
        </View>
      );
    };`;

describe('Transform template', () => {
  it('templateAST add template tag in class component', () => {
    const ast = parseCode(code);
    const defaultExportedPath = getDefaultExportedPath(ast, code);
    const { templateAST, renderFunctionPath } = _transformTemplate(defaultExportedPath, code, {});
    expect(genExpression(templateAST)).toEqual(`<template><View>
        <Image ref="hello" style={styles.logo} onClick={this.mathRodom.bind(this)} source={{
      uri: '//gw.alicdn.com/tfs/TB1MRC_cvb2gK0jSZK9XXaEgFXa-1701-1535.png'
    }} />
        hello world
      </View></template>`);
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
    expect(genExpression(templateAST)).toEqual(`<template><View>
          <Image ref="hello" style={styles.logo} onClick={this.mathRodom.bind(this)} source={{
      uri: '//gw.alicdn.com/tfs/TB1MRC_cvb2gK0jSZK9XXaEgFXa-1701-1535.png'
    }} />
          hello world
        </View></template>`);
  });
  it('renderFunctionPath removed in class component', () => {
    const ast = parseCode(functionCode);
    const defaultExportedPath = getDefaultExportedPath(ast, functionCode);
    const { templateAST, renderFunctionPath } = _transformTemplate(defaultExportedPath, functionCode, {});
    expect(genExpression(renderFunctionPath.node)).toEqual(`() => {}`);
  });
});
