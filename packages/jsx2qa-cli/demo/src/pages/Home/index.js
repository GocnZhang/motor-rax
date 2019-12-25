import { Component, render } from 'rax';
import View from 'rax-view';
import Text from '@ali/motor-rax-text';
import Link from '@ali/motor-rax-link';
import C from '../../components/component';
import D from '../../components/functionalComponent';
// import Utils from '@ali/motor-universal-utils';
import './index.css';
import { getCacheCityInfo } from '@ali/motor-universal-utils';

export default class Home extends Component {
  state = {
    count: {
      name: '计数器',
      num: 0
    },
    list: [1, 2, 3],
    updated: false,
    componentWillMounted: false,
    componentDidMounted: false,
    componentWillReceivePropsed: false,
    componentWillUpdated: false,
    componentDidUpdated: false,
    componentWillUnmounted: false,
  }
  onCountClick = () => {
    console.log('onclick');
    this.setState({
      count: Object.assign({}, this.state.count, {
        num: this.state.count.num + 1
      })
    })
  }
  componentDidMount() {
    getCacheCityInfo()
  }
  renderCount() {
    const { count } = this.state;
    return <View>{count.num}</View>
  }
  update = () => {
    this.setState({updated: true});
  }
  componentWillMount() {
    this.setState({componentWillMounted: true});
  }
  componentDidMount() {
    this.setState({componentDidMounted: true});
    // Utils.getCacheCityInfo()
    console.log('componentDidMount')
  }
  componentWillUnmount() {
    console.log('unmount excuted');
  }
  componentWillReceiveProps(nextProps) {
    this.setState({componentWillReceivePropsed: nextProps});
  }
  componentWillUpdate() {
    this.setState({componentWillUpdated: true});
  }
  componentDidUpdate() {
    this.setState({componentDidUpdated: true});
  }
  render() {
    const {
      count,
      componentWillMounted = false,
      componentDidMounted = false,
      componentWillReceivePropsed = false,
      componentWillUpdated = false,
      componentDidUpdated = false,
      componentWillUnmounted = false,
      list,
    } = this.state;
    return (
      <View class="demo-wrap">
        <View class="demo-block">
          <View><Text class="demo-title">生命周期验证</Text></View>
          <View onClick={this.update}><Text style="color: blue;">点我update</Text></View>
          <View><text class="demo-subtitle">componentWillMount ---- {componentWillMounted}</text></View>
          <View><text class="demo-subtitle">componentDidMount ---- {componentDidMounted}</text></View>
          <View><text class="demo-subtitle">componentWillReceiveProps ---- {componentWillReceivePropsed}</text></View>
          <View><text class="demo-subtitle">componentWillUpdate ---- {componentWillUpdated}</text></View>
          <View><text class="demo-subtitle">componentDidUpdate ---- {componentDidUpdated}</text></View>
          <View><text class="demo-subtitle">componentWillUnmount ---- {componentWillUnmounted}</text></View>
        </View>
        <C updated={this.state.updated} />
        {/* <View class="demo-block">
          <View><Text class="demo-title">样式测试</Text></View>
          <View><text class="demo-subtitle" style="color: red">1.内联字符串</text></View>
          <View><Text class="demo-subtitle" style={{color: 'red'}}>2.内联对象</Text></View>
        </View>
        <View class="demo-block">
          <View><Text class="demo-title">属性传递</Text></View>
          <View><text class="demo-subtitle">1.属性传递(基础，对象，方法，自定义组件)</text></View>
          <C title="属性传递(基础，对象，方法，自定义组件)" countClick={this.onCountClick} obj={{a: 1}} str="string" num={111} boolean={false} array={[1,2,3]} null={null} />
          <View><text class="demo-subtitle">2.预设组件(属性命名)</text></View>
          <View class="demo-content"><Text style="color:red" numberOfLines>预设组件(属性命名)</Text></View>
          <View><text class="demo-subtitle">3.class setState</text></View>
          <View class="demo-content">
            <span onclick={this.onCountClick}>xxxxxxx点我</span>{count.num}
          </View>
        </View>
        <View class="demo-block">
          <View><Text class="demo-title">functional组件</Text></View>
          <View><text class="demo-subtitle">1.属性传递(基础，对象，方法，自定义组件)</text></View>
          <D title="func属性传递(基础，对象，方法，自定义组件)" countClick={this.onCountClick} obj={{a: 1}} str="string" num={111} boolean={false} array={[1,2,3]} null={null} />
          <View><text class="demo-subtitle">2.onXxxx属性方法传递</text></View>
          <D title="onXxxx属性方法传递" onCountClick={this.onCountClick} />
        </View> */}
        <Link className="demo-link" href="/pages/HomeFunc">跳转 functional page</Link>
        {/* <View class="demo-block"> */}
          {/* <View><Text class="demo-title">jsx语法验证</Text></View>
          <View><text class="demo-subtitle">1.if else</text></View>
          <View class="demo-content" x-if={count.num < 2}>count num小于2</View>
          <View class="demo-content" x-elseif={count.num === 2}>count num等于2</View>
          <View class="demo-content" x-else>count num大于2</View> */}
          <View><text class="demo-subtitle">2.for</text></View>
          {list.map((v) => {
            return <View>{v}</View>
          })}
          
          {/* <View><text class="demo-subtitle">3.x-class</text></View>
          <View x-class={{ 'demo-content': true, 'margin-bigger': count.num === 2 }}>
            count num 等于2, 左间距会变大
          </View>
        </View>
        <View class="demo-block">
          <View><Text class="demo-title">render function</Text></View>
          {/* {this.renderCount()} */}
        {/* </View> */}
      </View>
    )
  }
}
