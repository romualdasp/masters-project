import { View, Text, StyleSheet, SafeAreaView, Pressable, Modal, ScrollView, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import * as SecureStore from 'expo-secure-store'
import * as ScreenOrientation from 'expo-screen-orientation';
import { FontAwesome } from '@expo/vector-icons'
import axios from 'axios'
import { Video } from 'expo-av';
import RadioButtonGroup from './RadioButtonGroup'
import CheckboxGroup from './CheckboxGroup'
import MatchPairs from './MatchPairs'
import TextEntry from './TextEntry'

async function get(key) {
  return await SecureStore.getItemAsync(key);
}

// only required on Android to allow lecture playback in horizontal mode
const onFullscreenUpdate = async ({ fullscreenUpdate }) => {
  switch (fullscreenUpdate) {
      case Video.FULLSCREEN_UPDATE_PLAYER_DID_PRESENT:
          await ScreenOrientation.unlockAsync()
          break;
      case Video.FULLSCREEN_UPDATE_PLAYER_WILL_DISMISS:
          await ScreenOrientation.lockAsync(ScreenOrientation.OrientationLock.PORTRAIT)
          break;
  }
}

export default function LectureScreen({ navigation, route }) {
  const { video, course } = route.params;

  const [name, setName] = useState('');
  const [auth, setAuth] = useState('');
  const [interactivity, setInteractivity] = useState([]);
  const [responses, setResponses] = useState([]);

  const videoRef = React.useRef(null);
  const [status, setStatus] = useState({});

  const [modalVisible, setModalVisible] = useState(false);
  const [active, setActive] = useState(null);

  const [submission, setSubmission] = useState(null);
  const [existingSubmissions, setExistingSubmissions] = useState([]);

  const [loading, setLoading] = useState(true);
  
  const onPlayback = (status) => {
    setStatus(status);

    const currentTime = Math.floor(status.positionMillis / 1000);

    const active = interactivity.find((el) => (el.timestamp === currentTime && !el.activated));
    
    if (active) {
      setInteractivity(interactivity.map((el) => {
        return (el._id === active._id) ? { ...el, activated: true } : el;
      }));
      
      videoRef.current.pauseAsync();

      setActive(active);
      setModalVisible(true);
    }
  };

  const submitInteractivity = () => {
    setModalVisible(false);

    let result = {...active, submitted: submission.submitted, course: course._id};

    axios.post(`http://192.168.1.163:7000/api/mobile/submission/${video._id}/${active._id}`, { result: result },
      { headers: { 'auth-token': auth } })
      .then((response) => {
        fetchMySubmissions();
        videoRef.current.playAsync();
      }).catch((error) => {
        alert(error);
      });
  };

  const skipInteractivity = () => {
    setModalVisible(false);
    videoRef.current.playAsync();
  };

  const fetchMySubmissions = () => {
    axios.get(`http://192.168.1.163:7000/api/mobile/mysubmissions/${video._id}`,
      { headers: { 'auth-token': auth } })
      .then((response) => {
        setExistingSubmissions(response.data.submissions);
      }).catch((error) => {
        alert(error);
      });
  };

  const formatKind = (kind) => {
    if (kind === 'single') { return 'Single Choice Quiz'; }
    if (kind === 'multiple') { return 'Multiple Choice Quiz'; }
    if (kind === 'match') { return 'Match Pairs Activity'; }
    if (kind === 'text') { return 'Text Entry Activity'; }
    return '';
  };

  const formatTimestamp = (timestamp) => {
    return (new Date(timestamp * 1000)).toISOString().substr(11, 8);
  };

  useEffect(() => {
    get('auth-name').then((value) => setName(value));
    get('auth-token').then((value) => {
      setAuth(value);

      axios.get(`http://192.168.1.163:7000/api/mobile/interactivity/${video._id}`,
        { headers: { 'auth-token': value } })
        .then((response) => {
          
          setInteractivity(
            response.data.interactivity.map((el, i) => (
              {
                ...el,
                activated: (response.data.submissions.find(subm => subm.interactivity._id.toString() === el._id.toString()) ? true : false)
              }
            ))
          );
          setExistingSubmissions(response.data.submissions);
          setLoading(false);
        }).catch((error) => {
          alert(error);
        });
    });   
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.androidSafeArea}>
        <ScrollView style={styles.container}>
          <View style={{margin: 25}}>
            <ActivityIndicator size="large" color="#0583d2" />
          </View>
        </ScrollView>
      </SafeAreaView>
    )
  };

  return (
    <SafeAreaView style={styles.androidSafeArea}>
      <ScrollView style={styles.container}>
        
        <Video
          source={{ uri: `http://192.168.1.163:7000/files/${video.video}` }}
          ref={videoRef}
          rate={1.0}
          volume={1.0}
          isMuted={false}
          resizeMode="contain"
          style={styles.video}
          useNativeControls
          onPlaybackStatusUpdate={onPlayback}
          onFullscreenUpdate={onFullscreenUpdate}
          />

        <View style={styles.inset}>
          <Text style={styles.subtitle}>{video.title}</Text>

          {/* { interactivity.length > 0 &&
            interactivity.map((el) => (
              <Text key={el._id}>{el.kind} {formatTimestamp(el.timestamp)} {el.question} {el.activated.toString()}</Text>
            ))
          } */}

          {interactivity.length > 0 &&
            <View style={styles.infoContainer}>
              <FontAwesome name="info-circle" size={22} color="#bbb" />
              <Text style={styles.infoText}>This video is interactive - it contains {interactivity.length} interactive elements.</Text>
            </View>
          }

          {interactivity.length === 0 &&
            <View style={styles.infoContainer}>
              <FontAwesome name="info-circle" size={22} color="#bbb" />
              <Text style={styles.infoText}>This video is not interactive - ask the lecturer to include some interactive elements.</Text>
            </View>
          }

          <Text style={{ fontSize: 16, marginTop: 20, marginBottom: 10 }}>My Submissions</Text>

          { existingSubmissions.length > 0 &&
            <Text>
              You have participated in {existingSubmissions.length} interactive elements 
              and answered {existingSubmissions.filter((el) => el.score === 1).length} of them correctly.
            </Text>
          }

          { existingSubmissions.length > 0 &&
            existingSubmissions.map((el) => (
              <View key={el._id} style={styles.mySubmissionContainer}>
                { (el.score === 1) ?
                  <FontAwesome name="check-circle" size={24} color="#aaccaa"/> :
                  <FontAwesome name="times-circle" size={24} color="#ddaaaa" />
                }
                <Text style={styles.mySubmissionText}>
                  {formatKind(el.interactivity.kind)} - {formatTimestamp(el.interactivity.timestamp)} - {el.interactivity.question}
                  {el.interactivity.kind === 'single' && 
                    <Text>
                      {' '}Correct: {el.interactivity.answers[el.interactivity.correct]}
                    </Text>
                  }
                  {el.interactivity.kind === 'multiple' && 
                    <Text>
                      {' '}Correct: {el.interactivity.answers.filter((e, i) => el.interactivity.correct[i]).join(', ')}
                    </Text>
                  }
                  {el.interactivity.kind === 'match' && 
                    <Text>
                      {' '}Correct: {
                        el.interactivity.primary
                          .map((e, i) => el.interactivity.primary[i] + ' ' + el.interactivity.secondary[i])
                          .join(', ')
                      }
                    </Text>
                  }
                  {el.interactivity.kind === 'text' && 
                    <Text>
                      {' '}Correct: {el.interactivity.correct}
                    </Text>
                  }
                </Text>
              </View>
            ))
          }

          { existingSubmissions.length === 0 &&
            <Text>You have not participated in any interactive elements.</Text>
          }

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => { }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                
                <View>
                  <Text style={styles.modalTitle}>{formatKind(active?.kind)}</Text>

                  <Text style={styles.modalText}>{active?.question}</Text>

                  { active?.kind === 'single' &&
                    <RadioButtonGroup options={active.answers} onChange={(submitted) => setSubmission({ submitted: submitted })} />
                  }

                  { active?.kind === 'multiple' &&
                    <CheckboxGroup options={active.answers} onChange={(submitted) => setSubmission({ submitted: submitted })} />
                  }

                  { active?.kind === 'match' &&
                    <MatchPairs
                      options={active}
                      onChange={(submitted) => setSubmission({ submitted: submitted })}
                      />
                  }

                  { active?.kind === 'text' &&
                    <TextEntry onChange={(submitted) => setSubmission({ submitted: submitted })} />
                  }

                </View>
                

                <View style={styles.modalButtons}>
                  <Pressable
                    style={[styles.button, styles.buttonSkip]}
                    onPress={() => skipInteractivity()}
                  >
                    <Text style={styles.textStyle}>Skip</Text>
                  </Pressable>

                  <View style={{ width: 10 }}></View>

                  <Pressable
                    style={[styles.button, styles.buttonSubmit]}
                    onPress={() => submitInteractivity()}
                  >
                    <Text style={styles.textStyle}>Submit</Text>
                  </Pressable>
                </View>

              </View>
            </View>

          </Modal>
          
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
    margin: 16,
  },
  video: {
    // width: 290,
    // height: 200,
    width: "100%",
    aspectRatio: (16 / 9),
    // height: Dimensions.get('window').width / (16 / 9)
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "stretch",
  },
  modalView: {
    marginHorizontal: 40,
    marginVertical: 100,
    // flexGrow: 1, // full screen modal
    // borderRadius: 20,
    backgroundColor: "white",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    alignItems: "stretch",
  },
  button: {
    padding: 10,
    flexGrow: 1
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  buttonSubmit: {
    backgroundColor: "#2196F3",
  },
  buttonSkip: {
    backgroundColor: "#AAAAAA",
    paddingHorizontal: 18
  },
  modalButtons: {
    display: 'flex',
    flexDirection: 'row',
  },
  modalTitle: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 22,
    marginBottom: 30,
  },
  modalText: {
    marginBottom: 20,
    fontSize: 15,
    textAlign: 'center'
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  infoText: {
    flex: 1,
    flexWrap: 'wrap',
    marginLeft: 10,
  },
  mySubmissionContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10
  },
  mySubmissionText: {
    flex: 1,
    flexWrap: 'wrap',
    marginLeft: 10,
  },
});
