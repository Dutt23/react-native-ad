import { useEffect } from 'react';
import { View, Animated } from 'react-native';

export default function Ball() {

  // Where is starting position of the element
  // Where is it moving, ending point of element.
  // How is it moving
  const position = new Animated.ValueXY({
    x: 0,
    y : 0
  });

  useEffect(() =>{
    Animated.spring(position, {
      toValue: { x :300, y : 500},
      useNativeDriver: false,
    }).start()
  }, [])

  console.log(position)
  return (
    <Animated.View style= {position.getLayout()}>
    <View style={styles.ball}/>
    </Animated.View>
  );
}

const styles = {
  ball :{
    height :60,
    width :60,
    borderRadius: 30,
    borderWidth: 30,
    borderColor: 'black'
  }
}