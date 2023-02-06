import { View, Animated, Text, PanResponder, Dimensions } from 'react-native'
import { useRef } from 'react';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = .50 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

const Deck = ({ data, renderCard, onSwipeRight = () =>{}, onSwipeLeft = () => {} }) => {

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
    onPanResponderRelease: (evt, gestureState) => {
      // If you need to keep the current position as it is.
      //  pan.extractOffset() 
      const { dx } = gestureState;
      if(dx > SWIPE_THRESHOLD){
        forceSwipeRight();
      } else if (dx < -SWIPE_THRESHOLD) {
        forceSwipeLeft();
      } else {
        resetPosition()
      }
      },
  })).current;


  const getCardStyle = () => {
    const rotate = pan.x.interpolate({
      inputRange:[-SCREEN_WIDTH * 1.5 , 0, SCREEN_WIDTH * 1.5],
      outputRange:['-120deg', '0deg', '120deg']
    });

    return { transform : [
      { translateX: pan.x }, 
      { translateY: pan.y },
      { rotate }
    ]}
  }

  const forceSwipeRight = () =>{
    Animated.timing(pan, {
      toValue: { x : SCREEN_WIDTH, y : 0},
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: true,
    }).start();
  }

  const forceSwipeLeft = () =>{
    Animated.timing(pan, {
      toValue: { x : -SCREEN_WIDTH, y : 0},
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: true,
    }).start();
  }

  const onSwipeComplete = (direction) =>{
    direction === 'right' ? onSwipeRight : onSwipeLeft;
  }

  const resetPosition = () =>{
    Animated.spring(pan, {
      toValue: { x :0, y : 0},
      useNativeDriver: true,
    }).start()
  }

  const renderCards = () =>{
    return data.map((item, index) => {

      if(index !== 0) {
        return renderCard(item);
      }

      return <Animated.View 
      key={item.id}
      style = {getCardStyle()}
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
