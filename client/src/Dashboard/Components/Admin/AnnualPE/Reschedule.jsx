import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import Sidebar from "../../SideBar Section/Sidebar";
import RescheduleRequest from "./RescheduleRequest";

const Reschedule = () => {
  const [activeTab, setActiveTab] = useState('requests');

  const tabs = [
    { 
      id: 'requests', 
      icon: <HiClipboardList className="w-5 h-5" />, 
      label: 'Reschedule Requests' 
    },
    
  ];

  return (
    <div className="dashboard my-flex">
      <div className="dashboardContainer my-flex">
        <Sidebar />
        <div className="mainContent m-0 p-0"> 
      
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="flex-grow p-6 space-y-6"
      >
        <div className="bg-white shadow-lg rounded-xl overflow-hidden m-0 p-0">
          {/* Header with Tabs */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-4 h-40">
            <div className="flex items-center justify-between text-white">
              <h1 className="text-4xl font-bold tracking-tight p-10">Reschedule Management</h1>
              <div className="flex space-x-2 bg-white/20 rounded-full p-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-300
                      ${activeTab === tab.id 
                        ? 'bg-white text-blue-600 shadow-lg' 
                        : 'hover:bg-white/10 text-white/80'}
                    `}
                  >
                    {tab.icon}
                    <span className="text-sm font-medium">{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-0 pt-4">
            {activeTab === 'requests' && <RescheduleRequest />}
          </div>
        </div>
      </motion.div>
    </div>
    </div>
    </div>
  );
};

export default Reschedule;