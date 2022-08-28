import React, { Component, useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  let navigate = useNavigate();

  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    verification: ''
  });

  const [errors, setErrors] = useState({
    field: '',
    message: ''
  });

  const handleChange = (event) => {
    setUser({ ...user, [event.target.name]: event.target.value });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    axios.post('http://localhost:7000/lecturer/register', user)
      .then((response) => {
        setUser({
          name: '',
          email: '',
          password: '',
          verification: ''
        });

        navigate('/login', { state: { success: true } });
      }).catch((error) => {
        setErrors({
          field: '',
          message: error.response.data
        });
      });
  };

  return (
    <div className="screen-gradient">

      <form onSubmit={handleSubmit} className="form-login no-labels center-transform shadow">
        <h1>Register</h1>
        <p className='form-error'>{ errors.message }</p>
        <div>
          <label htmlFor="name">Full Name</label>
          <input type="text" name="name" value={user.name} onChange={handleChange}  placeholder="Full Name"/>
        </div>
        <div>
          <label htmlFor="verification">Verification</label>
          <input type="text" name="verification" value={user.verification} onChange={handleChange}  placeholder="Verification Code"/>
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" value={user.email} onChange={handleChange} placeholder="Email" />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" value={user.password} onChange={handleChange} placeholder="Password" />
        </div>
        <div className='form-button-centered'>
          <input type="submit" value="Register" />
        </div>
      </form>

    </div>
  );
};
