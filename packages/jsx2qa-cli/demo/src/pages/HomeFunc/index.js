import { render, useState, useEffect, createContext, useRef } from 'rax';
import { usePageShow, usePageHide, useLayoutEffect, useBackPress, useMenuPress } from 'rax-app';
import View from 'rax-view';
import Text from '@ali/motor-rax-text';
import C from '../../components/component';
import D from '../../components/functionalComponent';
import Demo from '../../components/slot';
// import ShowArea from "../../components/showarea";
// import Buttons from "../../components/button";
// import Color from "../../components/color";
import './index.css';

const colorContext = createContext({});
export default function Index() {
  const [count, setCount] = useState(0);
  const inputEl = useRef(null, 'inputEl');
  const onButtonClick = () => {
    // `current` points to the mounted text input element
    // inputEl.current.focus();
    console.log('inputEl', inputEl);
  };
  // const [list, setList] = useState([1,2,3]);
  // function onCountClick() {
  //   setCount(count+1)
  // }
  // useLayoutEffect(() => {
  //   console.log('useEffect excuted');
  //   setCount(99)
  // }, ['count']);

  // usePageShow(() => {
  //   console.log('usePageShow excuted');
  // })

  // usePageShow(() => {
  //   console.log('usePageShow excuted11111111');
  // })

  // usePageHide(() => {
  //   console.log('usePageHide excuted');
  // })

  useBackPress(() => {
    console.log('useBackPress excuted')
  })

  useMenuPress(() => {
    console.log('useBackPress excuted')
  })

  function setCountFunc() {
    setCount(1);
  }

  return <View class="demo-wrap">
      <text onClick={setCountFunc}>点我试试</text>
      <input ref={inputEl} type="text" placeholder="这是一个input" />
	    <View onClick={onButtonClick}>Focus the input</View>
      {/* <View><Text class="demo-title">functional component page</Text></View>
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
      {count} */}
      {/* <Color colorContext={colorContext}>
        <Buttons />
        <ShowArea></ShowArea> 
      </Color> */}
      {/* <Demo>
        <View x-memo>123{count}</View>
      </Demo> */}
    </View>
}
