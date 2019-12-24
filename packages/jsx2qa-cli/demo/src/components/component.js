import { createElement, Component, render } from 'rax';
import View from 'rax-view';
import Text from '@ali/motor-rax-text';
import './component.css';

const a = 0;
const b = 2;

export default class Index extends Component {
  handleClick = (e) => {
    console.log('eeeeeee', e.target);
    this.props.countClick && this.props.countClick();
    this.props.onCountClick && this.props.onCountClick();
  }
  componentWillMount() {
    console.log('组件生命周期 --- componentWillMount');
  }
  componentDidMount() {
    console.log('组件生命周期 --- componentDidMount');
  }
  componentWillUnmount() {
    console.log('组件生命周期 --- componentWillUnmount');
  }
  componentWillReceiveProps(nextProps) {
    console.log('组件生命周期 --- nextProps', nextProps);
  }
  componentWillUpdate(nextProps, nextState) {
    console.log('组件生命周期 --- componentWillUpdate', nextProps, nextState);
  }
  componentDidUpdate(prevProps, prevState) {
    console.log('组件生命周期 --- componentDidUpdate', prevProps, prevState);
  }
  render() {
    return (
      <View class="my-view">
        <div data-index="222" onclick={this.handleClick}>
          <text class="my-content" data-index="1" style={this.props.style}>这是一个测试组件，点我</text>
        </div>
      </View>
    );
  }

}
