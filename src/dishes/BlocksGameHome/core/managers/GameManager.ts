import {normalize} from '../../../../utils';
import {GameStateStep} from '../constants';
import {UIBinder} from '../base/UIBinder';
import {BlockSet} from '../entities/BlockSet';
import {GameConfig} from '../types';
import {BlockSetManager} from './BlockSetManager';
import {BoardManager} from './BoardManager';
import {DropManager} from './DropManager';
import {SpecialAbilityManager} from './SpecialAbilityManager';

type IGameManagerData = {
  gameStateStep: GameStateStep; // TODO: check if this is needed
  score: number;
};

const BOARD_BLOCK_SIZE = normalize(40);
const BLOCK_SET_BLOCK_SIZE = normalize(20);

export class GameManager extends UIBinder<IGameManagerData> {
  private boardManager: BoardManager;
  private blockSetManager: BlockSetManager;
  private dropManager: DropManager;
  private specialAbilityManager: SpecialAbilityManager;

  private config: GameConfig;

  private data: IGameManagerData;

  constructor(config: GameConfig) {
    super();
    this.data = {
      gameStateStep: GameStateStep.NONE,
      score: 0,
    };
    this.config = config;

    this.boardManager = new BoardManager({
      blockSize: BOARD_BLOCK_SIZE,
      numRows: 10,
      numCols: 8,
    });

    this.blockSetManager = new BlockSetManager({
      maxBlockSets: 3,
      blockSize: BLOCK_SET_BLOCK_SIZE,
    });

    this.dropManager = new DropManager();
    this.specialAbilityManager = new SpecialAbilityManager();
  }

  getData() {
    return this.data;
  }

  getBoardManager(): BoardManager {
    return this.boardManager;
  }

  getBlockSetManager(): BlockSetManager {
    return this.blockSetManager;
  }

  getDropManager(): DropManager {
    return this.dropManager;
  }

  getSpecialAbilityManager(): SpecialAbilityManager {
    return this.specialAbilityManager;
  }

  updateScore(score: number) {
    this.data = {
      ...this.data,
      score: this.data.score + score,
    };
    this.notifyChange();
  }

  processDrop(
    blockSet: BlockSet,
    pivot: [number, number],
    dropCell: [number, number],
  ) {
    {
      /// step-1 - start
      // update the board (matrix)
      const {points} = this.boardManager.updateBoard(blockSet, pivot, dropCell);
      // update the score
      this.updateScore(points);
      // update blockSet
      this.blockSetManager.removeBlockSet(blockSet.getData().id);
      this.blockSetManager.addNewBlockSet(1);
      /// step-1 - end
    }

    // TODO: manage clear timeout
    setTimeout(() => {
      // TODO: remove (for testing)
      /// step-2 - start
      const {points} = this.boardManager.processRemoveBlocks();
      this.updateScore(points);
      /// step-2 - end
    }, 500);
  }
}

const gameManager = new GameManager({
  scorePerBlock: 100, // TODO: remove (unused mostly)
});

export default gameManager;
