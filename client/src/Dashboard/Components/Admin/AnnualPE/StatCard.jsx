import React, { useState } from 'react';
import { Card } from 'flowbite-react';
import { PiUsersFourLight } from 'react-icons/pi';
import { FaCheck, FaCircleXmark } from 'react-icons/fa6';
import { LuPin } from 'react-icons/lu';
import { motion } from 'framer-motion';
import { Tooltip } from 'flowbite-react';

const StatCard = ({ title, value, icon: Icon, color, description }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Tooltip content={description} placement="top">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`relative overflow-hidden rounded-lg shadow-md ${color} bg-opacity-10 transition-all duration-300 cursor-pointer`}
      >
        <div className="p-6 flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              {title}
            </p>
            <motion.h3
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-gray-900"
            >
              {value}
            </motion.h3>
          </div>
          <motion.div
            animate={{ 
              rotate: isHovered ? 360 : 0,
              scale: isHovered ? 1.2 : 1
            }}
            transition={{ duration: 0.5 }}
            className={`p-3 rounded-full ${color} shadow-md`}
          >
            <Icon className="w-7 h-7" />
          </motion.div>
        </div>
        
        {/* Animated background effect */}
        <motion.div
          initial={{ width: '0%' }}
          animate={{ width: isHovered ? '100%' : '0%' }}
          transition={{ duration: 0.3 }}
          className="absolute bottom-0 left-0 h-1 bg-opacity-50 bg-blue-500"
        />
      </motion.div>
    </Tooltip>
  );
};

const StatsDashboard = ({ totalUsers, totalApproved, totalDenied, totalPending }) => {
  const stats = [
    {
      title: 'Total Users',
      value: totalUsers,
      icon: PiUsersFourLight,
      color: 'bg-blue-100 text-blue-600',
      description: 'Total number of users in the system'
    },
    {
      title: 'Approved',
      value: totalApproved,
      icon: FaCheck,
      color: 'bg-green-100 text-green-600',
      description: 'Number of users successfully approved'
    },
    {
      title: 'Denied',
      value: totalDenied,
      icon: FaCircleXmark,
      color: 'bg-red-100 text-red-600',
      description: 'Number of users who were not approved'
    },
    {
      title: 'Pending',
      value: totalPending,
      icon: LuPin,
      color: 'bg-yellow-100 text-yellow-600',
      description: 'Users awaiting review'
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 p-6 bg-gray-50 pl-0"
    >
     
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          color={stat.color}
          description={stat.description}
        />
      ))}
    </motion.div>


  );
};

export default StatsDashboard;