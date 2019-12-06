const { _transformList } = require('../list');
const { parseExpression } = require('../../parser');
const adapter = require('../../adapter').quickapp;
const genCode = require('../../codegen/genCode');

describe('Transform list', () => {
  it('transform array.map in JSXContainer with inline return', () => {
    const ast = parseExpression(`
      <View>{arr.map((val, idx) => <item data-value={val} data-key={idx} />)}</View>
    `);
    _transformList(ast, [], adapter);

    expect(genCode(ast).code).toEqual(`<View><block for={(val, idx) in arr}><item data-value={val} data-key={idx} /></block></View>`);
  });

  it('transform array.map in JSXContainer', () => {
    const ast = parseExpression(`
      <View>{arr.map((val, idx) => {
        return <item data-value={val} data-key={idx} />
      })}</View>
    `);
    _transformList(ast, [], adapter);

    expect(genCode(ast).code).toEqual(`<View><block for={(val, idx) in arr}><item data-value={val} data-key={idx} /></block></View>`);
  });

  it('bind list variable', () => {
    const ast = parseExpression(`
      <View>{arr.map((item, idx) => <View>{item.title}<image source={{ uri: item.picUrl }} resizeMode={resizeMode} /></View>)}</View>
    `);
    _transformList(ast, [], adapter);

    expect(genCode(ast).code).toEqual(`<View><block for={(item, idx) in arr}><View>{item.title}<image source={{
        uri: item.picUrl
      }} resizeMode={resizeMode} /></View></block></View>`);
  });

  it('list elements', () => {
    const raw = `<View>{[1,2,3].map((val, idx) => {
      return <Text>{idx}</Text>;
    })}</View>`;
    const ast = parseExpression(raw);
    _transformList(ast, [], adapter);

    expect(genCode(ast, { concise: true }).code).toEqual('<View><block for={(val, idx) in [1, 2, 3]}><Text>{idx}</Text></block></View>');
  });

  it('nested list', () => {
    const raw = `
  <View
    className="header"
    onClick={() => {
      setWorkYear(workYear + 1);
    }}
  >
    <View style={{ color: 'red' }}>workYear: {workYear}</View>
    <View style={{ color: 'red' }}>count: {count}</View>
    {arr.map(l1 => {
      return (
        <View>
          {l1.map(l2 => {
            return <View>{l2}</View>;
          })}
        </View>
      );
    })}
    <Loading count={count} />
    {props.children}
  </View>`;
    const ast = parseExpression(raw);
    _transformList(ast, [], adapter);

    expect(genCode(ast, { concise: true }).code).toEqual(`<View className="header" onClick={() => { setWorkYear(workYear + 1); }}>
    <View style={{ color: 'red' }}>workYear: {workYear}</View>
    <View style={{ color: 'red' }}>count: {count}</View>
    <block for={(l1, index) in arr}><View>
          <block for={(l2, index) in l1}><View>{l2}</View></block>
        </View></block>
    <Loading count={count} />
    {props.children}
  </View>`);
  });

  it('list default params', () => {
    const raw = `<View>{[1,2,3].map(() => {
      return <Text>test</Text>;
    })}</View>`;
    const ast = parseExpression(raw);
    _transformList(ast, [], adapter);

    expect(genCode(ast, { concise: true }).code).toEqual('<View><block for={(item, index) in [1, 2, 3]}><Text>test</Text></block></View>');
  });
});
