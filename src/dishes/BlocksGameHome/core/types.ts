import {SharedValue} from 'react-native-reanimated';
import {BlockType, SpecialAbilityType, StatsUpdateType} from './constants';

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

export type BlockSetManagerConfig = {
  maxBlockSets: number;
  blockSize: number;
};

export type IBlockProperties = {
  imageSource: any;
  points: number;
};

export type IBlockTypeMap<V> = {
  [key in BlockType]: V;
};

export type IStatsUpdateData = {
  updateType: StatsUpdateType;
  blocksAddedCount?: Partial<IBlockTypeMap<number>>;
  blocksRemovedCount?: Partial<IBlockTypeMap<number>>;
  specialAbilityUsed?: SpecialAbilityType;
  clearedRowsCount?: number;
  // add as needed
};
