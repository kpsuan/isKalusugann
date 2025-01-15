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
        className='text-5xl font-semibold ml-12 text-blue-600 mt-12'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        News
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
