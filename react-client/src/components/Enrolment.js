import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import useGetRequest from './useGetRequest';
import Spinner from './Spinner';
import ErrorPage from './ErrorPage';
import useAuth from './useAuth';

export default function Enrolment() {
  const { id } = useParams();
  const [auth] = useAuth();
  
  const [data, error, loading] = useGetRequest(`/enrol/students/${id}`);

  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [searchField, setSearchField] = useState('');

  useEffect(() => {
    if (!data?.students || !data?.enrolled) return;

    setEnrolledStudents([...data.enrolled]);
  }, [data]);

  if (loading) return <Spinner />;
  if (error) return <ErrorPage />;

  const enrolStudent = (studentId) => {
    axios.post(`http://localhost:7000/enrol/add/${id}/${studentId}`, {},
    { headers: { 'auth-token': auth } })
    .then((res) => {
      console.log(res.data);
      setEnrolledStudents([...res.data.enrolled]);
    }).catch((error) => {
      console.log(error);
    });
  };

  const removeStudent = (studentId) => {
    axios.post(`http://localhost:7000/enrol/remove/${id}/${studentId}`, {},
    { headers: { 'auth-token': auth } })
    .then((res) => {
      console.log(res.data);
      setEnrolledStudents([...res.data.enrolled]);
    }).catch((error) => {
      console.log(error);
    });
  };

  const studentSearch = (studentArray, searchTerm) => {
    let term = searchTerm.toLowerCase();

    return studentArray.filter(student => {
      if (student.id) {
        return (
          student.name.toLowerCase().match(new RegExp(term, 'g')) ||
          student.id.toLowerCase().match(new RegExp(term, 'g'))
        );
      }
      return student.name.toLowerCase().match(new RegExp(term, 'g'));
    });
  };

  const handleChange = (event) => {
    setSearchField(event.target.value);
  };

  return (
    <div className="container">
      <h3>Student Enrolment</h3>

      <h4>Enrolled Students</h4>

      <div className="students">
        {enrolledStudents.map(student => (
          <p>
            <button style={{padding: '4px 10px', marginRight:10}} onClick={()=>removeStudent(student._id)}>-</button>
            {student.name} <span className="grey">{student.id}</span>
          </p>
        ))}
        {enrolledStudents.length === 0 && <p>No students have been enrolled in this course</p>}
      </div>

      <h4>All Students</h4>
      
      <input type="text" value={searchField} onChange={handleChange} placeholder="Search for students..." />

      <div className="students">
        {studentSearch(data.students, searchField).map(student => (
          <p>
            <button style={{padding: '4px 8px', marginRight:10}} onClick={() => enrolStudent(student._id)}>+</button>
            {student.name} <span className="grey">{student.id}</span>
          </p>
        ))}
        {data.students.length === 0 && <p>No students found. Please make sure you are verified</p>}
      </div>

    </div>
  );
}
