import { View, Animated, Text, PanResponder } from 'react-native'
import { useRef } from 'react';
const Deck = ({ data, renderCard }) => {


  const panResponder = useRef(PanResponder.create({
    // Decide whether this responder should handle the event.
    // Triggerred when user first clicks down.
    onStartShouldSetPanResponder: (evt, gestureState) => true,
    // Called many many times as the use is dragging the element around the screen
    onPanResponderMove: (evt, gestureState) => { 
      console.log(evt);
      console.log(gestureState);
    },
    // Called when user presses down, and then releases.
    // Finalised callback.
    onPanResponderRelease: () => {},
  })).current;

  const renderCards = () =>{
    return data.map(item => renderCard(item))
  }

  return (
    <View {...panResponder.panHandlers}>{renderCards()}</View>
  )
}


export default Deck;
