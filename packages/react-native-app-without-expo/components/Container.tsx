import {ReactNode} from 'react';
import {View, ViewStyle} from 'react-native';
import Colors from '../constants/Colors';

type ContainerProps = {
  children: ReactNode;
  style: ViewStyle;
};

const Container = ({children, style}: ContainerProps) => {
  return (
    <View
      style={{
        backgroundColor: Colors.brand.yellow[75],
        borderRadius: 5,
        padding: 10,
        width: '100%',
        ...style,
      }}>
      {children}
    </View>
  );
};

export default Container;
