import {normalize} from '../../../../utils';
import {GameStateStep, SpecialAbilityType} from '../constants';
import {UIBinder} from '../base/UIBinder';
import {BlockSet} from '../entities/BlockSet';
import {BlockSetManager} from './BlockSetManager';
import {BoardManager} from './BoardManager';
import {DropManager} from './DropManager';
import {SpecialAbilityManager} from './SpecialAbilityManager';
import {StatsManager} from './StatsManager';

type IGameManagerData = {
  gameStateStep: GameStateStep; // TODO: check if this is needed
};

const BOARD_BLOCK_SIZE = normalize(40);
const BLOCK_SET_BLOCK_SIZE = normalize(20);

export class GameManager extends UIBinder<IGameManagerData> {
  private boardManager: BoardManager;
  private blockSetManager: BlockSetManager;
  private dropManager: DropManager;
  private specialAbilityManager: SpecialAbilityManager;
  private statsManager: StatsManager;

  private data: IGameManagerData;

  constructor() {
    super();
    this.data = {
      gameStateStep: GameStateStep.NONE,
    };

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
    this.statsManager = new StatsManager();
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

  getStatsManager(): StatsManager {
    return this.statsManager;
  }

  async processDrop(
    blockSet: BlockSet,
    pivot: [number, number],
    dropCell: [number, number],
  ) {
    await this.boardManager.processDrop(blockSet, pivot, dropCell);
    this.specialAbilityManager.updateAbilities();
    this.blockSetManager.removeBlockSet(blockSet.getData().id);
    this.blockSetManager.addNewBlockSet();
  }

  processAbility(ability: SpecialAbilityType) {
    this.specialAbilityManager.processAbility(ability);
  }
}

const gameManager = new GameManager();

export default gameManager;
