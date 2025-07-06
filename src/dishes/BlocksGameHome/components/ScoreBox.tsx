import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {normalize} from '../../../utils';
import gameManager from '../core/managers/GameManager';
import {useUIBinder} from '../hooks/useUIBinder';

const ScoreBox: React.FC = () => {
  const {score} = useUIBinder(gameManager);

  return (
    <View style={styles.container}>
      <View style={styles.scoreContainer}>
        <Text style={styles.scoreLabelText}>score</Text>
        <Text style={styles.scoreValueText}>{score}</Text>
      </View>
    </View>
  );
};

export default ScoreBox;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    backgroundColor: '#ccc',
    paddingVertical: normalize(6),
    borderRadius: normalize(6),
  },
  scoreContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    alignSelf: 'flex-end',
    paddingHorizontal: normalize(12),
  },
  scoreLabelText: {
    fontSize: normalize(14),
  },
  scoreValueText: {
    fontSize: normalize(18),
    fontWeight: 'bold',
  },
});
