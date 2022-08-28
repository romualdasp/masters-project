import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom'

export default function Course({ image, title, description, courseId }) {
  const navigate = useNavigate();

  return (
    <div className="course-card shadow">
      <img className="card-image" src={`http://localhost:7000/files/${image}`} alt="Course" />
      <div className="card-body flex-apart">
        <div>
          <h5>{title}</h5>
          <p>{description}</p>
        </div>

        <div className="flex-row-apart course-icons p">
          <i className="fa-solid fa-chart-line" onClick={() => navigate(`/analytics/${courseId}`)}></i>
          <i className="fa-solid fa-users" onClick={() => navigate(`/enrolment/${courseId}`)}></i>
          <i className="fa-solid fa-square-pen" onClick={() => navigate(`/manage/${courseId}`)}></i>
          <i className="fa-solid fa-gears" onClick={() => navigate(`/settings/${courseId}`)}></i>
        </div>
      </div>
    </div>
  );
}
