import {SharedValue} from 'react-native-reanimated';
import {BlockType} from './constants';

// TODO: follow the convention of types/interfaces to start with I

export type Position = {
  x: number;
  y: number;
};

export type PositionSV = SharedValue<Position>;

export type PositionInMatrix = {
  row: number;
  col: number;
};

// TODO: Remove this interface
export interface UIBinder<T> {
  getData: () => T;
  addChangeListener: (listener: (data: T) => void) => void;
  removeChangeListener: () => void;
}

export type Shape = number[][];

export type SelectedShapeMeta = {
  shape: Shape;
  pivot: [number, number];
} | null;
export type SelectedShapeMetaSV = SharedValue<SelectedShapeMeta>;

export type MatrixCell = {
  filled: boolean;
  color?: string;
};

export type GameMatrix = MatrixCell[][];

export type BoardConfig = {
  blockSize: number;
  numRows: number;
  numCols: number;
};

export type GameConfig = {
  scorePerBlock: number; // TODO: remove (unused mostly)
  // TODO: Add more game config
};

export type BlockSetManagerConfig = {
  maxBlockSets: number;
  blockSize: number;
};

export type IBlockProperties = {
  imageSource: any;
  points: number;
};

export type IContextForUpdateAbilities = {
  // add fields as needed
  blocksAddedTillNow: {
    [key in BlockType]: number;
  };
  blocksDestroyedTillNow: {
    [key in BlockType]: number;
  };
};
