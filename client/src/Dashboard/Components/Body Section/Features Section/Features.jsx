import React from 'react'
import './features.css'
import { Link } from 'react-router-dom'; 
const Features = () => {
  return (
    <div className='featuresSection'>
      <div className="heading flex">
        <h1>Features</h1>
      </div>

      <div className="secContainer flex">
        <div className="singleItem">
          <h3>Book an Appointment</h3>
          <small>Set an appointment now</small>
        </div>
        <div className="singleItem">
          <h3>Update Personal Information</h3>
          <small>Update your personal info</small>
        </div>
        <div className="singleItem">
          <a href='/annualPE'>
            <h3>Annual Physical Examination</h3>
            <small>Annual Physical Exam</small>
          </a>
        </div>
        <div className="singleItem">
          <h3>Documents</h3>
          <small>View documents</small>
        </div>
      </div>
    </div>
  )
}

export default Features