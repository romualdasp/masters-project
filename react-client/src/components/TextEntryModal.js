import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import './modal.css';
import useForm from './useForm';

export default function TextEntryModal ({ visible, toggle, time, addInteractivity, editing }) {
  const initialState = {
    timestamp: 0
  };

  const [state, setState] = useState(initialState);
  const [err, setErr] = useState([]);

  const initialFields = {
    question: '',
    correct: ''
  };
  const [fields, setFields] = useState(initialFields);

  useEffect(() => {
    setState({ ...state, timestamp: Math.floor(time) });
  }, [time]);

  useEffect(() => {
    if (!editing || editing.kind != 'text') return;
    toggle();
    setState({
      timestamp: editing.timestamp
    });
    setFields({ question: editing.question, correct: editing.correct });
  }, [editing]);

  const handleChange = (event) => {
    setFields({ ...fields, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    addInteractivity({
      kind: 'text',
      timestamp: state.timestamp,
      question: fields.question,
      correct: fields.correct
    });

    toggle();

    setFields(initialFields);
  }

  const checkMissing = (values) => {
    let missing = [];
    let containsMissing = false;

    for (let i = 0; i < values.length; i++) {
      if (values[i] === '') {
        missing[i] = 'Please enter a valid answer.';
        containsMissing = true;
      } else {
        missing[i] = '';
      }
    }

    if (containsMissing) return missing;

    return null;
  };

  const formatTimestamp = (timestamp) => {
    return (new Date(timestamp * 1000)).toISOString().substr(11, 8);
  };

  return (
    <Modal visible={visible} toggle={toggle}>
      <form onSubmit={handleSubmit} className="form-no-border">
        <h1>Add Text Entry Activity</h1>

        <div>
          <label htmlFor="timestamp">Timestamp</label>
          <input type="text" name="timestamp" value={formatTimestamp(state.timestamp)} disabled />
        </div>

        <div>
          <label htmlFor="question">Question</label>
          <input type="text" name="question" value={fields.question} onChange={handleChange} placeholder="Question" />
        </div>
        
        <h1>Answer</h1>
        <div>
          <label htmlFor="answer">Answer</label>
          <input type="text" name="correct" value={fields.correct} onChange={handleChange} placeholder="Answer" />
        </div>
        
        <div className='form-button-centered'>
          <input type="submit" value="Add" />
        </div>
      </form>
    </Modal>
  );
};

/*
<div>
  <label htmlFor="answers">Answer</label>
  <input type="text" name="answers" value={state.answers} onChange={handleChange} placeholder="Answer" />
</div>
*/