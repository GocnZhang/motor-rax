import { createElement } from 'rax';
import View from 'rax-view';
import Text from '@ali/motor-rax-text';
import './component.css';

const a = 0;
const b = 2;

export default function Index(props) {
  return (
    <View class="my-view">
      <text style={props.style}>hehehe</text>
    </View>
  );
}
