import React, { Component } from 'react';
import { Routes, Route, Link } from 'react-router-dom'

export default class Home extends Component {
  render() {
    return (
      <div className="container">
        <h1>Welcome to ActiveLearn!</h1>

        <p>Please Login or Register using the buttons above.</p>
      </div>
    )
  }
}
