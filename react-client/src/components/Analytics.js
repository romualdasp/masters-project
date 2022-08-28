import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import BarChart from './BarChart';
import PieChart from './PieChart';
import Spinner from './Spinner';
import useAuth from './useAuth';
import axios from 'axios';
import StudentInfo from './StudentInfo';

export default function Analytics() {
  const { id } = useParams();
  const [spin, setSpin] = useState(true);
  const [auth] = useAuth();
  const [scores, setScores] = useState([]);
  const [overall, setOverall] = useState({ average: 0, min: 0, max: 0 });

  const [videoScores, setVideoScores] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:7000/api/scores/${id}`,
      { headers: { 'auth-token': auth } })
      .then((res) => {
        setScores(res.data.scores);
        setSpin(false);

        let scoreMin = 0;
        let scoreMax = 0;

        let engagementAverage = 0;
        let engagamentSum = res.data.scores.reduce((total, next) => total + next.engagementPercentage, 0);

        let scoreAverage = 0;
        let scoreSum = res.data.scores.reduce((total, next) => total + next.scorePercentage, 0);

        if (res.data.scores.length > 0) {
          engagementAverage = Math.round(engagamentSum / res.data.scores.length);
          scoreAverage = Math.round(scoreSum / res.data.scores.length);

          scoreMin = Math.min(...res.data.scores.map(item => item.scorePercentage));
          scoreMax = Math.max(...res.data.scores.map(item => item.scorePercentage));

          console.log(scoreMin, scoreMax);
        }

        setOverall({ average: scoreAverage, min: scoreMin, max: scoreMax })

      }).catch((error) => {
        console.log(error);
      });
    
    fetchPerVideoScores();
  }, []);
  
  const fetchPerVideoScores = () => {
    axios.get(`http://localhost:7000/api/scores/lecture/${id}`,
      { headers: { 'auth-token': auth } })
      .then((res) => {
        setVideoScores(res.data.scores);

      }).catch((error) => {
        console.log(error);
      });
  };

  if (spin) return <Spinner />;
  return (
    <div className="container">
      <div>
        <h3>Course Analytics</h3>
        <h4>Overall Student Score</h4>

        <div className="flex-row">
          <PieChart percentage={overall.average}></PieChart>
          <div style={{marginLeft: 40}}>
            <p>Lowest score: {overall.min}%</p>
            <p>Highest score: {overall.max}%</p>
          </div>
        </div>
        
        <h4>Individual Student Score</h4>

        <div className='table'>
          <div>Student Name</div>
          <div>Engagement</div>
          <div>Score</div>

          {scores.length > 0 &&
            scores.map((studentScore) => {
              return (
                <>
                  <div>
                    <StudentInfo studentId={studentScore._id} />
                    {studentScore.name}
                  </div>
                  <div className="flex-row">
                    <BarChart percentage={studentScore.engagementPercentage} />
                    {studentScore.engagementPercentage}%
                    <div className='grey'>{studentScore.engagement}/{studentScore.total}</div>
                  </div>
                  <div className="flex-row">
                    <BarChart percentage={studentScore.scorePercentage} />
                    {studentScore.scorePercentage}%
                    <div className='grey'>{studentScore.score}/{studentScore.engagement}</div>
                  </div>
                </>
              );
            })
          }
        </div>

        <h4 style={{marginTop: 50}}>Per Lecture Score</h4>

        <div className='table'>
          <div>Lecture</div>
          <div>Engagement</div>
          <div>Score</div>
          
          {videoScores.length > 0 &&
            videoScores.map((videoScore) => {
              return (
                <>
                  <div>
                    {videoScore.lectureTitle}
                    <div>
                      <video id="vid" width="200" controls>
                        <source src={`http://localhost:7000/files/${videoScore.video}`} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  </div>
                  <div className="flex-row">
                    <BarChart percentage={videoScore.averageEngagement} />
                    {videoScore.averageEngagement}%
                  </div>
                  <div className="flex-row">
                  <BarChart percentage={videoScore.averageScore} />
                    {videoScore.averageScore}%
                  </div>
                </>
              );
            })
          }
        </div>
        
      </div>
    </div>
  )
}
