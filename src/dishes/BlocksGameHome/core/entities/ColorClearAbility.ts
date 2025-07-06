import {SpecialAbility} from '../base/SpecialAbility';
import {UIBinder} from '../base/UIBinder';
import {BlockType} from '../constants';
import {IContextForUpdateAbilities} from '../types';

type IColorClearAbilityData = {
  isUsable: boolean;
  blockType: BlockType;
  progressCount: number;
  unlockThreshold: number;
};

const INITIAL_UNLOCK_THRESHOLD = 20;

export class ColorClearAbility
  extends UIBinder<IColorClearAbilityData>
  implements SpecialAbility<IColorClearAbilityData>
{
  data: IColorClearAbilityData;

  constructor(blockType: BlockType) {
    super();
    this.data = {
      isUsable: false,
      blockType,
      progressCount: 0,
      unlockThreshold: INITIAL_UNLOCK_THRESHOLD,
    };
  }

  update(context: IContextForUpdateAbilities) {
    // TODO
  }

  activate() {
    // TODO
  }

  getData(): IColorClearAbilityData {
    return this.data;
  }
}
