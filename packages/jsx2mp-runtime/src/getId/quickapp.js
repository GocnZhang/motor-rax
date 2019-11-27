/* global PROPS */
let _customId = 0;

/**
 * Get instance TAGID or PARENTID
 * */
export default function getId(type, internal) {
  switch (type) {
    case 'tag':
      return internal[PROPS][TAGID] === undefined ? `t_${_customId++}` : internal[PROPS][TAGID];
    case 'parent':
      return internal[PROPS][PARENTID] === undefined ? `p_${_customId++}` : internal['_parent'][DATA][TAGID];
    default:
      // For troubleshoot
      return `d_${_customId++}`;
  }
}
