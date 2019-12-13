/**
 * Extendable
 */
const parserAdapters = {
  'quickapp': {
    if: 'if',
    else: 'else',
    elseif: 'elif',
    show: 'show',
    for: 'for',
    forItem: 'a:for-item',
    forIndex: 'a:for-index',
    key: 'key',
    ext: 'ux',

    modulePathSuffix: '/lib/miniapp/index',

    div: {
      onClick: 'onclick',
      onLongPress: 'onlongpress',
      onTouchStart: 'ontouchstart',
      onTouchEnd: 'ontouchend',
      onTouchMove: 'ontouchmove',
      onTouchCancel: 'ontouchcancel',
      onAppear: 'onappear',
      onDisAppear: 'ondisappear',
      onBlur: 'onblur',
      onFocus: 'onfocus',
      onSwipe: 'onswipe',
      onResize: 'onresize',
      className: '__rax-view'
    },
    // Need transform style & class keyword
    styleKeyword: true,
    // Need transform onClick -> bindonclick
    needTransformEvent: false,
    slotScope: true
  },
};

module.exports = parserAdapters;
