import React from 'react'
import './progressbar.css'

export default function UploadIndicator({ percentage }) {
  return (
    <div className="bar">
      <div style={{ width: `${percentage}%` }}></div>
    </div>
  );
}
