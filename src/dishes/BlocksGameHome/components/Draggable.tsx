import React from 'react';
import {StyleSheet, ViewStyle} from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureStateChangeEvent,
  GestureUpdateEvent,
  LongPressGestureHandlerEventPayload,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

export interface IDraggableProps {
  children: React.ReactNode;
  // Add other props as needed
  containerStyle?: ViewStyle;
  onSelectWorklet?: (
    event: GestureStateChangeEvent<LongPressGestureHandlerEventPayload>,
  ) => void;
  onDragWorklet?: (
    event: GestureUpdateEvent<PanGestureHandlerEventPayload>,
  ) => void;
  onDropWorklet?: (
    event: GestureStateChangeEvent<PanGestureHandlerEventPayload>,
  ) => boolean;
}

const Draggable: React.FC<IDraggableProps> = ({
  children,
  containerStyle,
  onSelectWorklet,
  onDragWorklet,
  onDropWorklet,
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const activatePan = useSharedValue(false);
  const panInProgress = useSharedValue(false);
  const scaleSV = useSharedValue(1);

  // TODO: address issue, related to scaleSV and finalizing
  const pan = Gesture.Pan()
    .onUpdate(e => {
      if (activatePan.value) {
        panInProgress.value = true;
        translateX.value = e.translationX;
        translateY.value = e.translationY;
        onDragWorklet?.(e);
      }
    })
    .onEnd(e => {
      if (activatePan.value) {
        activatePan.value = false;
        const isDroppedSuccessfully = onDropWorklet?.(e);
        if (isDroppedSuccessfully) {
          scaleSV.value = 0; // make it disappear, anyways will get unmounted in next render
        } else {
          scaleSV.value = 1; // reset scale as pan ended (TODO: conditional)
          translateX.value = withSpring(0);
          translateY.value = withSpring(0);
        }
      }
    })
    .onFinalize(() => {
      if (!panInProgress.value) {
        scaleSV.value = 1; // reset scale, as gesture ended in between
        activatePan.value = false;
        panInProgress.value = false;
      }
    });

  const longPress = Gesture.LongPress()
    .minDuration(500)
    .onBegin(() => {
      scaleSV.value = withTiming(1.1, {duration: 500});
    })
    .onStart(e => {
      scaleSV.value = withTiming(0.6, {duration: 50});
      activatePan.value = true;
      onSelectWorklet?.(e);
    })
    .onFinalize(() => {
      if (!activatePan.value) {
        scaleSV.value = 1; // reset scale, as gesture ended in between
      }
    });

  const composed = Gesture.Simultaneous(longPress, pan);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {translateX: translateX.value},
      {translateY: translateY.value},
      {scale: scaleSV.value},
    ],
  }));

  return (
    <GestureDetector gesture={composed}>
      <Animated.View style={[animatedStyle, styles.draggable, containerStyle]}>
        {children}
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  draggable: {
    // Optionally add styles here
  },
});

export default Draggable;
