import {
  cancelAnimation,
  makeMutable,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import {UIBinder} from '../base/UIBinder';
import {PositionInMatrix, PositionSV} from '../types';
import {getUniqueGlobalId} from '../../../../utils';
import {BlockType} from '../constants';

export type IBlockData = {
  id: string;
  position: PositionSV;
  blockType: BlockType;
  size: number;
  exitDelay: number;
};

class Block extends UIBinder<IBlockData> {
  private data: IBlockData;

  private newPositionInMatrix: PositionInMatrix;
  private curPositionInMatrix: PositionInMatrix;

  constructor(
    blockType: BlockType,
    size: number,
    positionInMatrix: PositionInMatrix,
    exitDelay: number,
  ) {
    super();
    const {row, col} = positionInMatrix;
    const position = {
      x: col * size,
      y: row * size,
    };
    this.newPositionInMatrix = positionInMatrix;
    this.curPositionInMatrix = positionInMatrix;
    this.data = {
      id: `block-${getUniqueGlobalId()}`,
      position: makeMutable(position),
      blockType,
      size,
      exitDelay,
    };
  }

  animateToPosition(positionInMatrix: PositionInMatrix) {
    if (
      this.curPositionInMatrix.col != positionInMatrix.col ||
      this.curPositionInMatrix.row != positionInMatrix.row
    ) {
      this.curPositionInMatrix = positionInMatrix;
      const posX = this.curPositionInMatrix.col * this.data.size;
      const posY = this.curPositionInMatrix.row * this.data.size;

      this.data.position.value = withDelay(
        this.data.exitDelay,
        withTiming({x: posX, y: posY}, {duration: 500}),
      );
    }
  }

  getData() {
    return this.data;
  }

  destroy() {
    cancelAnimation(this.data.position);
  }
}

export default Block;
