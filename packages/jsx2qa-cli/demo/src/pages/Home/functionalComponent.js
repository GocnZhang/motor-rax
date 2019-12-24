import { createElement, Component, render } from 'rax';
import View from 'rax-view';
import Text from '@ali/motor-rax-text';
import './component.css';

const a = 0;
const b = 2;

export default function Index(props) {
  function handleClick() {
    props.countClick && props.countClick();
    props.onCountClick && props.onCountClick();
  }
  console.log(props.title, props);
  return (
    <View class="my-view">
      <Text class="my-content" onClick={handleClick} style={props.style}>这是一个functional组件，点我</Text>
    </View>
  );
}
