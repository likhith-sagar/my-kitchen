import React, {useCallback, useMemo} from 'react';
import {Image, StyleSheet} from 'react-native';
import {
  GestureStateChangeEvent,
  GestureUpdateEvent,
  LongPressGestureHandlerEventPayload,
  PanGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
import {normalize} from '../../../utils';
import {BlockSet} from '../core/entities/BlockSet';
import gameManager from '../core/managers/GameManager';
import {
  checkAndUpdateDropCell,
  getBoardCell,
  validateDrop,
} from '../core/utils';
import {useUIBinder} from '../hooks/useUIBinder';
import Draggable from './Draggable';
import Animated, {
  FadeIn,
  LinearTransition,
  runOnJS,
} from 'react-native-reanimated';
import {BlockProperties} from '../core/constants';

type BlockSetComponentProps = {
  blockSet: BlockSet;
};

const BlockSetComponent: React.FC<BlockSetComponentProps> = ({blockSet}) => {
  const {blockType, shapeMeta} = useUIBinder(blockSet);
  const {
    boardAnimatedRef,
    blockSize: boardBlockSize,
    occupancyMatrix,
  } = useUIBinder(gameManager.getBoardManager());
  const {selectedShapeMetaSV, currentDropCellSV} = useUIBinder(
    gameManager.getDropManager(),
  );

  const {numRows, numCols} = useMemo(() => {
    return {
      numRows: occupancyMatrix.length,
      numCols: occupancyMatrix[0].length,
    };
  }, [occupancyMatrix]);

  const {
    width: blockSetWidth,
    height: blockSetHeight,
    trimmedShape: shape,
    blockSize: shapeBlockSize,
  } = shapeMeta;

  const blocksJSX = useMemo(() => {
    return shape.map((row, rowIndex) =>
      row.map((cellValue, colIndex) => {
        if (!cellValue) {
          return null;
        }
        const layoutStyles = {
          width: shapeBlockSize,
          height: shapeBlockSize,
          left: colIndex * shapeBlockSize,
          top: rowIndex * shapeBlockSize,
        };
        return (
          <Image
            source={BlockProperties[blockType].imageSource}
            key={`${rowIndex}-${colIndex}`}
            style={[styles.block, layoutStyles]}
          />
        );
      }),
    );
  }, [shape, blockType, shapeBlockSize]);

  const containerStyles = useMemo(() => {
    return {
      width: blockSetWidth,
      height: blockSetHeight,
    };
  }, [blockSetWidth, blockSetHeight]);

  // done this  way as it'll be passed into worklet and runOnJS from there
  const processDrop = useCallback(
    (pivot: [number, number], dropCell: [number, number]) => {
      gameManager.processDrop(blockSet, pivot, dropCell);
    },
    [blockSet],
  );

  const onSelectWorklet = useCallback(
    (e: GestureStateChangeEvent<LongPressGestureHandlerEventPayload>) => {
      'worklet';

      const pivotCol = Math.floor(e.x / shapeBlockSize);
      const pivotRow = Math.floor(e.y / shapeBlockSize);

      selectedShapeMetaSV.value = {
        shape,
        pivot: [pivotCol, pivotRow],
      };
    },
    [shape, shapeBlockSize, selectedShapeMetaSV],
  );

  const onDragWorklet = useCallback(
    (e: GestureUpdateEvent<PanGestureHandlerEventPayload>) => {
      'worklet';

      if (!boardAnimatedRef) {
        return;
      }
      const currentCell = getBoardCell(
        boardAnimatedRef,
        e.absoluteX,
        e.absoluteY,
        boardBlockSize,
      );
      checkAndUpdateDropCell(numCols, numRows, currentCell, currentDropCellSV);
    },
    [boardAnimatedRef, boardBlockSize, currentDropCellSV, numCols, numRows],
  );

  const onDropWorklet = useCallback(
    (e: GestureStateChangeEvent<PanGestureHandlerEventPayload>) => {
      'worklet';

      // validate drop
      if (!boardAnimatedRef) {
        return false;
      }
      const currentCell = getBoardCell(
        boardAnimatedRef,
        e.absoluteX,
        e.absoluteY,
        boardBlockSize,
      );
      checkAndUpdateDropCell(numCols, numRows, currentCell, currentDropCellSV);
      const isValidDrop = validateDrop(
        occupancyMatrix,
        selectedShapeMetaSV,
        currentDropCellSV,
      );

      const pivot = selectedShapeMetaSV.value?.pivot || [0, 0];
      const dropCell = currentDropCellSV.value as [number, number];

      currentDropCellSV.value = null;
      selectedShapeMetaSV.value = null;

      if (isValidDrop) {
        // TODO: process the drop (on gameManager - runOnJS)
        runOnJS(processDrop)(pivot, dropCell);
        return true;
      }

      return false;
    },
    // TODO: check if deps can be reduced
    [
      selectedShapeMetaSV,
      currentDropCellSV,
      boardAnimatedRef,
      boardBlockSize,
      numCols,
      numRows,
      occupancyMatrix,
      processDrop,
    ],
  );

  return (
    <Animated.View layout={LinearTransition} entering={FadeIn}>
      <Draggable
        containerStyle={StyleSheet.flatten([styles.container, containerStyles])}
        onDragWorklet={onDragWorklet}
        onSelectWorklet={onSelectWorklet}
        onDropWorklet={onDropWorklet}>
        {blocksJSX}
      </Draggable>
    </Animated.View>
  );
};

export default BlockSetComponent;

const styles = StyleSheet.create({
  container: {
    // backgroundColor: 'red',
  },
  block: {
    position: 'absolute',
    borderRadius: normalize(1),
    borderWidth: 0.5,
    overflow: 'hidden',
    borderColor: '#333',
  },
});
