import { View, Animated, PanResponder, Dimensions, LayoutAnimation, UIManager } from 'react-native'
import React, { useEffect, useRef, useState } from 'react';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = .50 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

const Deck = ({ data, renderCard, onSwipeRight = (item) => { }, onSwipeLeft = (item) => { }, renderNoMoreCards }) => {


  const [counter, setCounter] = useState(0);
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
    onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], { useNativeDriver: false }),
    // Called when user presses down, and then releases.
    // Finalised callback.
    onPanResponderRelease: (evt, gestureState) => {
      // If you need to keep the current position as it is.
      //  pan.extractOffset() 
      const { dx } = gestureState;
      if (dx > SWIPE_THRESHOLD) {
        forceSwipe('right')
      } else if (dx < -SWIPE_THRESHOLD) {
        forceSwipe('left')
      } else {
        resetPosition()
      }
    },
  })).current;


  const getCardStyle = () => {
    const rotate = pan.x.interpolate({
      inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
      outputRange: ['-120deg', '0deg', '120deg']
    });

    return {
      transform: [
        { translateX: pan.x },
        { translateY: pan.y },
        { rotate },
      ]
    }
  }

  const forceSwipe = (action) => {
    Animated.timing(pan, {
      toValue: { x: action === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH, y: 0 },
      duration: SWIPE_OUT_DURATION,
      useNativeDriver: false,
    }).start(() => onSwipeComplete(action));
  }

  useEffect(() => {
    // The spring animation messes with the initial render
    if (counter !== 0) {
      // Only for android
      UIManager.setLayoutAnimationEnabledExperimental && UIManager.setLayoutAnimationEnabledExperimental(true)
      // Tells react native next time when you re-render the componenent use this animation
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      LayoutAnimation.spring()
      pan.setValue({ x: 0, y: 0 })
    }
    return () => { }
  }, [counter])

  const onSwipeComplete = (direction) => {
    setCounter((prev) => {
      const item = data[prev];
      direction === 'right' ? onSwipeRight(item) : onSwipeLeft(item)
      const newCounter = prev + 1;
      return newCounter;
    })
  }

  const resetPosition = () => {
    Animated.spring(pan, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start()
  }

  const renderCards = () => {

    if (counter >= data.length) {
      return renderNoMoreCards();
    }

    return data.map((item, index) => {
      if (index < counter) { return null; }

      return index === counter ?
        (<Animated.View
          key={item.id}
          style={[getCardStyle(), styles.cardStyle]}
          {...panResponder.panHandlers}>
          {renderCard(item)}
        </Animated.View>)
        :
        (
          // When the card reaches the top deck, it needs to be rendered with animated view component
          // So it gets promoted from View to animated view, so it gets re-rendered.
          // Hence the device tries to fetch the image again, and a small flicker of the image happens
          // Need to do this so that the card is never fixed in it's position
          <Animated.View key={item.id} style={[styles.cardStyle, { top: 10 * (index - counter) }]}>
            {renderCard(item)}
          </Animated.View>
        )
    }).reverse();
    // Absolute property renders one by one. On top of each other, from last element.
    // Reversing the list to show the last one first.
  }

  return (
    <View>
      {renderCards()}
    </View>
  )
}

const styles = {
  cardStyle: {
    position: 'absolute',
    width: SCREEN_WIDTH,
    // flex: 1,
    // alignContent:'center'
    // left: 0,
    // right: 0
  }
}

export default Deck;
