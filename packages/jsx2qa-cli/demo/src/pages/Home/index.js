import { Component } from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import C from './component';

export default function Home() {

  return (
    <View style={styles.home}>
      <Text>Hello rax quickapp.</Text>
      <C />
    </View>
  )
}
