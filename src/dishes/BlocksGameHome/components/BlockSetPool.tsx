import React from 'react';
import {StyleSheet, View} from 'react-native';
import {normalize} from '../../../utils';
import {BlockSetManager} from '../core/managers/BlockSetManager';
import {useUIBinder} from '../hooks/useUIBinder';
import BlockSetComponent from './BlockSet';

type BlockSetPoolProps = {
  blockSetManager: BlockSetManager;
};

export const BlockSetPool: React.FC<BlockSetPoolProps> = ({
  blockSetManager,
}) => {
  const {blockSets} = useUIBinder(blockSetManager);

  return (
    <View style={styles.container}>
      {blockSets.map(blockSet => (
        <BlockSetComponent key={blockSet.getData().id} blockSet={blockSet} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#ccc',
    borderRadius: normalize(10),
    flexDirection: 'row',
    width: '90%',
    minHeight: normalize(90),
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: normalize(40),
  },
});
