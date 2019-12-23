import { Component, render } from 'rax';
import View from 'rax-view';
import Text from '@ali/motor-rax-text';
import C from './component';
import './index.css';

export default class Home extends Component {
  state = {
    count: 0,
    list: [1, 2, 3]
  }
  onCountClick = () => {
    console.log('onclick');
    this.setState({
      count: this.state.count + 1
    })
  }
  render() {
    const { count } = this.state;
    return (
      <View class="demo-wrap">
        <View class="demo-block">
          <View><Text class="demo-title">样式测试</Text></View>
          <View><text class="demo-subtitle" style="color: red">1.内联字符串</text></View>
          <View><text class="demo-subtitle" style={{color: 'red'}}>2.内联对象</text></View>
        </View>
        <View class="demo-block">
          <View><Text class="demo-title">属性传递</Text></View>
          <View><text class="demo-subtitle">1.属性传递(基础，对象，方法，自定义组件)</text></View>
          <C title="属性传递(基础，对象，方法，自定义组件)" countClick={this.onCountClick} obj={{a: 1}} str="string" num={111} boolean={false} array={[1,2,3]} null={null} />
          <View><text class="demo-subtitle">1.预设组件(属性命名)</text></View>
          <View><Text class="demo-title" style="color:red" numberOfLines>样式测试</Text></View>
        </View>
          
        
        <span onclick={this.onCountClick}>xxxxxxx点我</span>
        {count}
        {/* {count}
        <View x-for={(item, index) in list}>
          {item}
        </View>
        <View x-if={count <= 0}>这是一个数字</View>
        <View x-else >这是更新的数字</View> */}
      </View>
    )
  }
}
