import {AnimatedRef} from 'react-native-reanimated';
import {UIBinder} from '../base/UIBinder';
import Block from '../entities/Block';
import {BoardConfig} from '../types';
import {BlockProperties, BlockType} from '../constants';
import {BlockSet} from '../entities/BlockSet';

const BLOCK_EXIT_DELAY_DELTA = 30;

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

  // TODO: rename
  updateBoard(
    blockSet: BlockSet,
    pivot: [number, number],
    dropCell: [number, number],
  ) {
    const shape = blockSet.getData().shapeMeta.trimmedShape;

    // TODO: update the board (matrix)
    const startRow = dropCell[1] - pivot[1];
    const endRow = startRow + shape.length - 1; // endRow inclusive
    const startCol = dropCell[0] - pivot[0];
    const endCol = startCol + shape[0].length - 1; // endCol inclusive

    let pointsByBlocksAdded = 0;

    const matrix = [...this.data.matrix]; // new reference (shallow copy)

    // done this way to create new reference for affected rows
    for (let row = startRow; row <= endRow; row++) {
      matrix[row] = matrix[row].map((cell, col) => {
        if (col >= startCol && col <= endCol) {
          const shapeRow = row - startRow;
          const shapeCol = col - startCol;
          if (shape?.[shapeRow]?.[shapeCol] === 1 && !cell) {
            const newBlock = this.getNewBlock(
              col,
              row,
              blockSet.getData().blockType,
            );
            pointsByBlocksAdded +=
              BlockProperties[newBlock.getData().blockType].points;
            return newBlock;
          }
          return cell;
        }
        return cell;
      });
    }

    // TODO: process the removal of blocks
    // TODO: process final movement of blocks
    // NOTE: decide whether to do all these here, or have the separate functions for each
    // and then gameManager will call them

    this.updateMatrix(matrix);

    return {
      points: pointsByBlocksAdded,
    };
  }

  processRemoveBlocks() {
    // TODO: process the removal of blocks
    let pointsByBlocksRemoved = 0;

    const matrix = [...this.data.matrix]; // new reference (shallow copy)

    const removedRowSet = new Set<number>();

    matrix.forEach((row, rowIndex) => {
      const isRowFull = row.every(cell => cell !== null);

      if (isRowFull) {
        // clear the row
        for (let i = 0; i < row.length; i++) {
          const block = row[i];
          pointsByBlocksRemoved +=
            BlockProperties[block.getData().blockType].points;
          block.destroy();
          (row[i] as null | Block) = null;
        }
        removedRowSet.add(rowIndex);
      }
    });
    processMatrixPostRemove(matrix, removedRowSet); // inplace
    this.updateMatrix(matrix);

    matrix.forEach((row, rowIndex) =>
      row.forEach((block, colIndex) =>
        block?.animateToPosition({row: rowIndex, col: colIndex}),
      ),
    );

    return {
      points: pointsByBlocksRemoved,
    };
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
