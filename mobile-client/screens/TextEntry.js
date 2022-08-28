import { View, Text, TextInput, StyleSheet } from 'react-native'
import React, { useState, useEffect } from 'react'

export default function TextEntry({ onChange }) {
  const [entry, setEntry] = useState('');

  const handleInput = (input) => {
    setEntry(input);
    onChange(input);
  };

  return (
    <View style={styles.wrapper}>

      <TextInput
        style={styles.input}
        placeholder=""
        placeholderTextColor="#aaa"
        onChangeText={(input) => handleInput(input)}
        />

    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 30,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    flexWrap: 'wrap',
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
});
