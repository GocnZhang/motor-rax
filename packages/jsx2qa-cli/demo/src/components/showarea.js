import { render, createElement, useContext } from "rax";


export default function ShowArea (props) {
  const { colorContext } = props;
  console.log('colorContext', props);
  const context = useContext(colorContext);
  console.log('color', context);
  return <div style={{ color: context.color }}>字体颜色展示为{color}</div>;
};
