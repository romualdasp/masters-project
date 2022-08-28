import React, { Component, useEffect, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom'
import axios from 'axios';

import SideMenu from "./SideMenu";
import Course from "./Course"
import Modal from './Modal';
import useGetRequest from './useGetRequest';
import useModal from './useModal';
import useAuth from './useAuth';
import Spinner from './Spinner';
import ErrorPage from './ErrorPage';

export default function Dashboard() {
  let navigate = useNavigate();

  const [auth] = useAuth();
  const initialFields = {
    title: '',
    description: '',
    code: '',
    image: ''
  };

  const [state, setState] = useState({ name: '', courses: [] });
  const [fields, setFields] = useState(initialFields);
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  
  const handleChange = (event) => {
    setFields({ ...fields, [event.target.name]: event.target.value });
  };

  const handleFile = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = (event) => {
    event.preventDefault()

    if (!file) {
      setFileError('Please select an image file.')
      return;
    }

    const formData = new FormData();
    formData.append('title', fields.title);
    formData.append('description', fields.description);
    formData.append('code', fields.code);
    formData.append('courseimg', file);

    const config = {
      headers: {
        'auth-token': auth,
        'content-type': 'multipart/form-data'
      }
    };

    axios.post('http://localhost:7000/api/course/create', formData, config)
      .then((res) => {
        console.log(res.data);
        fetchCourses();

        // hide and empty the form
        toggle();
        setFields(initialFields);
        setFile(null);
        setFileError('');
      }).catch((error) => {
        console.log(error);
      });
    
  };

  const [data, error, loading] = useGetRequest('/api/course/');

  useEffect(() => {
    if (!data?.courses) return;
    setState({ ...state, courses: data.courses  });
  }, [data]);

  const fetchCourses = () => {
    axios.get('http://localhost:7000/api/course/',
    { headers: { 'auth-token': auth } })
    .then((res) => {
      setState({ name: res.data.user.name, courses: res.data.courses });
    }).catch((error) => {
      console.log(error);
    });
  };
  
  const [visible, toggle] = useModal();

  if (loading) return <Spinner />;
  if (error) return <ErrorPage />;

  return (
    <div className="container">
      {/* <SideMenu /> */}

      <div className="flex-row-apart">
        <h3>Created Courses</h3>
        <button onClick={toggle}>Create New</button>
      </div>

      <div className="courses">
        {state.courses.map(course => (
          <Course image={course.image} title={course.title} description={course.description} courseId={course._id} />
        ))}
      </div>

      <Modal visible={visible} toggle={toggle}>
        <h3>Create New Course</h3>

        <form onSubmit={handleSubmit}>
          <p className="form-error">{fileError}</p>
          
          <div>
            <label>Title</label>
            <input type="text" value={fields.title} name="title" onChange={handleChange} />
          </div>
          <div>
            <label>Description</label>
            <input type="text" value={fields.description} name="description" onChange={handleChange} />
          </div>
          <div>
            <label>Code</label>
            <input type="text" value={fields.code} name="code" onChange={handleChange} />
          </div>
          <div>
            <label>Image</label>
            <input type="file" accept="image/*" name="courseimg" onChange={handleFile} style={{marginLeft: 58}} />
          </div>
          <div>
            <input type="submit" value="Create New" />
          </div>
        </form>
      </Modal>

    </div>
  );
}
