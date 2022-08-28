import React, { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'

import useGetRequest from './useGetRequest';
import useModal from './useModal';

import Modal from './Modal';
import Spinner from './Spinner';

import axios from 'axios';

import './course.css'
import Cookies from 'universal-cookie';
import ErrorPage from './ErrorPage';
import useAuth from './useAuth';
import UploadIndicator from './UploadIndicator';

const cookies = new Cookies();

export default function ManageCourse() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, error, loading] = useGetRequest(`/api/content/${id}`);
  const [visible, toggle] = useModal();
  const [editing, setEditing] = useState(false);
  const [editingId, setEditingId] = useState(0);
  const [kind, setKind] = useState('heading');
  const [content, setContent] = useState([]);
  const [auth] = useAuth();
  const [uploadingVideo, setUploadingVideo] = useState(false);
  const [uploadingVideoPercentage, setUploadingVideoPercentage] = useState(0);

  useEffect(() => {
    if (!data?.content) return;
    setContent([ ...data.content ]);
  }, [data]);

  const fields = {
    heading: '',
    paragraph: '',
    title: ''
  };

  const [values, setValues] = useState(fields);

  const handleChange = (event) => {
    setValues(values => ({ ...values, [event.target.name]: event.target.value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (uploadingVideo === true) {
      return;
    }

    if (kind === 'video' && !file) {
      setFileError('Please select a video file.');
      return;
    } else {
      setFileError('');
    }

    let data = {};
    if (kind === 'heading') { data = { value: values.heading } }
    if (kind === 'paragraph') { data = { value: values.paragraph } }
    if (kind === 'video') {
      data = new FormData();
      data.append('title', values.title);
      data.append('kind', 'video');
      data.append('contentvid', file);

      const config = {
        headers: {
          'auth-token': auth,
          'content-type': 'multipart/form-data'
        },
        onUploadProgress: function(progressEvent) {
          let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadingVideoPercentage(percentCompleted);
        }
      };
      setUploadingVideo(true);

      axios.post(`http://localhost:7000/api/content/${id}/createvideo`, data, config)
      .then((res) => {
        console.log(res.data);
        setContent([...res.data.content]);

        setUploadingVideo(false);
        toggle();
        setKind('heading');
        setValues(fields);
        setFile(null);
        setFileError('');
      }).catch((error) => {
        console.log(error);
      });
    } else {

      axios.post(`http://localhost:7000/api/content/${id}/create`, { ...data, kind },
      { headers: { 'auth-token': auth } })
      .then((res) => {
        console.log(res.data);
        setContent([...res.data.content]);
        
        toggle();
        setKind('heading');
        setValues(fields);
        setFile(null);
        setFileError('');
      }).catch((error) => {
        console.log(error);
      });
    }
    
  };

  const submitEdits = () => {
    toggle();

    let data = {};
    if (kind === 'heading') { data = { value: values.heading } }
    if (kind === 'paragraph') { data = { value: values.paragraph } }
    if (kind === 'video') { data = { title: values.title } }

    axios.post(`http://localhost:7000/api/content/${id}/update/${editingId}`, { ...data, kind },
    { headers: { 'auth-token': auth } })
    .then((res) => {
      console.log(res.data);
      setContent([ ...res.data.content ]);
    }).catch((error) => {
      console.log(error);
    });
      
    toggle();
    setKind('heading');
    setValues(fields);

  };

  const editButtonClicked = (content) => {
    setEditing(true);
    setEditingId(content._id);

    if (content.kind === 'heading') {
      setValues({ ...values, heading: content.value });
      setKind('heading');
    }
    if (content.kind === 'paragraph') {
      setValues({ ...values, paragraph: content.value });
      setKind('paragraph');
    }
    if (content.kind === 'video') {
      setValues({ ...values, title: content.title });
      setKind('video');
    }

    toggle();
  };

  const remButtonClicked = (contentId) => {
    axios.post(
      `http://localhost:7000/api/content/${id}/delete/${contentId}`, {},
      { headers: { 'auth-token': cookies.get('auth-token') } })
      .then((res) => {
        console.log(res.data);
        setContent([ ...res.data.content ]);
      }).catch((error) => {
        console.log(error);
      });
    
  };

  const reorderContents = (contentId, direction, index) => {
    axios.post(
      `http://localhost:7000/api/content/${id}/reorder/${contentId}`, { direction, index },
      { headers: { 'auth-token': cookies.get('auth-token') } })
      .then((res) => {
        console.log(res.data);
        setContent([ ...res.data.content ]);
      }).catch((error) => {
        console.log(error);
      });

    // switch (direction) {
    //   case 'up':
    //     if (i === 0) return;
    //     [cont[i], cont[i-1]] = [cont[i-1], cont[i]];
    //     break;
    //   case 'down':
    //     if (i === cont.length - 1) return;
    //     [cont[i], cont[i+1]] = [cont[i+1], cont[i]];
    //     break;
    //   default:
    //     return;
    // }

    // setContent([...cont]);
  };

  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const handleFile = (event) => {
    setFile(event.target.files[0]);
  };

  if (loading) return <Spinner />;
  if (error) return <ErrorPage />;

  return (
    <div className="container">

      <div className="flex-row-apart">
        <h3>{data?.course?.title}</h3>
        
        <div className="flex-row">
          <button onClick={() => { setEditing(false); toggle(); }}>Add Content</button>
        </div>
      </div>

      <Modal visible={visible} toggle={toggle}>
        <form onSubmit={handleSubmit}>
          <h1>Add Content</h1>
          <p className="form-error">{fileError}</p>

          <div>
            <label>Type</label>
            <select value={kind} onChange={(event) => setKind(event.target.value)}>
              <option key="heading" value="heading">Heading</option>
              <option key="paragraph" value="paragraph">Paragraph</option>
              <option key="video" value="video">Video</option>
            </select>
          </div>

          {kind === 'heading' &&
            <div>
              <label>Heading</label>
              <input type="text" name="heading" value={values.heading} onChange={handleChange} placeholder="Heading..." />
            </div>
          }

          {kind === 'paragraph' &&
            <div>
              <label>Paragraph</label>
              <textarea type="text" name="paragraph" value={values.paragraph} onChange={handleChange} placeholder="Paragraph..." />
            </div>
          }

          {kind === 'video' && 
            <>
              <div>
                <label>Title</label>
                <input type="text" name="title" value={values.title} onChange={handleChange} placeholder="Video title..." />
              </div>
              
              <div>
                <label>Video</label>
                <input type="file" accept="video/*" name="contentvid" onChange={handleFile} style={{marginLeft: 58}} />
              </div>
            </>
          }
          
          <div>
            { editing ?
              <button onClick={submitEdits}>Save</button> :
              <input type="submit" value="Add" />
            }
            { uploadingVideo &&
              <UploadIndicator percentage={uploadingVideoPercentage} />
            }
          </div>
        </form>
      </Modal>

      <div className="course-contents">
        {content.map((content, i) => {
          switch (content.kind) {
            case 'heading':
            case 'paragraph':
            case 'video':
              return (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                    <i className="fa-solid fa-pen-to-square mh-s" onClick={(event) => editButtonClicked(content)}></i>
                    <i className="fa-solid fa-trash mh-s" onClick={(event) => remButtonClicked(content._id)}></i>
                    <div className="flex ml-s">
                      <i onClick={(event) => reorderContents(content._id, 'up', i)} className="fa-solid fa-chevron-up"></i>
                      <i onClick={(event) => reorderContents(content._id, 'down', i)} className="fa-solid fa-chevron-down"></i>  
                    </div>
                  </div>

                  {content.kind === 'heading' && <h3 style={{margin: 0, fontSize: 26}}>{content.value}</h3>}
                  {content.kind === 'paragraph' && <p style={{marginRight: 80}}>{content.value}</p>}
                  {content.kind === 'video' && 
                    <div>
                      <video id="vid" width="320" controls>
                        <source src={`http://localhost:7000/files/${content.video}`} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                      <button onClick={()=>navigate(`/interactivity/${content._id}`)}>Interactivity Editor</button>
                    </div>
                  }
                </div>
              );
            default:
              return (<div><p>Oops something went wrong. Content type not supported.</p></div>);
          }
        })}
        {content.length === 0 && <p>This course does not have any content. Add headings, paragraphs or videos by pressing the button above.</p>}
      </div>

      {/* <form onSubmit={}>
        <h1>File Upload</h1>
        
        <button className="upload-button" type="submit">Upload to DB</button>
      </form> */}
      
    </div>
  );
}
