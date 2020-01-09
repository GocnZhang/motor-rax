import { render, createElement, useContext } from "rax";


export default function ShowArea (props) {
  const { colorContext } = props;
  const { color } = useContext(colorContext);
  return <div style={{ color: color }}>字体颜色展示为{color}</div>;
};
