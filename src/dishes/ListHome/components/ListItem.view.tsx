import React, {useEffect, useMemo, useRef} from 'react';
import {StyleSheet, Text, View} from 'react-native';

type IProps = {
  value: number | string;
};

const ListItem: React.FC<IProps> = ({value}) => {
  useEffect(() => {
    console.log('LLLL MOUNT: ', value);
    return () => {
      console.log('LLLL UNMOUNT: ', value);
    };
  }, []);

  const valRef = useRef(value);

  const expensiveJSX = useMemo(
    () =>
      new Array(100).fill(1).map((item, index) => {
        return (
          <View
            style={{width: 2, height: 2, backgroundColor: 'red'}}
            key={index}></View>
        );
      }),
    [],
  );

  return (
    <View style={styles.container}>
      <Text>{valRef.current}</Text>
      {/* <View style={{flexDirection: 'row', gap: 1}}>{expensiveJSX}</View> */}
    </View>
  );
};

export default React.memo(ListItem);

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#55aadd',
    padding: 10,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    marginHorizontal: 10,
    marginVertical: 10,
  },
});
