
import Sidebar from "../SideBar Section/Sidebar";
import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import GetAllDocs from "./GetAllDocs";
import { motion } from 'framer-motion';

import { Card } from 'flowbite-react';

import "../Annual/annual.css";

import axios from 'axios';

import {Link, useNavigate} from 'react-router-dom'
import TrackRequestHistory from "./TrackRequestHistory";


const TrackRequest2 = () => {

  

  const headerTitle = "Documents";
    return (
      
        <div className="dashboard my-flex">
          <div className="dashboardContainer my-flex">
            <div className="mainContent">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 space-y-6"
            >
            <Card className="bg-gradient-to-r from-blue-600 to-cyan-500 border-none">
                <div className="relative overflow-hidden p-8">
                  <div className="relative z-10">
                    <h1 className="text-3xl font-bold text-white mb-4">
                     Track Your Request
                    </h1>
                    
                  </div>
                  <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -mt-16 -mr-16 blur-2xl" />
                </div>
              </Card>
              
              
              {/* Main Content */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <TrackRequestHistory />
              </div>
            </motion.div>
     
          </div>
        </div>
        </div>
    );
};
export default TrackRequest2;