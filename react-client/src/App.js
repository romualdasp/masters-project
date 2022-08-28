import logo from './logo.svg';
import './App.css';

import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import ManageCourse from "./components/ManageCourse";
import InteractivityEditor from "./components/InteractivityEditor";
import TopNavigation from './components/TopNavigation';
import NotFound from './components/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import Analytics from './components/Analytics';
import Enrolment from './components/Enrolment';
import CourseSettings from './components/CourseSettings';

function App() {
  return (
    <div>
      <TopNavigation></TopNavigation>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>} />
        <Route path="analytics/:id" element={
          <ProtectedRoute>
            <Analytics />
          </ProtectedRoute>} />
        <Route path="enrolment/:id" element={
          <ProtectedRoute>
            <Enrolment />
          </ProtectedRoute>} />
        <Route path="manage/:id" element={
          <ProtectedRoute>
            <ManageCourse />
          </ProtectedRoute>} />
        <Route path="settings/:id" element={
          <ProtectedRoute>
            <CourseSettings />
          </ProtectedRoute>} />
        <Route path="interactivity/:id" element={
          <ProtectedRoute>
            <InteractivityEditor />
          </ProtectedRoute>} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
