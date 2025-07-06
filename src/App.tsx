import React from 'react';

import ListHome from './dishes/ListHome/ListHome.view';
import BlocksGameHome from './dishes/BlocksGameHome/BlocksGameHome.view';
import {SafeAreaView, StyleSheet} from 'react-native';

const App: React.FC = () => {
  return (
    // <ListHome />
    <SafeAreaView style={styles.container}>
      <BlocksGameHome />
    </SafeAreaView>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
