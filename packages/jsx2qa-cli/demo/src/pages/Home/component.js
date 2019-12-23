import { createElement, Component, render } from 'rax';
import View from 'rax-view';
import Text from '@ali/motor-rax-text';
import './component.css';

const a = 0;
const b = 2;

export default class Index extends Component {
  handleClick() {

  }
  render() {
    console.log(this.props.title, this.props);
    return (
      <View class="my-view">
        <text class="my-content" onclick={this.props.countClick} style={this.props.style}>这是一个测试组件</text>
      </View>
    );
  }
  
}
