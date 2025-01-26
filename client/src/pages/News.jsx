import React from 'react';
import { motion } from 'framer-motion'; // For animations
import DashAnnouncement from '../Dashboard/Components/AnnouncementUser/DashAnnouncement';
import TopHeader from './componentsHome/Header';

const News = () => {
  return (
    <>
      <TopHeader />
      
      {/* News header with animation */}
      <motion.div
        className='text-5xl font-semibold  text-teal-600 '
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
         <div className="bg-gradient-to-r from-teal-600 to-cyan-500 p-12  animate-gradient-x">
                <div className="w-full m-0 p-0">
                <div className="flex items-center justify-between pb-2">
                    <div className="animate-fade-in">
                    <h1 className="text-5xl font-bold text-white mb-3">
                        Latest News
                    </h1>
                    <p className="text-blue-100 text-lg pt-5">
                        Stay updated with the latest announcements and updates by the UPV Health Services Unit
                    </p>
                    </div>
                    </div>
                    </div>
                    </div>
      </motion.div>

      {/* Main container with spacing and padding */}
      <motion.div
        className="m-4 p-10 bg-white rounded-lg shadow-lg dark:bg-gray-800"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Add a subtle hover animation for DashAnnouncement component */}
        <motion.div
          
          transition={{ duration: 0.3 }}
        >
          <DashAnnouncement />
        </motion.div>
      </motion.div>
    </>
  );
};

export default News;
