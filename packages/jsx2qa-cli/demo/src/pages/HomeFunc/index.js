import { render, useState } from 'rax';
import View from 'rax-view';
import Text from '@ali/motor-rax-text';
import C from '../../components/component';
import D from '../../components/functionalComponent';
import './index.css';

export default function Index() {
  const [count, setCount] = useState(0);
  const [list, setList] = useState([1,2,3]);
  function onCountClick() {
    setCount(count+1)
  }
  return <View class="demo-wrap">
      <View><Text class="demo-title">functional component page</Text></View>
      <View class="demo-block">
        <View><Text class="demo-title">样式测试</Text></View>
        <View><text class="demo-subtitle" style="color: red">1.内联字符串</text></View>
        <View><text class="demo-subtitle" style={{color: 'red'}}>2.内联对象</text></View>
      </View>
      <View class="demo-block">
        <View><Text class="demo-title">属性传递</Text></View>
        <View><text class="demo-subtitle">1.属性传递(基础，对象，方法，自定义组件)</text></View>
        <C title="属性传递(基础，对象，方法，自定义组件)" countClick={onCountClick} obj={{a: 1}} str="string" num={111} boolean={false} array={[1,2,3]} null={null} />
        <View><text class="demo-subtitle">2.onXxxx属性方法传递</text></View>
        <C title="onXxxx属性方法传递" onCountClick={onCountClick} />
        <View><text class="demo-subtitle">3.预设组件(属性命名)</text></View>
        <View><Text class="demo-title" style="color:red;" numberOfLines={1}>样式测试样式测试样式测试样式测试样式测试样式测试样式测试样式测试样式测试样式测试</Text></View>
      </View>
      <View class="demo-block">
        <View><Text class="demo-title">functional组件</Text></View>
        <View><text class="demo-subtitle">1.属性传递(基础，对象，方法，自定义组件)</text></View>
        <D title="属性传递(基础，对象，方法，自定义组件)" countClick={onCountClick} obj={{a: 1}} str="string" num={111} boolean={false} array={[1,2,3]} null={null} />
        <View><text class="demo-subtitle">2.onXxxx属性方法传递</text></View>
        <D title="onXxxx属性方法传递" onCountClick={onCountClick} />
      </View>

      <span onclick={onCountClick}>xxxxxxx点我</span>
      {count}

    </View>
}
