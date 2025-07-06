import {SpecialAbility} from '../base/SpecialAbility';
import {BlockType, SpecialAbilityType} from '../constants';
import {ColorClearAbility} from '../entities/ColorClearAbility';
import {IContextForUpdateAbilities} from '../types';

export class SpecialAbilityManager {
  private abilityList = [
    SpecialAbilityType.COLOR_CLEAR_PINK,
    SpecialAbilityType.COLOR_CLEAR_YELLOW,
    SpecialAbilityType.COLOR_CLEAR_BLUE,
  ];

  private abilitiesMap = {
    [SpecialAbilityType.COLOR_CLEAR_PINK]: new ColorClearAbility(
      BlockType.PINK,
    ),
    [SpecialAbilityType.COLOR_CLEAR_YELLOW]: new ColorClearAbility(
      BlockType.YELLOW,
    ),
    [SpecialAbilityType.COLOR_CLEAR_BLUE]: new ColorClearAbility(
      BlockType.BLUE,
    ),
  };

  getAbilityList() {
    return this.abilityList;
  }

  getAbility(abilityType: SpecialAbilityType) {
    return this.abilitiesMap[abilityType];
  }

  private getContextForUpdateAbilities(): IContextForUpdateAbilities {
    // TODO: get context from statsManager
    return {
      blocksAddedTillNow: {
        [BlockType.PINK]: 0,
        [BlockType.YELLOW]: 0,
        [BlockType.BLUE]: 0,
      },
      blocksDestroyedTillNow: {
        [BlockType.PINK]: 0,
        [BlockType.YELLOW]: 0,
        [BlockType.BLUE]: 0,
      },
    };
  }

  updateAbilities() {
    const context = this.getContextForUpdateAbilities();
    this.abilityList.forEach(ability =>
      this.abilitiesMap[ability].update(context),
    );
  }
}
