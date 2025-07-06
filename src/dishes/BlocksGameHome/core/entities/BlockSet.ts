import {getUniqueGlobalId, randomInt} from '../../../../utils';
import {UIBinder} from '../base/UIBinder';
import {BlockType} from '../constants';
import {Shape} from '../types';

type IBlockSetData = {
  id: string;
  blockType: BlockType;
  shapeMeta: {
    numRows: number;
    numCols: number;
    trimmedShape: Shape;
    blockSize: number;
    width: number;
    height: number;
  };
};

const SHAPE_ROWS = 3;
const SHAPE_COLS = 3;
const MAX_NUM_OF_BLOCKS = 5;
const MIN_NUM_OF_BLOCKS = 2;

export class BlockSet extends UIBinder<IBlockSetData> {
  private data: IBlockSetData;

  constructor(
    shape: Shape | 'auto',
    blockType: 'auto' | BlockType,
    blockSize: number,
  ) {
    super();
    if (shape === 'auto') {
      shape = generateRandomValidShape();
    }
    if (blockType === 'auto') {
      blockType = getRandomValidBlockType();
    }
    this.data = {
      id: `blockSet-${getUniqueGlobalId()}`,
      blockType,
      shapeMeta: calculateShapeMeta(shape, blockSize),
    };
  }

  getData() {
    return this.data;
  }
}

// helper functions

function generateRandomValidShape() {
  let numOfBlocks = randomInt(MIN_NUM_OF_BLOCKS, MAX_NUM_OF_BLOCKS);
  const shape = new Array(SHAPE_ROWS)
    .fill(null)
    .map(() => new Array(SHAPE_COLS).fill(0));
  const processShape = (row: number, col: number) => {
    if (shape[row]?.[col] === 0 && numOfBlocks > 0) {
      shape[row][col] = 1;
      numOfBlocks--;
      const nextDirections = [
        [row + 1, col],
        [row - 1, col],
        [row, col + 1],
        [row, col - 1],
      ];
      // randomize next directions
      nextDirections.sort(() => Math.random() - 0.5);
      nextDirections.forEach(([nextRow, nextCol]) => {
        if (numOfBlocks > 0) {
          processShape(nextRow, nextCol);
        }
      });
    }
  };
  processShape(randomInt(0, SHAPE_ROWS - 1), randomInt(0, SHAPE_COLS - 1));
  return shape;
}

function trimShape(shape: Shape): Shape {
  const rows = shape.length;
  const cols = shape[0]?.length ?? 0;

  let top = rows,
    bottom = -1,
    left = cols,
    right = -1;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (shape[r][c] === 1) {
        top = Math.min(top, r);
        bottom = Math.max(bottom, r);
        left = Math.min(left, c);
        right = Math.max(right, c);
      }
    }
  }

  if (top > bottom || left > right) {
    return [];
  }

  const trimmedShape = [];
  for (let r = top; r <= bottom; r++) {
    trimmedShape.push(shape[r].slice(left, right + 1));
  }

  return trimmedShape;
}

function calculateShapeMeta(shape: Shape, blockSize: number) {
  const trimmedShape = trimShape(shape);

  const numRows = trimmedShape.length;
  const numCols = trimmedShape[0]?.length ?? 0;
  const width = numCols * blockSize;
  const height = numRows * blockSize;

  return {numRows, numCols, trimmedShape, blockSize, width, height};
}

function getRandomValidBlockType() {
  const blockTypes = [BlockType.PINK, BlockType.YELLOW, BlockType.BLUE];
  const randomIndex = randomInt(0, blockTypes.length - 1);
  return blockTypes[randomIndex];
}
