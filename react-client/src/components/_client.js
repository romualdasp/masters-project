import React, { Component, useState } from 'react';
import { Routes, Route, Link } from 'react-router-dom'
import axios from 'axios';

import Cookies from 'universal-cookie';
import VideoEvent from '../logic/video';

const cookies = new Cookies();
const videoEvent = new VideoEvent();

export default class InteractivityClient extends Component {
  constructor(props) {
    super(props)

    this.state = {
      user: {},
      video: '',
      url: '',
      interactivity: []
    };

    this.video = null;
    this.activated = false;
    this.activatedTime = 0;

    this.setVideoRef = element => {
      this.video = element;
      this.video.addEventListener('seeking', () => { console.log(this.video.seeking, this.video.currentTime, 'seeking'); });
      this.video.addEventListener('timeupdate', () => { console.log(this.video.seeking, this.video.currentTime, 'timeupdate'); });
    };
  }
  
  componentDidMount() {
    this.fetchInteractiveComponents();

    this.timerID = setInterval(() => this.tick(), 100);    

  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  fetchInteractiveComponents() {
    axios.get('http://localhost:7000/api/courses/interactivity',
      { headers: { 'auth-token': cookies.get('auth-token') } })
      .then((res) => {
        console.log(res.data)
        
        this.setState({
          user: res.data.user,
          video: res.data.video,
          url: res.data.url,
          interactivity: res.data.interactivity.map(el => ({ ...el, activated: false }))
        })
      }).catch((error) => {
        console.log(error)
      });
  }

  
  tick() {
    if (!this.video) {
      return;
    }

    let time = this.video.currentTime;
    let duration = this.video.duration;

    let trigger = videoEvent.update(time);

    if (trigger) {
      let interactivity = this.state.interactivity.find(el => {
        return el.timestamp === videoEvent.current;
      })

      if (interactivity) {
        if (!interactivity.activated) {
          console.log(interactivity.type, interactivity.question, interactivity.answers);
        }
        
        let index = this.state.interactivity.findIndex(el => el.timestamp === videoEvent.current);
        let items = [...this.state.interactivity];
        items[index] = { ...items[index], activated: true };
        this.setState({ interactivity: items });
      }
    }
    

    console.log(trigger, videoEvent.current, time, duration);
  }
  
  handleAddInteractivity = (event) => {
    console.log('handleAddInteractivity');

    event.preventDefault();

    // axios.post('http://localhost:7000/api/user/login', user)
    //   .then((response) => {
    //     cookies.set('auth-token', response.data, { path: '/', maxAge: (60 * 60 * 2), sameSite: 'none', secure: true })
        
    //     setUser({
    //       email: '',
    //       password: ''
    //     });
        
    //     navigate('/dashboard');
    //   }).catch((error) => {
    //     setErrors({
    //       field: '',
    //       message: error.response.data
    //     });
    //   });
  }

  render() {
    return (
      <div>
        <nav>
          <Link to="/">Welcome</Link>
          <Link to="/dashboard">Dashboard</Link>
        </nav>

        <h1>Interactivity Editor</h1>
        <h3>Currently editing {this.state.video}</h3>
        
        { this.state.url &&
          <div>
            <video id="vid" ref={this.setVideoRef} width="620" controls muted>
              <source src={"http://localhost:7000/" + this.state.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        }

        <button onClick={this.handleAddInteractivity} style={{ margin: 20 }}>Add Multiple Choice Quiz</button>
        
        <div>
          {this.state.interactivity.map(el => {
            return (<div><p style={{ display: 'inline' }}>{el.timestamp} <b>{el.type}</b> {el.question}</p> <a href="/">Edit</a> <a href="/">Remove</a></div>)
          })}
        </div>
        
      </div>
    )
  }
}

/*
res.data.interactivity.map(el => ({ ...el, activated: false }))
*/