import React, {useCallback, useMemo} from 'react';
import {BlockType, SpecialAbilityType} from '../core/constants';
import {ColorClearAbility as ColorClearAbilityEntity} from '../core/entities/ColorClearAbility';
import {Image, StyleSheet, Text, View} from 'react-native';
import {normalize} from '../../../utils';
import {useUIBinder} from '../hooks/useUIBinder';
import {ASSETS_IMAGES} from '../../../assets';

type IColorClearAbilityProps = {
  ability: ColorClearAbilityEntity;
  abilityType: SpecialAbilityType;
};

const ColorClearAbility: React.FC<IColorClearAbilityProps> = ({
  ability,
  abilityType,
}) => {
  const {blockType, progressCount, unlockThreshold, isUsable} =
    useUIBinder(ability);

  const iconSrc = useMemo(() => {
    switch (blockType) {
      case BlockType.PINK:
        return ASSETS_IMAGES.pinkColorClear;
      case BlockType.YELLOW:
        return ASSETS_IMAGES.yellowColorClear;
      case BlockType.BLUE:
        return ASSETS_IMAGES.blueColorClear;
    }
  }, [blockType]);

  const textValue = isUsable ? 'Ready!' : `${progressCount}/${unlockThreshold}`;

  return (
    <View style={styles.container}>
      <Image source={iconSrc} style={styles.iconImage} />
      <Text style={styles.text}>{textValue}</Text>
    </View>
  );
};

export default ColorClearAbility;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: normalize(2),
    padding: normalize(4),
    backgroundColor: '#ffffff55',
    borderRadius: normalize(4),
    borderColor: '#00000055',
    borderWidth: 0.5,
  },
  iconImage: {
    width: normalize(32),
    height: normalize(32),
    borderRadius: normalize(4),
  },
  text: {
    fontSize: normalize(10),
  },
});
