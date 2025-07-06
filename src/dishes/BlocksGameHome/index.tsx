import React from 'react';
import {View, StyleSheet} from 'react-native';
import {GameBoard} from './components/GameBoard';
import {BlockSetPool} from './components/BlockSetPool';
import {useGameManager} from './hooks/useGameManager';
import {BlockSetConfig} from './core/types';

const INITIAL_CONFIG = {
  boardWidth: 10,
  boardHeight: 20,
  blockSize: 30,
};

const INITIAL_BLOCK_SETS: BlockSetConfig[] = [
  // We'll add initial block sets configuration later
];

export const BlocksGameHome: React.FC = () => {
  const {getBoardManager, getBlockSetManager} = useGameManager(
    INITIAL_CONFIG,
    INITIAL_BLOCK_SETS,
  );

  return (
    <View style={styles.container}>
      <GameBoard boardManager={getBoardManager()!} />
      <BlockSetPool blockSetManager={getBlockSetManager()!} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
