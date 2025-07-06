import {
  AnimatedRef,
  getRelativeCoords,
  SharedValue,
} from 'react-native-reanimated';
import {SelectedShapeMeta} from './types';

const DEFAULT_COORDS = {x: -1, y: -1};

export const getBoardCell = (
  boardAnimatedRef: AnimatedRef<any>,
  absX: number,
  absY: number,
  blockSize: number,
): [number, number] => {
  'worklet';
  const {x, y} =
    getRelativeCoords(boardAnimatedRef, absX, absY) ?? DEFAULT_COORDS;

  const col = Math.floor(x / blockSize);
  const row = Math.floor(y / blockSize);

  return [col, row];
};

export const checkAndUpdateDropCell = (
  numCols: number,
  numRows: number,
  currentCell: [number, number],
  currentDropCellSV: SharedValue<[number, number] | null>,
) => {
  'worklet';
  if (
    currentCell?.[0] < 0 ||
    currentCell?.[0] >= numCols ||
    currentCell?.[1] < 0 ||
    currentCell?.[1] >= numRows
  ) {
    if (currentDropCellSV.value) {
      currentDropCellSV.value = null;
    }
    return;
  }

  if (
    currentDropCellSV.value?.[0] === currentCell?.[0] &&
    currentDropCellSV.value?.[1] === currentCell?.[1]
  ) {
    return;
  }
  currentDropCellSV.value = currentCell;
};

export const validateDrop = (
  occupancyMatrix: boolean[][],
  selectedShapeMetaSV: SharedValue<SelectedShapeMeta | null>,
  currentDropCellSV: SharedValue<[number, number] | null>,
) => {
  'worklet';
  if (!currentDropCellSV.value || !selectedShapeMetaSV.value) {
    return false;
  }

  const numCols = occupancyMatrix[0].length;
  const numRows = occupancyMatrix.length;

  const [dropCellCol, dropCellRow] = currentDropCellSV.value;
  const {shape, pivot} = selectedShapeMetaSV.value;

  for (let y = 0; y < shape.length; y++) {
    for (let x = 0; x < shape[y].length; x++) {
      const cellCol = dropCellCol - pivot[0] + x;
      const cellRow = dropCellRow - pivot[1] + y;
      // out of bounds
      if (
        cellCol < 0 ||
        cellCol >= numCols ||
        cellRow < 0 ||
        cellRow >= numRows
      ) {
        return false;
      }
      // block already exists
      if (shape[y][x] === 1 && occupancyMatrix[cellRow][cellCol]) {
        return false;
      }
    }
  }

  return true;
};
