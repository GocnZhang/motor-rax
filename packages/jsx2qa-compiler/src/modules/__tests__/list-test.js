const { _transformList } = require('../list');
const { parseExpression } = require('../../parser');
const adapter = require('../../adapter').quickapp;
const genCode = require('../../codegen/genCode');

const ast = parseExpression(`
<View>{[1,2,3].map(() => {
  return <Text style={styles.item}>test</Text>;
})}</View>
`);
_transformList(ast, [], adapter);
