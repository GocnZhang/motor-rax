const t = require('@babel/types');
const traverse = require('../utils/traverseNodePath');
const genExpression = require('../codegen/genExpression');
const CodeError = require('../utils/CodeError');
const compiledComponents = require('../compiledComponents');
const basedComponents = require('../baseComponents');

function transformAttribute(ast, code, adapter) {
  const refs = [];
  traverse(ast, {
    JSXAttribute(path) {
      const { node, parentPath } = path;
      const attrName = node.name.name;
      switch (attrName) {
        case 'key':
          node.name.name = adapter.key;
          break;
        case 'className':
          if (!adapter.styleKeyword) {
            if (isNativeComponent(path)) {
              node.name.name = 'class';
            } else {
              path.parentPath.node.attributes.push(t.jsxAttribute(t.jsxIdentifier('class'), node.value));
            }
          } else{
            node.name.name = 'class';
          } 
          break;
        case 'style':
          if (adapter.styleKeyword && /(c)?-/g.test(parentPath.node.name.name) && parentPath.node.name.name !== 'rax-view') {
            node.name.name = 'style-sheet';
          }
          break;
        case 'ref':
          if (t.isJSXExpressionContainer(node.value)) {
            node.value = t.stringLiteral(genExpression(node.value.expression));
          }
          if (t.isStringLiteral(node.value)) {
            refs.push(node.value);
          } else {
            throw new CodeError(code, node, path.loc, "Ref's type must be string or jsxExpressionContainer");
          }
          break;
        default:
          
      }
    }
  });
  return refs;
}

function isNativeComponent(path) {
  const {
    node: { name: tagName }
  } = path.parentPath.get('name');
  return !!compiledComponents[tagName];
}

function transformPreComponentAttr(ast, options) {
  traverse(ast, {
    JSXAttribute(path) {
      const { node, parentPath } = path;
      const attrName = node.name.name;
      if(parentPath.node.name.name.indexOf('rax-') !== -1) {
        // onChange => bindChange
        if(attrName.slice(0, 2) === 'on') {
          node.name.name = attrName.replace('on', 'bind');
        }
        // bindChange => bind-change
        const newAttrName = node.name.name;
        if (/[A-Z]+/g.test(newAttrName) && newAttrName !== 'className') {
          node.name.name = newAttrName.replace(/[A-Z]+/g, (v, i) => {
            if(i !== 0) {
              return `-${v.toLowerCase()}`
            }
            return v; 
          });
        }
      }
    }
  })
}

module.exports = {
  parse(parsed, code, options) {
    parsed.refs = transformAttribute(parsed.templateAST, code, options.adapter);
  },
  generate(ret, parsed, options) {
    if (parsed.templateAST) {
      transformPreComponentAttr(parsed.templateAST, options.adapter)
    }
    ret.template = genExpression(parsed.templateAST, {
      comments: false,
      concise: true,
    })
  },
  // For test cases.
  _transformAttribute: transformAttribute,
  _transformPreComponentAttr: transformPreComponentAttr
};
