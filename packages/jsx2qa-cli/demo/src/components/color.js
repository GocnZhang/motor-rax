import { createElement, render, createContext, useReducer } from "rax";

/**
 * 创建一个 Color 组件
 * Color 组件包裹的所有组件都可以访问到 value
 */
const reducer = (state, action) => {
  console.log(state, action);
  switch (action.type) {
    case UPDATE_COLOR:
      return action.color;
    default:
      return state;
  }
};
export default function Color (props) {
  const { colorContext } = props;
  console.log('colorContext', colorContext);
  const [color, dispatch] = useReducer(reducer, "blue");
  return (
    <colorContext.Provider value={{ color, dispatch }}>
      <slot></slot>
    </colorContext.Provider>
  );
  // return <div>
  //   <text>123</text>
  //   <slot></slot>
  // </div>
};
