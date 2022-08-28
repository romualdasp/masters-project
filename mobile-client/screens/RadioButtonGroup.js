import { View, Text, StyleSheet, SafeAreaView, Pressable, Modal } from 'react-native'
import React, { useState, useEffect } from 'react'
import { FontAwesome5 } from '@expo/vector-icons'

export default function RadioButtonGroup({ options, onChange }) {
  const [selected, setSelected] = useState(0);

  const select = (value) => {
    setSelected(value);
    onChange(value);
  };

  return (
    <View style={styles.wrapper}>
      {options.map((option, index) => {
        return (
          <Pressable
            key={index}
            style={styles.option}
            onPress={() => select(index)}
          >

            <Text style={styles.optionText}>{option}</Text>

            <View style={styles.optionButton}>
              {index === selected &&
                <FontAwesome5 name="check-circle" size={30} color="#555" />
              }
              {index !== selected &&
                <FontAwesome5 name="circle" size={30} color="#888" />
              }
            </View>

          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 30,
  },
  option: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // backgroundColor: '#888',
    // borderColor: '#000',
    // borderWidth: 1,
  },
  optionButton: {
    width: 40,
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    // backgroundColor: '#aaa',
  },
  optionText: {
    flex: 1,
    flexWrap: 'wrap'
  },
});
