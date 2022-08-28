import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import './modal.css';
import useForm from './useForm';

export default function MatchPairsModal ({ visible, toggle, time, addInteractivity, editing }) {
  const initialState = {
    timestamp: 0,
    primary: ['', '', ''],
    secondary: ['', '', '']
  };

  const [state, setState] = useState(initialState);
  const [err, setErr] = useState([]);

  const initialFields = {
    question: 'Please match the respective pairs.',
  };
  const [fields, setFields] = useState(initialFields);

  useEffect(() => {
    setState({ ...state, timestamp: Math.floor(time) });
  }, [time]);

  useEffect(() => {
    if (!editing || editing.kind != 'match') return;
    toggle();
    setState({
      timestamp: editing.timestamp,
      primary: [...editing.primary],
      secondary: [...editing.secondary],
    });
    setFields({ question: editing.question });
  }, [editing]);

  const handleChange = (event) => {
    setFields({ ...fields, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    addInteractivity({
      kind: 'match',
      timestamp: state.timestamp,
      question: fields.question,
      primary: [...state.primary],
      secondary: [...state.secondary]
    });

    toggle();

    setFields(initialFields);
    setState({ ...state, primary: ['', '', ''], secondary: ['', '', ''] });
  }

  const handleChangePrimary = (event, i) => {
    let primary = [...state.primary];
    primary[i] = event.target.value;
    setState({ ...state, primary });
  }

  const handleChangeSecondary = (event, i) => {
    let secondary = [...state.secondary];
    secondary[i] = event.target.value;
    setState({ ...state, secondary });
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

  const createUI = () => {
    return state.primary.map((el, i) =>
      <>
        <div key={i}>
          <input type="text" value={el || ''} onChange={(event) => handleChangePrimary(event, i)} />
          <input type="text" value={state.secondary[i] || ''} onChange={(event) => handleChangeSecondary(event, i)} />
        </div>
      </>
    )
  };

  const formatTimestamp = (timestamp) => {
    return (new Date(timestamp * 1000)).toISOString().substr(11, 8);
  };

  return (
    <Modal visible={visible} toggle={toggle}>
      <form onSubmit={handleSubmit} className="form-no-border">
        <h1>Add Match Pairs Activity</h1>

        <div>
          <label htmlFor="timestamp">Timestamp</label>
          <input type="text" name="timestamp" value={formatTimestamp(state.timestamp)} disabled />
        </div>

        <div>
          <label htmlFor="question">Question</label>
          <input type="text" name="question" value={fields.question} onChange={handleChange} placeholder="Question" />
        </div>
        
        <h1>Pairs</h1>
        {createUI()}
        
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