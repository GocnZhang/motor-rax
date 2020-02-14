const t = require('@babel/types');
const { _transformTemplate, _transformRenderFunction } = require('../condition');
const { parseExpression } = require('../../parser');
const adapter = require('../../adapter').quickapp;
const genCode = require('../../codegen/genCode');
const genExpression = require('../../codegen/genExpression');

function genInlineCode(ast) {
  return genCode(ast, {
    comments: false, // Remove template comments.
    concise: true, // Reduce whitespace, but not to disable all.
  });
}

function genDynamicValue(dynamicValue) {
  const properties = [];
  Object.keys(dynamicValue).forEach((key) => {
    const value = dynamicValue[key];
    properties.push(t.objectProperty(t.identifier(key), value));
  });
  return genInlineCode(t.objectExpression(properties)).code;
}

describe('Transform condition', () => {
  it('transform conditional expression in JSXContainer', () => {
    const ast = parseExpression(`
      <View>{foo ? <View /> : <Text />}</View>
    `);
    const dynamicValue = _transformTemplate(ast, adapter, {});

    expect(genCode(ast).code).toEqual('<View><block if="{{foo}}"><View /></block><block else><Text /></block></View>');
    expect(genDynamicValue(dynamicValue)).toEqual('{ foo: foo }');
  });

  it("transform conditional's consequent is conditional expression", () => {
    const ast = parseExpression(`
      <View>{foo ? bar ? <Bar /> : <View /> : <Text />}</View>
    `);
    const dynamicValue = _transformTemplate(ast, adapter, {});

    expect(genCode(ast).code).toEqual('<View><block if="{{foo}}"><block if="{{bar}}"><Bar /></block><block else><View /></block></block><block else><Text /></block></View>');
    expect(genDynamicValue(dynamicValue)).toEqual('{ bar: bar, foo: foo }');
  });

  it("transform condition's alternate is conditional expression", () => {
    const ast = parseExpression(`
      <View>{empty ? <Empty /> : loading ? null : 'xxx' }</View>
    `);
    const dynamicValue = _transformTemplate(ast, adapter, {});

    expect(genCode(ast).code).toEqual('<View><View if="{{empty}}"><Empty /></View><View else><View if="{{loading}}"></View><View else>xxx</View></View></View>');
    expect(genDynamicValue(dynamicValue)).toEqual('{ loading: loading, empty: empty }');
  });

  it('skip list dynamic value', () => {
    const ast = parseExpression(`
      <view className="content">
          {list.map(item => {
            return (
              <Text>{item.type === 'FLOW_WALLET' ? 'M' : '¥'}</Text>
            );
          })}
        </view>
    `);
    const dynamicValue = _transformTemplate(ast, adapter, {});
    expect(Object.keys(dynamicValue)).toEqual([]);
    expect(genCode(ast).code).toEqual(
      `<view className=\"content\">
          {list.map(item => {
    return <Text><span if={item.type === 'FLOW_WALLET'}>M</span><span else>¥</span></Text>;
  })}
        </view>`);
  });

  it('transform conditional expression with list', () => {
    const ast = parseExpression(`
      <View>
        { tabList ? tabList.map(tab => {
          return <View>{tab}</View>
        }) : 123 }
      </View>
    `);
    const dynamicValue = _transformTemplate(ast, adapter, {});
    expect(genCode(ast).code).toEqual(`<View>
        <View if="{{tabList}}">{tabList.map(tab => {
      return <View>{tab}</View>;
    })}</View><View else>123</View>
      </View>`);
    expect(genDynamicValue(dynamicValue)).toEqual('{ tabList: tabList }');
  });

  it('transform simple logical expression', () => {
    const ast = parseExpression(`
      <View>
        { a && <View>1</View>}
      </View>
    `);
    _transformTemplate(ast, adapter, {});
    expect(genCode(ast).code).toEqual(`<View>
        <block if="{{a}}"><View>1</View></block><block else>{a}</block>
      </View>`);
  });

  it('transform nested logical expression', () => {
    const ast = parseExpression(`
      <View>
        { a || b && <View>1</View>}
      </View>
    `);
    _transformTemplate(ast, adapter, {});
    expect(genCode(ast).code).toEqual(`<View>
        <block if={!a}><block if="{{b}}"><View>1</View></block><block else>{b}</block></block><block else>{a}</block>
      </View>`);
  });
});

describe('Transiform condition render function', () => {
  it('basic case', () => {
    const ast = parseExpression(`(function render(props) {
        let { a, b, ...c } = props;
        let vdom;
        if (a > 0) {
          vdom = <view>case 1</view>
        } else {
          vdom = <view>case 1.1</view>
        }
        if (a > 1) {
          vdom = <view>case 2</view>
        }
        return vdom;
      })
    `);

    const tmpVars = _transformRenderFunction(ast, adapter);
    expect(genExpression(tmpVars.vdom.value)).toEqual('<block><block if="{{a > 0}}"><view>case 1</view></block><block else><view>case 1.1</view></block><block if="{{a > 1}}"><view>case 2</view></block></block>');
    expect(genExpression(ast)).toEqual(`function render(props) {
  let {
    a,
    b,
    ...c
  } = props;
  let vdom;
  return vdom;
}`);
  });
});
