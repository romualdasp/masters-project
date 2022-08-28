import { View, Text, Button, StyleSheet, TextInput, Pressable } from 'react-native'
import React, { useState } from 'react'
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

async function save(key, value) {
  await SecureStore.setItemAsync(key, value);
}

export default function LoginScreen({ navigation, route }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const onSubmit = () => {
    axios.post('http://192.168.1.163:7000/student/login', { email, password })
      .then((response) => {
        save('auth-token', response.data.token);
        save('auth-name', response.data.student.name);
        save('auth-email', response.data.student.email);

        navigation.navigate('Dashboard', { });
      }).catch((error) => {
        setError(error.response.data);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login to your account</Text>

      { route.params.registerSuccess &&
        <Text style={styles.success}>Successfully registered! Please login.</Text>
      }

      { (error != '') &&
        <Text style={styles.error}>{ error }</Text>
      }

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#aaa"
          onChangeText={(email) => setEmail(email)}
        />
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
      </View>

      <Pressable onPress={onSubmit} style={styles.button}>
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
  title: {
    fontSize: 28,
    marginBottom: 30
  },
  inputContainer: {
    width: 260,
    height: 50,
    marginBottom: 10
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
    paddingHorizontal: 10
  },
  submitButton: {
    marginTop: 20,
  },
  success: {
    padding: 10,
    color: '#22aa22',
    marginVertical:10,
  },
  error: {
    padding: 10,
    color: '#dd4444',
    marginVertical:10,
  },
  button: {
    borderRadius: 2,
    backgroundColor: "#0583d2",
    padding: 6,
    height: 40,
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 10,
  },
  buttonText: {
    color: 'white'
  },
});