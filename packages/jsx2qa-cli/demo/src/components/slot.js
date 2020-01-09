import { createElement } from 'rax';
import View from 'rax-view';

export default (props) => {
  return (
    <View>
      <slot></slot>
    </View>
    
  );
};
