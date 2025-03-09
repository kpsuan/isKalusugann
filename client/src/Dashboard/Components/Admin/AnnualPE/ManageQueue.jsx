import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../../SideBar Section/Sidebar';
import { HiOutlineCalendar, HiOutlineUsers, HiOutlineClipboardCheck, HiRefresh } from 'react-icons/hi';
import axios from 'axios';

const ManageQueue = () => {
  const [queueCounts, setQueueCounts] = useState({
    generalPE: 0,
    dental: 0,
    doctor: 0,
    totalUsers: 0,
  });
  const [refreshing, setRefreshing] = useState(false);

  const fetchQueueCounts = async () => {
    try {
      setRefreshing(true);
      const response = await axios.get('/api/queue/get-queue-summary');
      const data = response.data;

      setQueueCounts({
        generalPE: data.stepCounts["General PE"] || 0,
        dental: data.stepCounts["Dental"] || 0,
        doctor: data.stepCounts["Doctor"] || 0,
        totalUsers: data.totalUsers || 0,
      });
    } catch (error) {
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
      fetchQueueCounts();
      const interval = setInterval(fetchQueueCounts, 30000);
      return () => clearInterval(interval);
    }, []);

  const QueueCard = ({ title, description, count, icon: Icon, href, color }) => (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`p-3 ${color} rounded-lg`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
              <p className="text-sm text-gray-500">{description}</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-800">{count}</div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          <a 
            href={href} 
            className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200"
          >
            View Queue →
          </a>
        </div>
      </div>
      
      <div className="h-1 w-full bg-gray-200">
        <div 
          className={`h-full ${color} transition-all duration-500`}
          style={{ width: `${(count / 50) * 100}%` }}
        />
      </div>
    </div>
  );

  return (
    <div className="dashboard my-flex">
      <div className="dashboardContainer my-flex">
        <Sidebar />
        <ToastContainer />
        <div className="mainContent m-0 p-0 bg-gray-80">
          <div className="p-8">
            <div className="mb-8 bg-gradient-to-r from-cyan-700 to-blue-500 rounded-lg border border-gray-200 p-10 w-full flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-5xl font-bold  text-white mb-4">Queue Management</h1>
                <p className="text-white font-light text-lg my-8 mt-1">Monitor and manage student queues for various examinations</p>
              </div>
              
              <div className="mt-4 md:mt-0 flex space-x-4">
                <button
                  onClick={fetchQueueCounts}
                  disabled={refreshing}
                  className="flex items-center px-4 py-2 bg-white text-black rounded-lg hover:bg-slate-100 transition-colors duration-200 disabled:opacity-50"
                >
                  <HiRefresh className={`mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <QueueCard
                title="General PE Queue"
                description="Students waiting for general examination"
                count={queueCounts.generalPE}
                icon={HiOutlineUsers}
                href="/admin-queue"
                color="bg-blue-600"
              />
              
              <QueueCard
                title="Dental Queue"
                description="Students waiting for dental examination"
                count={queueCounts.dental}
                icon={HiOutlineClipboardCheck}
                href="/dental-queue"
                color="bg-green-600"
              />
              
              <QueueCard
                title="Doctor Queue"
                description="Students waiting for doctor consultation"
                count={queueCounts.doctor}
                icon={HiOutlineCalendar}
                href="/doctor-queue"
                color="bg-purple-600"
              />
            </div>

            <div className="mt-8 bg-white rounded-xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Queue Summary</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-sm font-medium text-gray-500">Total Students in Queue</div>
                  <div className="text-2xl font-bold text-gray-800">
                    {queueCounts.totalUsers}
                  </div>
                </div>
                
                
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageQueue;