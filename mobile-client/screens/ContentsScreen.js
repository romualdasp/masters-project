import { View, Text, StyleSheet, Platform, StatusBar, SafeAreaView, Image, Button, Pressable, ScrollView, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import * as SecureStore from 'expo-secure-store'
import { FontAwesome5 } from '@expo/vector-icons'
import axios from 'axios'
import { Video } from 'expo-av';

async function get(key) {
  return await SecureStore.getItemAsync(key);
}

export default function ContentsScreen({ navigation, route }) {
  const { _id, course } = route.params;

  const [name, setName] = useState('');
  const [auth, setAuth] = useState('');
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);

  const onPlayback = (status) => { };

  useEffect(() => {
    get('auth-name').then((value) => setName(value));
    get('auth-token').then((value) => {
      setAuth(value);

      axios.get(`http://192.168.1.163:7000/api/mobile/course/${_id}`,
        { headers: { 'auth-token': value } })
        .then((response) => {
          setContents(response.data.content);
          setLoading(false);
        }).catch((error) => {
          alert(error);
        });
    });   
  }, []);

  return (
    <SafeAreaView style={styles.androidSafeArea}>
      <ScrollView style={styles.container}>
        
        <View style={styles.inset}>
          { loading && 
            <View style={{margin: 25}}>
              <ActivityIndicator size="large" color="#0583d2" />
            </View>
          }

          { !loading && 
            <Text style={styles.subtitle}>{course.title}</Text>
          }

          { !loading && contents.length > 0 &&
            contents.map(content => {
              switch(content.kind) {
                case 'heading':
                  return (
                    <Text key={content._id} style={styles.contentTitle}>{content.value}</Text>
                  );
                  break;
                case 'paragraph':
                  return (
                    <Text key={content._id} style={styles.contentParagraph}>{content.value}</Text>
                  );
                  break;
                case 'video':
                  return (
                    <Pressable
                      key={content._id}
                      onPress={() => navigation.navigate('Lecture', { video: content, course: course })}
                      style={styles.contentVideo}
                    >
                      <Video
                        source={{ uri: `http://192.168.1.163:7000/files/${content.video}` }}
                        rate={1.0}
                        volume={1.0}
                        isMuted={false}
                        resizeMode="contain"
                        style={styles.video}
                        onPlaybackStatusUpdate={onPlayback}
                        />
                    </Pressable>
                  );
                  break;
                default:
                return null;
              }
            })
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
    marginBottom: 24,
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
    margin: 10,
    display: 'flex',
    flexDirection: 'column',
  },
  video: {
    width: "80%",
    aspectRatio: (16 / 9),
    alignSelf: 'center',
  },
  contentSeparator: {
    borderTopColor: '#ccc',
    borderTopWidth: 1,
    paddingTop: 16,
    marginHorizontal: 10
  },
  contentTitle: {
    fontSize: 18,
    marginBottom: 16,
    marginHorizontal: 10
  },
  contentParagraph: {
    marginBottom: 18,
    textAlign: 'justify',
    marginHorizontal: 10
  },
  contentVideo: {
    marginBottom: 16,
    marginHorizontal: 10,
  },
});
