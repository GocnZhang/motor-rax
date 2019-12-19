import { Component, useState } from 'rax';
import View from 'rax-view';
import Text from '@ali/motor-rax-text';
import C from './component';

export default function Home() {
  const [ count, setCount ] = useState(0)
  return (
    <View>
      <Text>Hello rax quickapp.</Text>
      <C />
      {count}
    </View>
  )
}
