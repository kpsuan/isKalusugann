
import Sidebar from "../SideBar Section/Sidebar";
import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import GetAllDocs from "./GetAllDocs";
import { motion } from 'framer-motion';

import { Card } from 'flowbite-react';

import "../Annual/annual.css";

import axios from 'axios';

import {Link, useNavigate} from 'react-router-dom'


const DocsUserView = () => {

  useEffect(() => {
    // Fetch stats
    const fetchStats = async () => {
      // Simulate API call
      setStats({
        totalDocs: 150,
        recentlyViewed: 12,
        downloads: 45
      });
    };
    fetchStats();
  }, []);

  const headerTitle = "Documents";
    return (
      
        <div className="dashboard my-flex">
          <div className="dashboardContainer my-flex">
            <Sidebar />
            <div className="mainContent">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 space-y-6"
            >
            <Card className="bg-gradient-to-r from-cyan-600 to-green-500 border-none">
                <div className="relative overflow-hidden p-8">
                  <div className="relative z-10">
                    <h1 className="text-3xl font-bold text-white mb-4">
                      Downloadable Forms
                    </h1>
                    <p className="text-white/80 max-w-xl">
                      Access and download all the forms you need. Our document repository is regularly updated to ensure you have the latest versions.
                    </p>
                  </div>
                  <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -mt-16 -mr-16 blur-2xl" />
                </div>
              </Card>
              
              
              {/* Main Content */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <GetAllDocs />
              </div>
            </motion.div>
     
          </div>
        </div>
        </div>
    );
};
export default DocsUserView;