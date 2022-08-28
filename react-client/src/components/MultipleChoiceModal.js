import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import './modal.css';
import useForm from './useForm';

export default function MultipleChoiceModal ({ visible, toggle, time, addInteractivity, editing }) {
  const initialState = {
    timestamp: 0,
    answers: ['']
  };

  const [state, setState] = useState(initialState);
  const [err, setErr] = useState([]);

  const initialFields = {
    question: '',
  };
  const [fields, setFields] = useState(initialFields);
  const [correct, setCorrect] = useState([false]);

  useEffect(() => {
    setState({ ...state, timestamp: Math.floor(time) });
  }, [time]);

  useEffect(() => {
    if (!editing || editing.kind != 'multiple') return;
    toggle();
    setState({
      timestamp: editing.timestamp,
      answers: [...editing.answers]
    });
    setFields({ question: editing.question });
    setCorrect(editing.correct);
  }, [editing]);

  const addCorrect = (event, i) => {
    // if (event.target.checked === true) {
    //   if (!correct.includes(state.answers[i])) {
    //     setCorrect([...correct, state.answers[i]]);
    //   }
    // } else {
    //   let removed = correct.filter(el => el !== state.answers[i] );
    //   setCorrect([...removed]);
    // }

    let checkboxes = [...correct];
    checkboxes[i] = event.target.checked;
    setCorrect(checkboxes);
  };

  const handleChange = (event) => {
    setFields({ ...fields, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    addInteractivity({
      kind: 'multiple',
      timestamp: state.timestamp,
      question: fields.question,
      answers: [...state.answers],
      correct: [...correct]
    });

    toggle();

    setFields(initialFields);
    setState({ ...state, answers: [''] });
    setCorrect([false]);
  }

  const addClick = () => {
    setState({ ...state, answers: [...state.answers, ''] });
    setCorrect([...correct, false]);
  }
  
  const removeClick = (event, i) => {
    let answers = [...state.answers];
    answers.splice(i,1);
    setState({ ...state, answers });

    let correctMutable = [...correct];
    correctMutable.splice(i,1);
    setCorrect(correctMutable);
  }

  const handleChangeAnswers = (event, i) => {
    let answers = [...state.answers];
    answers[i] = event.target.value;
    setState({ ...state, answers });
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
    return state.answers.map((el, i) =>
      <>
        <div key={i}>
          <input type="text" value={el || ''} onChange={(event) => handleChangeAnswers(event, i)} />
          <input type='button' value='Remove Answer' onClick={(event) => removeClick(event, i)} />
          <input type="checkbox" name="correct" checked={correct[i]} onChange={(event) => {addCorrect(event, i)}} />
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
        <h1>Add Multiple Choice Question</h1>

        <div>
          <label htmlFor="timestamp">Timestamp</label>
          <input type="text" name="timestamp" value={formatTimestamp(state.timestamp)} disabled />
        </div>

        <div>
          <label htmlFor="question">Question</label>
          <input type="text" name="question" value={fields.question} onChange={handleChange} placeholder="Question" />
        </div>
        
        <h1>Answers</h1>
        {createUI()}
        <div>
          <input type='button' value='Add Another Answer' onClick={addClick}/>
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