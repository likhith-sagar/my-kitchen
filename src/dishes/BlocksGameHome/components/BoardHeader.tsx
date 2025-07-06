import React from 'react';
import {StyleSheet, View} from 'react-native';
import {normalize} from '../../../utils';
import AbilityList from './AbilityList';
import ScoreBox from './ScoreBox';

// TODO: rename BoardHeader
const BoardHeader = () => {
  return (
    <View style={styles.container}>
      <AbilityList />
      <ScoreBox />
    </View>
  );
};

export default BoardHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    margin: normalize(16),
    width: '95%',
    gap: normalize(8),
  },
});
