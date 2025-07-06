import React from 'react';
import {StyleSheet, View} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {GameBoard} from './components/GameBoard';
import gameManager from './core/managers/GameManager';
import {BlockSetPool} from './components/BlockSetPool';
import BoardHeader from './components/BoardHeader';

const BlocksGameHome: React.FC = () => {
  // const gameManagerData = useUIBinder(gameManager);

  return (
    <GestureHandlerRootView>
      <View style={styles.container}>
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
});
