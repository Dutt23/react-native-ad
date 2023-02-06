import { View, Animated, Text, PanResponder } from 'react-native'
import { useRef } from 'react';
const Deck = ({ data, renderCard }) => {

  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(PanResponder.create({
    // Decide whether this responder should handle the event.
    // Triggerred when user first clicks down.
    onStartShouldSetPanResponder: (evt, gestureState) => true,
    // Called many many times as the use is dragging the element around the screen
    // Not sure about this, but only one gestureState object exists.
    // As soon as we exit onPanResponderMove the gesture object is reset.
    // Only one exists in physical memory
    // https://reactnative.dev/docs/panresponder
    // Try changing with number and see what happens
    onPanResponderMove: Animated.event([null, {dx: pan.x, dy: pan.y}], {useNativeDriver: false}),
    // Called when user presses down, and then releases.
    // Finalised callback.
    onPanResponderRelease: () => {pan.extractOffset()},
  })).current;

  const renderCards = () =>{
    return data.map((item, index) => {

      if(index !== 0) {
        return renderCard(item);
      }

      return <Animated.View 
      key={index}
      style = {{  transform : [
      { translateX: pan.x}, 
       {translateY: pan.y}
    ]}}
      {...panResponder.panHandlers}>{renderCard(item)}
      </Animated.View>
    }
    )
  }

  return (
    <View>
      {renderCards()}
    </View>
  )
}


export default Deck;
