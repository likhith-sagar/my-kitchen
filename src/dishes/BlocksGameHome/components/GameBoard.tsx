import React, {useEffect, useMemo} from 'react';
import {StyleSheet, View} from 'react-native';
import Animated, {useAnimatedRef} from 'react-native-reanimated';
import {normalize} from '../../../utils';
import {BoardManager} from '../core/managers/BoardManager';
import {useUIBinder} from '../hooks/useUIBinder';
import {Block} from './Block';
import PreviewGrid from './PreviewGrid';

type GameBoardProps = {
  boardManager: BoardManager;
};

export const GameBoard: React.FC<GameBoardProps> = ({boardManager}) => {
  const animatedRef = useAnimatedRef<Animated.View>();

  useEffect(() => {
    boardManager.setBoardAnimatedRef(animatedRef);
  }, [boardManager, animatedRef]);

  const {boardHeight, boardWidth, matrix, blockSize} =
    useUIBinder(boardManager);

  const numRows = matrix.length;
  const numCols = matrix[0].length;

  const boardStyle = useMemo(() => {
    return {
      width: boardWidth,
      height: boardHeight,
    };
  }, [boardWidth, boardHeight]);

  const backgroundGridJSX = useMemo(() => {
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
        <PreviewGrid />
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
