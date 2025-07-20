import React, {useMemo} from 'react';
import {Image, StyleSheet} from 'react-native';
import Animated, {
  FadeOut,
  SlideInUp,
  useAnimatedStyle,
} from 'react-native-reanimated';
import {normalize, SCREEN_HEIGHT} from '../../../utils';
import {BlockProperties, ZIndex} from '../core/constants';
import BlockEntity from '../core/entities/Block';
import {useUIBinder} from '../hooks/useUIBinder';

type BlockProps = {
  block: BlockEntity;
};

export const Block: React.FC<BlockProps> = ({block}) => {
  const {blockType, size, position, exitDelay} = useUIBinder(block);

  const blockImageSource = BlockProperties[blockType].imageSource;

  const slideInAnimation = useMemo(
    () => SlideInUp.withInitialValues({originY: -SCREEN_HEIGHT}).build(),
    [],
  );

  const staticStyles = useMemo(() => {
    return {
      width: size,
      height: size,
    };
  }, [size]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {translateX: position.value.x},
        {translateY: position.value.y},
      ],
    };
  }, [position]);

  return (
    <Animated.View style={[styles.blockContainer, animatedStyles]}>
      <Animated.View
        style={[styles.block, staticStyles]}
        entering={slideInAnimation}
        exiting={FadeOut.delay(exitDelay)}>
        <Image
          source={blockImageSource}
          resizeMode="stretch"
          style={styles.blockImage}
        />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  block: {
    borderRadius: normalize(2),
    borderWidth: normalize(1),
    overflow: 'hidden',
    borderColor: '#444',
  },
  blockContainer: {
    position: 'absolute',
    zIndex: ZIndex.BLOCK,
  },
  blockImage: {
    width: '100%',
    height: '100%',
  },
});
