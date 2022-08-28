import { View, Text, TextInput, StyleSheet } from 'react-native'
import React, { useState, useEffect } from 'react'

export default function MatchPairs({ options, onChange }) {
  const [entries, setEntries] = useState([]);
  const [randomSecondary, setRandomSecondary] = useState([]);

  const shuffle = (array) => {
    return array
      .map(value => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value);
  };

  useEffect(() => {
    if (!options) return;
    setEntries([...Array(options.primary.length)].map((el) => ''));

    if (randomSecondary.length === 0) {
      setRandomSecondary(shuffle(options.secondary));
    }
  }, [options]);

  const handleInput = (input, index) => {
    let mutable = [...entries];
    mutable[index] = input;
    setEntries(mutable);
    onChange(mutable);
  };

  return (
    <View style={styles.wrapper}>
      <Text style={styles.optionsText}>Choose From: {randomSecondary.join(', ')}</Text>

      {options.primary.map((option, index) => {
        return (
          <View
            key={index}
            style={styles.option}
          >

            <Text style={styles.primaryText}>{option}</Text>
            <TextInput
              style={styles.secondaryInput}
              placeholder=""
              placeholderTextColor="#aaa"
              onChangeText={(input) => handleInput(input, index)}
              />

          </View>
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
    paddingVertical: 2
  },
  optionButton: {
    width: 40,
    height: 40,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
    // backgroundColor: '#aaa',
  },
  optionsText: {
    marginBottom: 20
  },
  primaryText: {
    flex: 1,
    flexWrap: 'wrap'
  },
  secondaryInput: {
    flex: 1,
    flexWrap: 'wrap',
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8
  },
});
