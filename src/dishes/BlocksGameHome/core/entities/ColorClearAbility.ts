import {SpecialAbility} from '../base/SpecialAbility';
import {UIBinder} from '../base/UIBinder';
import {BlockType, SpecialAbilityType, StatsUpdateType} from '../constants';
import gameManager from '../managers/GameManager';

type IColorClearAbilityData = {
  isUsable: boolean;
  abilityType: SpecialAbilityType;
  blockType: BlockType;
  progressCount: number;
  unlockThreshold: number;
  level: number;
};

const INITIAL_UNLOCK_THRESHOLD = 20;

export class ColorClearAbility
  extends UIBinder<IColorClearAbilityData>
  implements SpecialAbility<IColorClearAbilityData>
{
  data: IColorClearAbilityData;

  private lastUsedCount: number = 0;

  constructor(abilityType: SpecialAbilityType) {
    super();
    this.data = {
      isUsable: false,
      abilityType,
      blockType: getBlockTypeFromAbilityType(abilityType),
      progressCount: 0,
      unlockThreshold: INITIAL_UNLOCK_THRESHOLD,
      level: 1,
    };
  }

  private updateData(newData: Partial<IColorClearAbilityData>) {
    this.data = {
      ...this.data,
      ...newData,
    };
    this.notifyChange();
  }

  update() {
    const statsData = gameManager.getStatsManager().getData();
    const blocksAddedCount = statsData.blocksAddedCount[this.data.blockType];
    let currentIsUsable = false;
    let currentProgress = blocksAddedCount - this.lastUsedCount;

    if (currentProgress >= this.data.unlockThreshold) {
      currentProgress = this.data.unlockThreshold;
      currentIsUsable = true;
    }

    this.updateData({
      isUsable: currentIsUsable,
      progressCount: currentProgress,
    });
  }

  private updatePostProcess() {
    const statsData = gameManager.getStatsManager().getData();
    const blocksAddedCount = statsData.blocksAddedCount[this.data.blockType];
    this.lastUsedCount = blocksAddedCount;

    const newUnlockThreshold = Math.floor(this.data.unlockThreshold * 1.5);
    const newLevel = this.data.level + 1;
    this.updateData({unlockThreshold: newUnlockThreshold, level: newLevel});
    this.update();
  }

  process() {
    if (!this.data.isUsable) {
      return;
    }
    const clearCount = gameManager
      .getBoardManager()
      .removeAllBlocksOfType(this.data.blockType);
    gameManager.getStatsManager().updateStats({
      updateType: StatsUpdateType.REMOVE_BLOCKS_ABILITY_FLOW,
      blocksRemovedCount: {
        [this.data.blockType]: clearCount,
      },
      specialAbilityUsed: this.data.abilityType,
    });

    // update used
    this.updatePostProcess();
  }

  getData(): IColorClearAbilityData {
    return this.data;
  }
}

// helper functions

function getBlockTypeFromAbilityType(
  abilityType: SpecialAbilityType,
): BlockType {
  switch (abilityType) {
    case SpecialAbilityType.COLOR_CLEAR_PINK:
      return BlockType.PINK;
    case SpecialAbilityType.COLOR_CLEAR_YELLOW:
      return BlockType.YELLOW;
    case SpecialAbilityType.COLOR_CLEAR_BLUE:
      return BlockType.BLUE;

    default:
      return BlockType.PINK; // default case, should not happen
  }
}
