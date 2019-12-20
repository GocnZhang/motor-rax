import { Component, useState } from 'rax';
import View from 'rax-view';
import Text from '@ali/motor-rax-text';
import C from './component';

export default function Home() {
  const [ count, setCount ] = useState(0);
  const [ list, setList ] = useState([1, 2, 3]);
  return (
    <View>
      <Text>Hello rax quickapp.</Text>
      <C style={{color: 'red'}} />
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
