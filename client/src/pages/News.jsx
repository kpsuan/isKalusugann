import React from 'react'
import DashAnnouncement from '../Dashboard/Components/AnnouncementUser/DashAnnouncement'
import TopHeader from './componentsHome/Header'

const News = () => {
  return (
    <>
    <TopHeader/>
    <div className='text-5xl font-semibold ml-12'>News</div>
    <div className="m-4 p-10 ">
    <DashAnnouncement/>
    </div>
    </>
  )
}

export default News