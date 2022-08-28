import { View, Text, StyleSheet, Platform, StatusBar, SafeAreaView, Image, Button, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import * as SecureStore from 'expo-secure-store'
import { FontAwesome5 } from '@expo/vector-icons'
import axios from 'axios'

async function get(key) {
  return await SecureStore.getItemAsync(key);
}

export default function DashboardScreen({ navigation, route }) {
  const [name, setName] = useState('');
  const [auth, setAuth] = useState('');
  const [courses, setCourses] = useState(null);

  const onOpenCourse = (course) => {
    navigation.navigate('Contents', { _id: course._id, course });
  };

  useEffect(() => {
    get('auth-name').then((value) => setName(value));
    get('auth-token').then((value) => {
      setAuth(value);

      axios.get('http://192.168.1.163:7000/api/mobile/courses',
        { headers: { 'auth-token': value } })
        .then((response) => {
          setCourses(response.data.courses);
        }).catch((error) => {
          alert(error);
        });
    });   
  }, []);

  return (
    <SafeAreaView style={styles.androidSafeArea}>
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.inline}>
            <Text style={styles.username}>{name}</Text>
            <FontAwesome5 name="user-circle" size={24} color="black" />
          </View>
        </View>
        
        <View style={styles.inset}>
          <Text style={styles.subtitle}>My Courses</Text>

          { courses &&
            courses.map(course => (
              <View key={course._id} style={styles.courseCard}>
                <Image
                  style={styles.courseImage}
                  source={{ uri: `http://192.168.1.163:7000/files/${course.image}` }}
                />
                <Text style={styles.cardTitle}>{course.title}</Text>
                <Text style={styles.cardBody}>{course.description}</Text>

                <View style={styles.cardBody}>
                  <Button
                    title="Open Course"
                    color="#0583d2"
                    onPress={() => onOpenCourse(course)}
                  />
                </View>
              </View>
              
            ))
          }

        </View>
      </ScrollView>
    </SafeAreaView>

  );
}

const styles = StyleSheet.create({
  androidSafeArea: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    marginBottom: 30
  },
  subtitle: {
    fontSize: 22,
    marginBottom: 10
  },
  header: {
    borderBottomColor: '#ddd',
    borderBottomWidth: 1
  },
  inline: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    margin: 10,
  },
  username: {
    marginRight: 10,
  },
  inset: {
    margin: 10
  },
  courseImage: {
    width: '100%',
    resizeMode: 'cover',
    height: 150,
  },
  courseCard: {
    shadowColor: 'black',
    shadowOpacity: 0.26,
    shadowOffset: { width: 0, height: 2},
    shadowRadius: 10,
    elevation: 3,
    backgroundColor: 'white',
    borderRadius: 5,
    overflow: 'hidden',
    margin: 20,
    marginTop: 0
  },
  cardTitle: {
    padding: 10,
    fontSize: 18
  },
  cardBody: {
    padding: 10,
    textAlign: 'justify',
  },
});
