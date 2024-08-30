import React from 'react'
import '../Body Section/body.css'
import Top from './Top Section/Top'
import Features from './Features Section/Features'
import Activity from './Activity Section/Activity'
import Stats from './Activity Section/Stats'

const Body = () => {
  return (
    <div className='mainContent'>
      <Top/>

      <div className="bottom flex flex-col">
        
        <div className="flex flex-row w-full ">
          <div className="w-2/3 "><Features/> </div>
        </div>
        <div className="w-full mb-2">       <div className="text-2xl font-bold mb-7">Announcements</div><Activity/> </div>
        
      </div>
      </div>
  )
}

export default Body