const t = require('@babel/types');
const { NodePath } = require('@babel/traverse');
const isFunctionComponent = require('../utils/isFunctionComponent');
const isClassComponent = require('../utils/isClassComponent');
const traverse = require('../utils/traverseNodePath');
const getReturnElementPath = require('../utils/getReturnElementPath');
const genExpression = require('../codegen/genExpression');
const createJSX = require('../utils/createJSX');
const createBinding = require('../utils/createBinding');
const findIndex = require('../utils/findIndex');

const TEMPLATE_AST = 'templateAST';
const RENDER_FN_PATH = 'renderFunctionPath';

function _transformTemplate(defaultExportedPath, code, options) {
  const renderFnPath = isFunctionComponent(defaultExportedPath)
    ? defaultExportedPath
    : isClassComponent(defaultExportedPath)
      ? getRenderMethodPath(defaultExportedPath)
      : undefined;
  if (!renderFnPath) return;

  const returnPath = getReturnElementPath(renderFnPath);
  if (!returnPath) throw new Error('Can not find JSX Statements in ' + options.resourcePath);

  let returnArgument = returnPath.get('argument').node;
  traverse(returnArgument, {
    JSXText(path) {
      // <View>hello</View> => <View><text>hello</text></View>
      const { node, parentPath } = path;
      if(t.isJSXElement(parentPath) && path.node.value && path.node.value.trim().length && t.isJSXIdentifier(parentPath.node.openingElement.name, { name: 'View' })) {
        path.replaceWith(createJSX('text', {}, [path.node]));
      }
    }
  })
  if (!['JSXText', 'JSXExpressionContainer', 'JSXSpreadChild', 'JSXElement', 'JSXFragment'].includes(returnArgument.type)) {
    returnArgument = t.jsxExpressionContainer(returnArgument);
  }
  returnPath.remove();
  const result = {};
  result[TEMPLATE_AST] = createJSX('template', {}, [returnArgument]);
  result[RENDER_FN_PATH] = renderFnPath;
  return result;
}
/**
 * Extract JSXElement path.
 */
module.exports = {
  parse(parsed, code, options) {
    const { defaultExportedPath } = parsed;
    if (!defaultExportedPath) return;
    // <View>111</View> => <template><View><text>111</text></View></template>
    const result = _transformTemplate(defaultExportedPath, parsed, options)
    Object.assign(parsed, result);
  },
  generate(ret, parsed, options) {
    if (parsed[TEMPLATE_AST]) {
      const children = parsed[TEMPLATE_AST].children || [];
      const lastTemplateDefineIdx = findIndex(children,
        (node) => t.isJSXElement(node) && node.openingElement.name.name !== 'template');
      const templateDefineNodes = children.splice(0, lastTemplateDefineIdx);
      ret.template = [
        ...templateDefineNodes.map(node => genExpression(node, {
          comments: false,
          concise: true,
        })),
        genExpression(parsed[TEMPLATE_AST], {
          comments: false,
          concise: true,
        })
      ].join('\n');
    }
  },
  _transformTemplate: _transformTemplate
};

/**
 * Get the render function path from class component declaration..
 * @param path {NodePath} A nodePath that contains a render function.
 * @return {NodePath} Path to render function.
 */
function getRenderMethodPath(path) {
  let renderMethodPath = null;

  traverse(path, {
    /**
     * Example:
     *   class {
     *     render() {}
     *   }
     */
    ClassMethod(classMethodPath) {
      const { node } = classMethodPath;
      if (t.isIdentifier(node.key, { name: 'render' })) {
        renderMethodPath = classMethodPath;
      }
    },
    /**
     * Example:
     *   class {
     *     render = function() {}
     *     render = () => {}
     *   }
     */
    ClassProperty(path) {
      // TODO: support class property defined render function.
    },
  });

  return renderMethodPath;
}
