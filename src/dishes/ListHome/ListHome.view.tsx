import React, {useCallback, useRef, useState} from 'react';
import {Alert, Button, FlatList, StyleSheet, View} from 'react-native';
import ListItem from './components/ListItem.view';
import {FlashList, useBenchmark} from '@shopify/flash-list';

const itemCount = 1000;

const ListHome = () => {
  const [listItems, setListItems] = useState(() => {
    const items = [];
    for (let i = 0; i < itemCount; i++) {
      items.push(i);
    }
    return items;
  });

  const listRef = useRef<any>(null);

  const handleClick = () => {
    setListItems(curVal => {
      const [first, ...rest] = curVal;
      return rest;
    });
  };

  const renderItem = useCallback(({item}) => {
    console.log('LLLL CALLED RENDER ITEM: ', item);
    return <ListItem value={item} />;
  }, []);

  const keyExtractor = useCallback(item => {
    return item;
  }, []);

  return (
    <View style={styles.container}>
      <Button title="click" onPress={handleClick} />
      <FlashList
        ref={listRef}
        // contentContainerStyle={styles.list}
        data={listItems}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        windowSize={1.4}
        estimatedItemSize={70}
      />
    </View>
  );
};

export default ListHome;

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    flex: 1,
    // backgroundColor: 'g',
  },
  list: {
    gap: 10,
  },
});
