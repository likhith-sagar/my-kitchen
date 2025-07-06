import {ASSETS_IMAGES} from '../../../assets';
import {IBlockProperties} from './types';

export enum GameStateStep {
  NONE,
  BLOCK_TO_BE_SELECTED,
  BLOCK_SELECTED,
  BLOCK_DROPPED,
  TABLE_BLOCKS_ADDING,
  TABLE_BLOCKS_ADDED,
  TABLE_BLOCKS_CHECK_PROCESSING,
  TABLE_BLOCKS_PROCESSING,
  TABLE_BLOCKS_PROCESSED,
  GAME_OVER,
}

export enum BlockType {
  PINK = 'PINK',
  YELLOW = 'YELLOW',
  BLUE = 'BLUE',
}

export enum ZIndex {
  BLOCK = 1,
  PREVIEW_BLOCK = 2,
}

export enum SpecialAbilityType {
  COLOR_CLEAR_PINK = 'COLOR_CLEAR_PINK',
  COLOR_CLEAR_YELLOW = 'COLOR_CLEAR_YELLOW',
  COLOR_CLEAR_BLUE = 'COLOR_CLEAR_BLUE',
}

export const BlockProperties: {[key in BlockType]: IBlockProperties} = {
  [BlockType.PINK]: {
    points: 50,
    imageSource: ASSETS_IMAGES.pinkBlock,
  },
  [BlockType.YELLOW]: {
    points: 50,
    imageSource: ASSETS_IMAGES.yellowBlock,
  },
  [BlockType.BLUE]: {
    points: 50,
    imageSource: ASSETS_IMAGES.blueBlock,
  },
};
