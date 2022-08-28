import React, { useEffect, useState } from 'react'
import useModal from './useModal'
import Modal from './Modal';
import BarChart from './BarChart';
import axios from 'axios';
import useAuth from './useAuth';

export default function StudentInfo({ studentId }) {
  const [visible, toggle] = useModal();
  const [auth] = useAuth();
  const [studentScores, setStudentScores] = useState([]);
  const [studentName, setStudentName] = useState('');

  useEffect(() => {
    fetchPerStudentScores(studentId);
  }, [studentId])

  const fetchPerStudentScores = (id) => {
    axios.get(`http://localhost:7000/api/scores/student/${id}`,
      { headers: { 'auth-token': auth } })
      .then((res) => {
        setStudentScores(res.data.scores);
        setStudentName(res.data.studentName);
      }).catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <button style={{background: 'none', color: 'black', border: 'none', padding: '0 8px'}} onClick={toggle}>
        <i className="fa-solid fa-ellipsis-vertical"></i>
      </button>

      <Modal visible={visible} toggle={toggle}>
        <h3>{studentName}</h3>
        <p style={{marginBottom: 30}}>Student: {studentName}</p>
        
        <div className='table' style={{width:680}}>
          <div>Course</div>
          <div>Engagement</div>
          <div>Score</div>

          { studentScores.length > 0 &&
            studentScores.map((score) => {
              return (
                <>
                  <div>{score.title}</div>
                  <div className="flex-row">
                    <BarChart percentage={score.engagementPercentage} />
                    {score.engagementPercentage}%
                    <div className='grey'>{score.engagement}/{score.total}</div>
                  </div>
                  <div className="flex-row">
                    <BarChart percentage={score.scorePercentage} />
                    {score.scorePercentage}%
                    <div className='grey'>{score.score}/{score.engagement}</div>
                  </div>
                </>
              );
            })
          }
        </div>
      </Modal>
    </>
    
  )
}
