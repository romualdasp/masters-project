import React, { useState } from 'react';
import './modal.css';

export default function Modal({ children, visible, toggle }) {
  if (!visible) return null;

  return (
    <div className="modal">
      <div className="modal-main shadow">
        <div className="modal-header">
          <i onClick={toggle} className="fa-solid fa-xmark modal-close-button"></i>
        </div>

        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};
