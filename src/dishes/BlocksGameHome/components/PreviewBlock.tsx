import React, {useMemo} from 'react';
import {StyleSheet} from 'react-native';
import Animated, {SharedValue, useAnimatedStyle} from 'react-native-reanimated';
import {SelectedShapeMetaSV} from '../core/types';
import {normalize} from '../../../utils';
import {ZIndex} from '../core/constants';

type PreviewBlockProps = {
  row: number;
  col: number;
  blockSize: number;
  selectedShapeMetaSV: SelectedShapeMetaSV;
  currentDropCellSV: SharedValue<[number, number] | null>;
  isInvalidDropSV: SharedValue<boolean>;
};

const PreviewBlock: React.FC<PreviewBlockProps> = ({
  row,
  col,
  blockSize,
  selectedShapeMetaSV,
  currentDropCellSV,
  isInvalidDropSV,
}) => {
  const staticStyles = useMemo(() => {
    return {
      width: blockSize - 1,
      height: blockSize - 1,
      left: col * blockSize,
      top: row * blockSize,
    };
  }, [blockSize, col, row]);

  const animatedStyles = useAnimatedStyle(() => {
    let isCurrentDropCell = false;

    if (selectedShapeMetaSV.value && currentDropCellSV.value) {
      const rowRelativeToDropCell = row - currentDropCellSV.value[1];
      const colRelativeToDropCell = col - currentDropCellSV.value[0];

      const transposedRowOnSelectedShape =
        selectedShapeMetaSV.value.pivot[1] + rowRelativeToDropCell;
      const transposedColOnSelectedShape =
        selectedShapeMetaSV.value.pivot[0] + colRelativeToDropCell;

      isCurrentDropCell =
        selectedShapeMetaSV.value.shape?.[transposedRowOnSelectedShape]?.[
          transposedColOnSelectedShape
        ] === 1;
    }

    return {
      opacity: isCurrentDropCell ? 1 : 0,
      backgroundColor: isInvalidDropSV.value ? '#AA000044' : '#BEDABE',
      borderWidth: 0.5,
      borderColor: isInvalidDropSV.value ? '#880000' : '#008800',
    };
  });

  return (
    <Animated.View style={[styles.container, staticStyles, animatedStyles]} />
  );
};

export default React.memo(PreviewBlock);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    borderRadius: normalize(2),
    margin: 0.5,
    borderWidth: 0.5,
    zIndex: ZIndex.PREVIEW_BLOCK,
  },
});
