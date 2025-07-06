import React, {useEffect, useMemo} from 'react';
import {View, StyleSheet} from 'react-native';
import {BoardManager} from '../core/managers/BoardManager';
import {useUIBinder} from '../hooks/useUIBinder';
import {normalize} from '../../../utils';
import PreviewBlock from './PreviewBlock';
import Animated, {
  runOnJS,
  runOnUI,
  useAnimatedRef,
} from 'react-native-reanimated';
import gameManager from '../core/managers/GameManager';
import {Block} from './Block';

type GameBoardProps = {
  boardManager: BoardManager;
};

export const GameBoard: React.FC<GameBoardProps> = ({boardManager}) => {
  const animatedRef = useAnimatedRef<Animated.View>();

  useEffect(() => {
    console.log('LLLL SETTING BOARD ANIMATED REF');
    boardManager.setBoardAnimatedRef(animatedRef);
  }, [boardManager, animatedRef]);

  const {boardHeight, boardWidth, matrix, blockSize, occupancyMatrix} =
    useUIBinder(boardManager);

  const numRows = matrix.length;
  const numCols = matrix[0].length;

  const {selectedShapeMetaSV, currentDropCellSV} = useUIBinder(
    gameManager.getDropManager(),
  );

  const boardStyle = useMemo(() => {
    return {
      width: boardWidth,
      height: boardHeight,
    };
  }, [boardWidth, boardHeight]);

  useEffect(() => {
    const setOccupancyMatrix = () => {
      'worklet';
      global.occupancyMatrix = occupancyMatrix;
    };
    runOnUI(setOccupancyMatrix)();
  }, [occupancyMatrix]);

  const backgroundGridJSX = useMemo(() => {
    console.log('LLLL RENDER BACKGROUND GRID');
    const gridCellSize = blockSize;
    const gridCellSizeStyle = {
      width: gridCellSize,
      height: gridCellSize,
    };

    const elements = [];
    // not using matrix directly as matrix keeps changing
    for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
      for (let colIndex = 0; colIndex < numCols; colIndex++) {
        elements.push(
          <View
            key={`${rowIndex}-${colIndex}`}
            style={[
              (rowIndex + colIndex) % 2 === 0
                ? styles.backgroundGridCellVarA
                : styles.backgroundGridCellVarB,
              gridCellSizeStyle,
            ]}
          />,
        );
      }
    }
    return elements;
  }, [numRows, numCols, blockSize]);

  const previewGridJSX = useMemo(() => {
    console.log('LLLL RENDER PREVIEW GRID');
    const previewBlocks = [];
    // not using matrix directly as matrix keeps changing
    for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
      for (let colIndex = 0; colIndex < numCols; colIndex++) {
        previewBlocks.push(
          <PreviewBlock
            key={`${rowIndex}-${colIndex}`}
            row={rowIndex}
            col={colIndex}
            blockSize={blockSize}
            selectedShapeMetaSV={selectedShapeMetaSV}
            currentDropCellSV={currentDropCellSV}
          />,
        );
      }
    }
    return previewBlocks;
  }, [numRows, numCols, blockSize, selectedShapeMetaSV, currentDropCellSV]);

  const blocksJSX = useMemo(() => {
    const blocks: React.JSX.Element[] = [];
    matrix.forEach(row => {
      return row.forEach(block => {
        if (!block) {
          return null;
        }
        blocks.push(<Block key={block.getData().id} block={block} />);
      });
    });
    return blocks;
  }, [matrix]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.boardContainer, boardStyle]}
        ref={animatedRef}>
        {backgroundGridJSX}
        {previewGridJSX}
        {blocksJSX}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ccc',
    padding: normalize(10),
    borderRadius: normalize(6),
  },
  boardContainer: {
    backgroundColor: '#eee',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  backgroundGridCellVarA: {
    backgroundColor: '#e1e1e1',
  },
  backgroundGridCellVarB: {
    backgroundColor: '#eeeeee',
  },
});
