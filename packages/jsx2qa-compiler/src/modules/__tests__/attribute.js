const t = require('@babel/types');
const { _transformAttribute, _transformPreComponentAttr } = require('../attribute');
const { parseExpression } = require('../../parser');
const adapter = require('../../adapter').quickapp;
const genCode = require('../../codegen/genCode');

describe('Transform JSX Attribute', () => {
  it('should transform attribute name is key', () => {
    const code = '<View key={1}>test</View>';
    const ast = parseExpression(code);
    _transformAttribute(ast, code, adapter);
    expect(genCode(ast).code).toEqual('<View key={1}>test</View>');
  });
  it('should transform attribute name is className', () => {
    const code = '<rax-view className="box">test</rax-view>';
    const ast = parseExpression(code);
    _transformAttribute(ast, code, adapter);
    expect(genCode(ast).code).toEqual('<rax-view class="box">test</rax-view>');
  });
  it("should collect attribute name is ref and parse it's value as a string", () => {
    const code = '<View ref={scrollViewRef}>test</View>';
    const ast = parseExpression(code);
    const refs = _transformAttribute(ast, code, adapter);
    expect(genCode(ast).code).toEqual('<View ref="scrollViewRef">test</View>');
    expect(refs).toEqual([t.stringLiteral('scrollViewRef')]);
  });
  it('should not transform wechat custom component className', () => {
    const code = '<Custom className="box">test</Custom>';
    const ast = parseExpression(code);
    _transformAttribute(ast, code, adapter);
    expect(genCode(ast).code).toEqual('<Custom class-name="box">test</Custom>');
  });
  it('should transform wechat custom component style into styleSheet', () => {
    const code = "<Custom style={{width: '100rpx'}}>test</Custom>";
    const ast = parseExpression(code);
    _transformAttribute(ast, code, adapter);
    expect(genCode(ast).code).toEqual(`<Custom style-sheet={{
  width: '100rpx'
}}>test</Custom>`);
  });
  it('should transform on to bind', () => {
    const code = "<rax-text onInputChange={this.onInputChange}>test</rax-text>";
    const ast = parseExpression(code);
    _transformAttribute(ast, code, adapter);
    _transformPreComponentAttr(ast, adapter)
    expect(genCode(ast).code).toEqual(`<rax-text bind-input-change={this.onInputChange}>test</rax-text>`);
  });
});
