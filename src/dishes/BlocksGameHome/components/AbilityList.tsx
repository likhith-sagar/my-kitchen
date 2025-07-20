import React, {useCallback} from 'react';
import gameManager from '../core/managers/GameManager';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {SpecialAbilityType} from '../core/constants';
import ColorClearAbility from './ColorClearAbility';
import {normalize} from '../../../utils';

type IAbilityListProps = {};

const AbilityList: React.FC<IAbilityListProps> = () => {
  const specialAbilityManager = gameManager.getSpecialAbilityManager();
  const abilityList = specialAbilityManager.getAbilityList();

  const renderAbility = useCallback(
    (ability: SpecialAbilityType) => {
      switch (ability) {
        case SpecialAbilityType.COLOR_CLEAR_PINK:
        case SpecialAbilityType.COLOR_CLEAR_BLUE:
        case SpecialAbilityType.COLOR_CLEAR_YELLOW:
          return (
            <TouchableOpacity
              key={ability}
              activeOpacity={0.7}
              onPress={() => gameManager.processAbility(ability)}>
              <ColorClearAbility
                ability={specialAbilityManager.getAbility(ability)}
              />
            </TouchableOpacity>
          );

        default:
          return <></>;
      }
    },
    [specialAbilityManager],
  );

  return (
    <View style={styles.container}>
      {abilityList.map(ability => renderAbility(ability))}
    </View>
  );
};

export default AbilityList;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: normalize(6),
  },
});
