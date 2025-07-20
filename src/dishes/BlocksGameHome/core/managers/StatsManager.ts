import {UIBinder} from '../base/UIBinder';
import {
  StatsUpdateType,
  SpecialAbilityType,
  BlockType,
  BlockProperties,
} from '../constants';
import {IStatsUpdateData, IBlockTypeMap} from '../types';

// note: TODO: to check whether to combine add/remove blocks update flow into same
// (just have regular flow and ability flow)

export interface IStatsData {
  score: number;
  blocksAddedCount: IBlockTypeMap<number>;
  blocksRemovedCount: IBlockTypeMap<number>;
  blocksAddedViaAbilityCount: IBlockTypeMap<number>;
  blocksRemovedViaAbilityCount: IBlockTypeMap<number>;
  latestAbilityUsed: SpecialAbilityType | null; // TODO: check whether to maintain list or just latest
  clearedRowsCount: number;
}

export class StatsManager extends UIBinder<IStatsData> {
  private data: IStatsData;

  constructor() {
    super();
    const initialBlocksCount: IBlockTypeMap<number> = {
      [BlockType.PINK]: 0,
      [BlockType.YELLOW]: 0,
      [BlockType.BLUE]: 0,
    };
    this.data = {
      score: 0,
      blocksAddedCount: {...initialBlocksCount},
      blocksRemovedCount: {...initialBlocksCount},
      blocksAddedViaAbilityCount: {...initialBlocksCount},
      blocksRemovedViaAbilityCount: {...initialBlocksCount},
      latestAbilityUsed: null,
      clearedRowsCount: 0,
    };
  }

  getData = (): IStatsData => {
    return this.data;
  };

  updateStats = (update: IStatsUpdateData) => {
    switch (update.updateType) {
      case StatsUpdateType.ADD_BLOCKS_REGULAR_FLOW:
        if (update.blocksAddedCount) {
          let updatedBlocksAddedCount: IBlockTypeMap<number> = {
            ...this.data.blocksAddedCount,
          };
          let updatedScore = this.data.score;
          Object.keys(update.blocksAddedCount).forEach(key => {
            const type = key as BlockType;
            updatedBlocksAddedCount[type] +=
              update.blocksAddedCount![type] || 0;
            updatedScore += calculateScore(
              update.blocksAddedCount![type] || 0,
              type,
            );
          });

          this.data = {
            ...this.data,
            blocksAddedCount: updatedBlocksAddedCount,
            score: updatedScore,
          };
        }
        break;

      case StatsUpdateType.REMOVE_BLOCKS_REGULAR_FLOW:
        if (update.blocksRemovedCount) {
          let updatedBlocksRemovedCount: IBlockTypeMap<number> = {
            ...this.data.blocksRemovedCount,
          };
          let updatedScore = this.data.score;
          let updatedClearedRowsCount =
            this.data.clearedRowsCount + (update.clearedRowsCount || 0);
          Object.keys(update.blocksRemovedCount).forEach(key => {
            const type = key as BlockType;
            updatedBlocksRemovedCount[type] +=
              update.blocksRemovedCount![type] || 0;
            updatedScore += calculateScore(
              update.blocksRemovedCount![type] || 0,
              type,
            );
          });

          this.data = {
            ...this.data,
            blocksRemovedCount: updatedBlocksRemovedCount,
            score: updatedScore,
            clearedRowsCount: updatedClearedRowsCount,
          };
        }
        break;

      case StatsUpdateType.REMOVE_BLOCKS_ABILITY_FLOW:
        if (update.blocksRemovedCount) {
          let updatedBlocksRemovedViaAbilityCount: IBlockTypeMap<number> = {
            ...this.data.blocksRemovedViaAbilityCount,
          };
          let updatedScore = this.data.score;
          Object.keys(update.blocksRemovedCount).forEach(key => {
            const type = key as BlockType;
            updatedBlocksRemovedViaAbilityCount[type] +=
              update.blocksRemovedCount![type] || 0;
            updatedScore += calculateScore(
              update.blocksRemovedCount![type] || 0,
              type,
            );
          });

          this.data = {
            ...this.data,
            blocksRemovedViaAbilityCount: updatedBlocksRemovedViaAbilityCount,
            score: updatedScore,
            latestAbilityUsed:
              update.specialAbilityUsed || this.data.latestAbilityUsed,
          };
        }
        break;

      default:
        break;
    }

    this.notifyChange();
  };
}

// helper functions

const calculateScore = (blocksCount: number, blockType: BlockType): number => {
  return blocksCount * BlockProperties[blockType].points;
};
