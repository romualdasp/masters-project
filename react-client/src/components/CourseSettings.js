import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

import useGetRequest from './useGetRequest';
import useAuth from './useAuth';
import Spinner from './Spinner';
import ErrorPage from './ErrorPage';
import useModal from './useModal';
import Modal from './Modal';
import InlineSpinner from './InlineSpinner';

export default function CourseSettings() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [auth] = useAuth();
  
  const [data, error, loading] = useGetRequest(`/api/course/${id}`);

  const [visibleDeleteConfirmation, toggleDeleteConfirmation] = useModal();
  const deleteCourse = () => {
    toggleDeleteConfirmation();

    axios.post(`http://localhost:7000/api/course/delete/${id}`, {},
    { headers: { 'auth-token': auth } })
    .then((res) => {
      console.log(res.data);
      navigate('/dashboard');
    }).catch((error) => {
      console.log(error);
    });
  };
  
  const [fields, setFields] = useState({
    title: '',
    description: '',
    code: ''
  });

  const handleChange = (event) => {
    setFields({ ...fields, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setDetailSpinner('loading');

    axios.post(`http://localhost:7000/api/course/update/${id}`,
      { ...fields, titleChanged: (fields.title !== data.course.title) },
      { headers: { 'auth-token': auth } })
      .then((res) => {
        console.log(res.data);

        // show updated success
        setDetailSpinner('loaded');
        
      }).catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (!data?.course) return;
    setFields({
      title: data.course.title,
      description: data.course.description,
      code: data.course.code
    });
  }, [data]);

  const [visibleChangeImage, toggleChangeImage] = useModal();

  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');

  const [fileSpinner, setFileSpinner] = useState('hidden');
  const [detailSpinner, setDetailSpinner] = useState('hidden');

  const handleFile = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmitImage = () => {
    if (!file) {
      setFileError('Please select an image file.')
      return;
    }

    toggleChangeImage();
    setFileSpinner('loading');

    const formData = new FormData();
    formData.append('courseimg', file);

    const config = {
      headers: {
        'auth-token': auth,
        'content-type': 'multipart/form-data'
      }
    };

    axios.post(`http://localhost:7000/api/course/updateimage/${id}`, formData, config)
      .then((res) => {
        console.log(res.data);

        setFile(null);
        setFileError('');

        setFileSpinner('loaded');

        // refresh page
        navigate(0);

      }).catch((error) => {
        console.log(error);
      });
    
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorPage />;

  return (
    <div className="container">
      <h3>Course Settings</h3>
      <h4>Course Details</h4>
      
      <form onSubmit={handleSubmit} className="form-no-border form-no-padding">
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
        <div style={{justifyContent: 'flex-start'}}>
          <input type="submit" value="Save Changes" style={{ margin: 0, display: 'inline' }} />
          <InlineSpinner spinnerState={detailSpinner} />
        </div>
      </form>

      <h4>Course Image</h4>
      <img className='course-settings-image' src={`http://localhost:7000/files/${data.course.image}`} alt="Course" />
      <div style={{ display: 'flex', alignItems: 'center'}}>
        <button onClick={toggleChangeImage}>Change Image</button>
        <InlineSpinner spinnerState={fileSpinner} />
      </div>

      <Modal visible={visibleChangeImage} toggle={toggleChangeImage}>
        <h3>Change Image</h3>

        <p className="form-error">{ fileError }</p>

        <form className="form-no-border">
          <div>
            <label>Image</label>
            <input type="file" accept="image/*" name="courseimg" onChange={handleFile} />
          </div>
        </form>

        <div>
          <button onClick={handleSubmitImage}>Change</button>
          <button onClick={toggleChangeImage}>Cancel</button>
        </div>
      </Modal>

      <h4>Delete Course</h4>
      <div><button className="button-danger" onClick={toggleDeleteConfirmation}>Delete Course</button></div>

      <Modal visible={visibleDeleteConfirmation} toggle={toggleDeleteConfirmation}>
        <h3>Delete Course</h3>
        <p style={{maxWidth: 320}}>Are you sure you would like to delete this course? This course will be lost forever!</p>

        <div>
          <button className="button-danger" onClick={deleteCourse}>Delete</button>
          <button onClick={toggleDeleteConfirmation}>Cancel</button>
        </div>
      </Modal>

    </div>
  );
}
