import React from 'react'
import './progressbar.css'

export default function PieChart({ percentage = 0 }) {
  return (
    <div className="pie-size">
      <div className="pie-wrapper">
        <span className="pie-label">{ Math.ceil(percentage) }<span className="pie-smaller">%</span></span>
        <div className={ (percentage > 50) ? "pie full-circle" : "pie"}>
          <div
            className="left-side half-circle"
            style={(percentage > 50) ?
              { transform: `rotate(${Math.ceil(percentage * 3.6)}deg)` } :
              { transform: `rotate(0deg)` }}>
          </div>
          <div
            className="right-side half-circle"
            style={(percentage > 50) ?
              { transform: `rotate(180deg)` } :
              { transform: `rotate(${Math.ceil(percentage * 3.6)}deg)` }}>
          </div>
        </div>

        <div className="pie-shadow"></div>
      </div>
    </div>
  );
}
