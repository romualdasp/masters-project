import React from 'react'
import './inline-spinner.css'

export default function InlineSpinner({ spinnerState }) {

  if (spinnerState === 'hidden')
    return null;
  if (spinnerState === 'loading')
    return (<div className="inline-spinner"></div>);
  if (spinnerState === 'loaded')
    return (<i className="fa-solid fa-check inline-checkmark"></i>);
}
