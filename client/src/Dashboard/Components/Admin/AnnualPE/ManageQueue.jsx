import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../../SideBar Section/Sidebar';
import { HiOutlineCalendar, HiOutlineUsers, HiOutlineClipboardCheck, HiRefresh } from 'react-icons/hi';

const ManageQueue = () => {
  const [loading, setLoading] = useState(false);
  const [queueCounts, setQueueCounts] = useState({
    generalPE: 0,
    dental: 0,
    doctor: 0
  });
  const [refreshing, setRefreshing] = useState(false);

  const fetchQueueCounts = async () => {
    try {
      setRefreshing(true);
      
      // Fetch counts for each queue type
      const [generalPE, dental, doctor] = await Promise.all([
        fetch('/api/queue?step=generalPE').then(res => res.json()),
        fetch('/api/queue?step=dental').then(res => res.json()),
        fetch('/api/queue?step=doctor').then(res => res.json())
      ]);

      setQueueCounts({
        generalPE: generalPE.students?.length || 0,
        dental: dental.students?.length || 0,
        doctor: doctor.students?.length || 0
      });

    } catch (error) {
      toast.error('Failed to fetch queue counts: ' + error.message);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchQueueCounts();
    // auto-refresh every 30 seconds
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
            <div className="mb-8 pb-14 flex flex-col bg-gradient-to-r from-green-700 to-cyan-500 rounded-lg border border-gray-200 p-10 w-full md:flex-row md:items-center md:justify-between">
                <div>
                    <div className="text-5xl font-bold  text-white mb-4">Queue Management </div>
                    <p className="font-light my-4 text-white">
                    Monitor and manage student queues for various examinations </p>
                </div>
               
              
              <div className="mt-4 md:mt-0 flex space-x-4">
                <button
                  onClick={fetchQueueCounts}
                  disabled={refreshing}
                  className="flex items-center px-4 py-2 bg-white text-black rounded-lg hover:bg-slate-300 transition-colors duration-200 disabled:opacity-50"
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
                    {Object.values(queueCounts).reduce((a, b) => a + b, 0)}
                  </div>
                </div>
                
                <div>
                  <div className="text-sm font-medium text-gray-500">Queue Status</div>
                  <div className="text-2xl font-bold text-green-600">Active</div>
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