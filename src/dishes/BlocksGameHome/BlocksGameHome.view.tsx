import React from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {GameBoard} from './components/GameBoard';
import gameManager from './core/managers/GameManager';
import {BlockSetPool} from './components/BlockSetPool';
import BoardHeader from './components/BoardHeader';
import {normalize} from '../../utils';

const TITLE = 'BLOCK-O-MANIA'; // Title for the game

const BlocksGameHome: React.FC = () => {
  // const gameManagerData = useUIBinder(gameManager);

  const renderTitle = () => (
    <View style={styles.titleContainer}>
      <Text style={styles.title}>{TITLE}</Text>
    </View>
  );

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
        {renderTitle()}
        <BoardHeader />
        <GameBoard boardManager={gameManager.getBoardManager()} />
        <BlockSetPool blockSetManager={gameManager.getBlockSetManager()} />
      </View>
    </GestureHandlerRootView>
  );
};

export default BlocksGameHome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  titleContainer: {
    marginVertical: normalize(16),
    alignItems: 'center',
  },
  title: {
    fontSize: normalize(24),
    fontWeight: 'bold',
    color: '#555',
    textAlign: 'center',
    letterSpacing: normalize(2),
  },
});
