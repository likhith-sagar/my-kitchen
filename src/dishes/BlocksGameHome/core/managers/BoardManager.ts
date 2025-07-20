import {AnimatedRef} from 'react-native-reanimated';
import {delay} from '../../../../utils';
import {UIBinder} from '../base/UIBinder';
import {BlockType, StatsUpdateType} from '../constants';
import Block from '../entities/Block';
import {BlockSet} from '../entities/BlockSet';
import {BoardConfig, IBlockTypeMap} from '../types';
import gameManager from './GameManager';

const BLOCK_EXIT_DELAY_DELTA = 30;

const WAIT_TIME_TO_SETTLE_NEWLY_ADDED_BLOCKS = 500;
const WAIT_TIME_TO_LET_THE_ROW_CLEAR = 500;

type IBoardManagerData = {
  matrix: (Block | null)[][];
  occupancyMatrix: boolean[][]; // TODO: think of a better name
  boardAnimatedRef: AnimatedRef<any> | null;
  blockSize: number;
  boardWidth: number;
  boardHeight: number;
};

export class BoardManager extends UIBinder<IBoardManagerData> {
  private config: BoardConfig;

  private data: IBoardManagerData;

  constructor(config: BoardConfig) {
    super();
    this.config = config;

    const matrix = createMatrix(config.numRows, config.numCols);
    const occupancyMatrix = getOccupancyMatrix(matrix);

    this.data = {
      matrix,
      occupancyMatrix,
      boardAnimatedRef: null,
      blockSize: config.blockSize,
      boardWidth: config.numCols * config.blockSize,
      boardHeight: config.numRows * config.blockSize,
    };
  }

  getData() {
    return this.data;
  }

  setBoardAnimatedRef(boardAnimatedRef: AnimatedRef<any>) {
    this.data = {
      ...this.data,
      boardAnimatedRef,
    };
    this.notifyChange();
  }

  private getNewBlock(col: number, row: number, blockType?: BlockType) {
    const position = {
      row,
      col,
    };
    return new Block(
      blockType || BlockType.PINK,
      this.config.blockSize,
      position,
      col * BLOCK_EXIT_DELAY_DELTA,
    );
  }

  private updateMatrix(matrix: (Block | null)[][]) {
    this.data = {
      ...this.data,
      matrix,
      occupancyMatrix: getOccupancyMatrix(matrix),
    };
    this.notifyChange();
  }

  // primary apis -->

  async processDrop(
    blockSet: BlockSet,
    pivot: [number, number],
    dropCell: [number, number],
  ) {
    const blocksAddedCount: Partial<IBlockTypeMap<number>> = {};
    const blocksRemovedCount: Partial<IBlockTypeMap<number>> = {};
    let clearedRowsCount = 0;

    /// step-1 - start
    let matrix = [...this.data.matrix]; // new reference (shallow copy)
    const shape = blockSet.getData().shapeMeta.trimmedShape;

    // TODO: update the board (matrix)
    const startRow = dropCell[1] - pivot[1];
    const endRow = startRow + shape.length - 1; // endRow inclusive
    const startCol = dropCell[0] - pivot[0];
    const endCol = startCol + shape[0].length - 1; // endCol inclusive

    const blockType = blockSet.getData().blockType;

    // done this way to create new reference for affected rows
    for (let row = startRow; row <= endRow; row++) {
      matrix[row] = matrix[row].map((cell, col) => {
        if (col >= startCol && col <= endCol) {
          const shapeRow = row - startRow;
          const shapeCol = col - startCol;
          if (shape?.[shapeRow]?.[shapeCol] === 1 && !cell) {
            const newBlock = this.getNewBlock(col, row, blockType);
            blocksAddedCount[blockType] =
              (blocksAddedCount[blockType] || 0) + 1;
            return newBlock;
          }
          return cell;
        }
        return cell;
      });
    }

    this.updateMatrix(matrix); // updates UI
    gameManager.getStatsManager().updateStats({
      updateType: StatsUpdateType.ADD_BLOCKS_REGULAR_FLOW,
      blocksAddedCount,
    });
    /// step-1 - end

    /// step-2 - start
    const removedRowSet = new Set<number>();

    // map creates a new reference, so no need to shallow copy
    matrix = matrix.map((row, rowIndex) => {
      const isRowFull = row.every(cell => cell !== null);

      if (isRowFull) {
        // clear the row
        row.forEach(block => {
          const blockType = block.getData().blockType;
          blocksRemovedCount[blockType] =
            (blocksRemovedCount[blockType] || 0) + 1;
          block.destroy();
        });
        removedRowSet.add(rowIndex);
        clearedRowsCount++;
        return new Array(row.length).fill(null);
      }
      return row;
    });

    if (clearedRowsCount) {
      await delay(WAIT_TIME_TO_SETTLE_NEWLY_ADDED_BLOCKS); // wait for newly added blocks to settle

      processMatrixPostRemove(matrix, removedRowSet); // inplace
      this.updateMatrix(matrix); // updates UI

      await delay(WAIT_TIME_TO_LET_THE_ROW_CLEAR); // wait for the row to clear (animation)

      matrix.forEach((row, rowIndex) =>
        row.forEach((block, colIndex) =>
          block?.animateToPosition({row: rowIndex, col: colIndex}),
        ),
      );
      gameManager.getStatsManager().updateStats({
        updateType: StatsUpdateType.REMOVE_BLOCKS_REGULAR_FLOW,
        blocksRemovedCount,
        clearedRowsCount,
      });
    }
    /// step-2 - end
  }

  // secondary apis -->

  removeAllBlocksOfType(blockType: BlockType) {
    let clearCount = 0;
    const processedMatrix = this.data.matrix.map(row =>
      row.map(block => {
        if (block && block.getData().blockType === blockType) {
          block.destroy();
          clearCount++;
          return null;
        }
        return block;
      }),
    );
    this.updateMatrix(processedMatrix);
    return clearCount;
  }
}

// helper functions

function createMatrix(numRows: number, numCols: number) {
  return new Array(numRows).fill(null).map(() => new Array(numCols).fill(null));
}

function getOccupancyMatrix(matrix: (Block | null)[][]) {
  return matrix.map(row => row.map(cell => cell !== null));
}

// brings down the blocks to cover removed rows
function processMatrixPostRemove(
  matrix: (Block | null)[][],
  removedRowSet: Set<number>,
) {
  let shiftSum = 0;
  for (let i = matrix.length - 1; i >= 0; i--) {
    const newIndex = i + shiftSum;
    if (newIndex < matrix.length && newIndex !== i) {
      matrix[newIndex] = matrix[i];
      matrix[i] = new Array(matrix[i].length).fill(null);
    }
    shiftSum = (shiftSum || 0) + (removedRowSet.has(i) ? 1 : 0);
  }
}
