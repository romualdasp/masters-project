import React, { useState, useRef, useEffect } from 'react';
import { Routes, Route, Link, useParams } from 'react-router-dom'
import SingleChoiceModal from './SingleChoiceModal.js';
import MultipleChoiceModal from './MultipleChoiceModal.js';
import MatchPairsModal from './MatchPairsModal.js';
import TextEntryModal from './TextEntryModal.js';
import useGetRequest from './useGetRequest.js';
import Spinner from './Spinner.js';
import useModal from './useModal.js';
import Modal from './Modal.js';
import useForm from './useForm.js';
import axios from 'axios';
import useAuth from './useAuth.js';

export default function InteractivityEditor() {
  const { id } = useParams();
  
  const videoRef = useRef(null);
  const [videoTime, setVideoTime] = useState(0);
  const [data, error, loading] = useGetRequest(`/api/interactivity/0/${id}`);

  const [visibleSingle, toggleSingle] = useModal();
  const [visibleMultiple, toggleMultiple] = useModal();
  const [visibleMatch, toggleMatch] = useModal();
  const [visibleText, toggleText] = useModal();

  const [interactivity, setInteractivity] = useState([]);
  const [auth] = useAuth();

  useEffect(() => {
    if (!data?.interactivity) return;
    setInteractivity([...data.interactivity]);
  }, [data]);

  const pauseVideo = () => {
    videoRef.current.pause();
    setVideoTime(videoRef.current.currentTime);
  };

  const showModalSingle = () => { pauseVideo(); toggleSingle(); };
  const showModalMultiple = () => { pauseVideo(); toggleMultiple(); };
  const showModalMatch = () => { pauseVideo(); toggleMatch(); };
  const showModalText = () => { pauseVideo(); toggleText(); };

  const [editing, setEditing] = useState(null);

  const addInteractivity = (interactivity) => {
    axios.post(`http://localhost:7000/api/interactivity/0/create/${id}`, interactivity,
      { headers: { 'auth-token': auth } })
      .then((res) => {
        console.log(res.data);
        setInteractivity([...res.data.interactivity]);
      }).catch((error) => {
        console.log(error);
      });
  };

  const deleteInteractivity = (interactivityId) => {
    axios.post(`http://localhost:7000/api/interactivity/0/delete/${id}/${interactivityId}`, {},
    { headers: { 'auth-token': auth } })
    .then((res) => {
      console.log(res.data);
      setInteractivity([...res.data.interactivity]);
    }).catch((error) => {
      console.log(error);
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

  if (loading) return <Spinner />;
  if (error) return 'Ooops there has been an error.';

  return (
    <div className="container">

      <h3>Interactivity Editor</h3>
      <h4>Currently Editing {data?.video?.title}</h4>
      
      {data?.video?.video &&
        <div>
          <video id="vid" ref={videoRef} width="620" controls>
            <source src={`http://localhost:7000/files/${data.video.video}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
      }

      <div className="flex-row">
        <SingleChoiceModal visible={visibleSingle} toggle={toggleSingle} time={videoTime} addInteractivity={addInteractivity} editing={editing}/>
        <button type="button" onClick={showModalSingle}>Add Single Choice Quiz</button>
        
        <MultipleChoiceModal visible={visibleMultiple} toggle={toggleMultiple} time={videoTime} addInteractivity={addInteractivity} editing={editing}/>
        <button type="button" onClick={showModalMultiple}>Add Multiple Choice Quiz</button>
      </div>

      <div className="flex-row" style={{marginTop:4}}>
        <MatchPairsModal visible={visibleMatch} toggle={toggleMatch} time={videoTime} addInteractivity={addInteractivity} editing={editing} />
        <button type="button" onClick={showModalMatch}>Add Match Pairs Activity</button>

        <TextEntryModal visible={visibleText} toggle={toggleText} time={videoTime} addInteractivity={addInteractivity} editing={editing} />
        <button type="button" onClick={showModalText}>Add Text Entry Activity</button>
      </div>

      <h4>Interactivity</h4>

      <div>
        {interactivity.map(el => {
          return (
            <div>
              <p style={{ display: 'inline' }}>{formatTimestamp(el.timestamp)} <b>{formatKind(el.kind)}</b> {el.question}</p>
              <i className="fa-solid fa-pen-to-square mh-s" onClick={(event) => setEditing({...el})}></i>
              <i className="fa-solid fa-trash mh-s" onClick={(event) => deleteInteractivity(el._id)}></i>
            </div>
          )
        })}
        { interactivity.length === 0 &&
          <p>No interactivity has been added. Add interactivity using the buttons above.</p>
        }
      </div>

    </div>
  );
};

/*
res.data.interactivity.map(el => ({ ...el, activated: false }))
*/