import React from 'react'
import '../Body Section/body.css'
import Top from './Top Section/Top'
import Features from './Features Section/Features'
import Activity from './Activity Section/Activity'

const Body = () => {
  return (
    <div className='mainContent'>
      <Top/>

      <div className="bottom flex">
        
        <Features/>  
      </div>
      </div>
  )
}

export default Body