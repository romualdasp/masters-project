import { View, Text, Button, StyleSheet, Pressable } from 'react-native'
import React from 'react'
import { FontAwesome5 } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  const onRegister = () => {
    navigation.navigate('Register', { });
  };
  
  const onLogin = () => {
    navigation.navigate('Login', { });
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Welcome!</Text> */}

      <FontAwesome5 name="graduation-cap" size={60} color="#00a2ff" />

      <View style={styles.brandContainer}>
        <Text style={styles.brandBold}>Active</Text>
        <Text style={styles.brand}>Learn</Text>
      </View>

      <Pressable onPress={onRegister} style={styles.button}>
        <Text style={styles.buttonText}>REGISTER</Text>
      </Pressable>

      <Pressable onPress={onLogin} style={styles.button}>
        <Text style={styles.buttonText}>LOGIN</Text>
      </Pressable>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 80
  },
  brandBold: {
    fontSize: 28,
    color: "#00a2ff",
    fontWeight: 'bold'
  },
  brand: {
    fontSize: 28,
    color: "#00a2ff",
  },
  button: {
    borderRadius: 2,
    backgroundColor: "#0583d2",
    padding: 6,
    height: 40,
    width: '60%',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  buttonText: {
    color: 'white'
  },
  title: {
    fontSize: 28,
    marginBottom: 80
  },
});