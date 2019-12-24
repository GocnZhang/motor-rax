/* global PROPS */
let _customId = 0;

/**
 * Get instance TAGID or PARENTID
 * */
export default function getId(type, internal) {
  switch (type) {
    case 'tag':
      return internal["_attrs"]["tagId"] === undefined ? "t_" + _customId++ : internal["_attrs"]["tagId"];

    case 'parent':
      return !internal['_parent'] || !internal['_parent']["data"] || !internal['_parent']["data"]["tag-id"] === undefined ? "p_" + _customId++ : internal['_parent']["data"]["tag-id"];

    default:
      // For troubleshoot
      return "d_" + _customId++;
  }
}
