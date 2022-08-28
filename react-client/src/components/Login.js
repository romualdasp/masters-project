import React, { Component, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

import Cookies from 'universal-cookie';
const cookies = new Cookies();

export default function Login(props) {
  let navigate = useNavigate();
  let location = useLocation();
  let { from } = { from: { pathname: "/dashboard" } };

  const [user, setUser] = useState({
    email: '',
    password: ''
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

    axios.post('http://localhost:7000/lecturer/login', user)
      .then((response) => {
        cookies.set('auth-token', response.data.token, { path: '/', maxAge: (60 * 60 * 8), sameSite: 'none', secure: true })
        cookies.set('auth-name', response.data.lecturer.name, { path: '/', maxAge: (60 * 60 * 8), sameSite: 'none', secure: true })

        setUser({
          email: '',
          password: ''
        });

        navigate(from);
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
        <h1>Login</h1>
        <p className="form-success">{location?.state?.success && 'Successfully registered! Please login to your account'}</p>
        <p className="form-success">{location?.state?.logout && 'Successfully logged out!'}</p>
        <p className="form-error">{location?.state?.from && 'Please login to access this page'}</p>
        {/* `Please login to access ${from.pathname}` */}
        <p className="form-error">{errors.message}</p>
        <div>
          <label htmlFor="email">Email</label>
          <input type="email" name="email" value={user.email} onChange={handleChange} placeholder="Email" />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input type="password" name="password" value={user.password} onChange={handleChange} placeholder="Password" />
        </div>
        <div className='form-button-centered'>
          <input type="submit" value="Login" />
        </div>
      </form>

    </div>
  );
};
