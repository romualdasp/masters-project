import React from 'react'
import './progressbar.css'

export default function BarChart({ percentage }) {
  let color = (percentage < 50) ? 'bar-red' : 'bar';
  return (
    <div className={color}>
      <div style={{ width: `${percentage}%` }}></div>
    </div>
  );
}
