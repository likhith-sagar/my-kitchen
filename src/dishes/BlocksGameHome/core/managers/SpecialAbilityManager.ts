import {BlockType, SpecialAbilityType} from '../constants';
import {ColorClearAbility} from '../entities/ColorClearAbility';

export class SpecialAbilityManager {
  private abilityList = [
    SpecialAbilityType.COLOR_CLEAR_PINK,
    SpecialAbilityType.COLOR_CLEAR_YELLOW,
    SpecialAbilityType.COLOR_CLEAR_BLUE,
  ];

  private abilitiesMap = {
    [SpecialAbilityType.COLOR_CLEAR_PINK]: new ColorClearAbility(
      SpecialAbilityType.COLOR_CLEAR_PINK,
    ),
    [SpecialAbilityType.COLOR_CLEAR_YELLOW]: new ColorClearAbility(
      SpecialAbilityType.COLOR_CLEAR_YELLOW,
    ),
    [SpecialAbilityType.COLOR_CLEAR_BLUE]: new ColorClearAbility(
      SpecialAbilityType.COLOR_CLEAR_BLUE,
    ),
  };

  getAbilityList() {
    return this.abilityList;
  }

  getAbility(abilityType: SpecialAbilityType) {
    return this.abilitiesMap[abilityType];
  }

  updateAbilities() {
    this.abilityList.forEach(ability => this.abilitiesMap[ability].update());
  }

  processAbility(abilityType: SpecialAbilityType) {
    const ability = this.getAbility(abilityType);
    if (ability) {
      ability.process();
    }
  }
}
