import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import { motion, AnimatePresence } from 'framer-motion';
import { useSelector } from 'react-redux';

const RescheduleRequest = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDegreeProgram, setSelectedDegreeProgram] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [viewMode, setViewMode] = useState('list');

  const statusOptions = [
    { value: '', label: 'All Statuses' },
    { value: 'NO ACTION', label: 'Pending' },
    { value: 'approved', label: 'Approved' },
    { value: 'denied', label: 'Rejected' }
  ];

  const degreeProgramOptions = [
    { value: "", label: "All Programs" },
    { value: "COMMUNITY DEVELOPMENT", label: "Community Development" },
    { value: "History", label: "History" },
    { value: "COMMUNICATION AND MEDIA STUDIES", label: "Communication and Media Studies" },
    { value: "LITERATURE", label: "Literature" },
    { value: "POLITICAL SCIENCE", label: "Political Science" },
    { value: "PSYCHOLOGY", label: "Psychology" },
    { value: "SOCIOLOGY", label: "Sociology" },
    { value: "APPLIED MATHEMATICS", label: "Applied Mathematics" },
    { value: "BIOLOGY", label: "Biology" },
    { value: "CHEMISTRY", label: "Chemistry" },
    { value: "COMPUTER SCIENCE", label: "Computer Science" },
    { value: "ECONOMICS", label: "Economics" },
    { value: "PUBLIC HEALTH", label: "Public Health" },
    { value: "STATISTICS", label: "Statistics" },
    { value: "FISHERIES", label: "Fisheries" },
    { value: "CHEMICAL ENGINEERING", label: "Chemical Engineering" },
    { value: "FOOD TECHNOLOGY", label: "Food Technology" },
  ];

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/user/reschedUsers', {
        headers: {
          'Cache-Control': 'max-age=3600'
        }
      });
      if (response.data && response.data.users) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error("Failed to fetch reschedule requests", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      (searchTerm === '' || 
        `${user.lastName} ${user.firstName} ${user.middleName}`.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedDegreeProgram === '' || user.degreeProgram === selectedDegreeProgram) &&
      (selectedStatus === '' || user.rescheduleStatus === selectedStatus)
    );
  }, [users, searchTerm, selectedDegreeProgram, selectedStatus]);

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'denied': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderListView = () => (
    <AnimatePresence>
      {filteredUsers.map((user, index) => (
        <motion.div 
          key={user._id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ 
            duration: 0.3, 
            delay: index * 0.1 
          }}
          className="p-4 hover:bg-blue-50 transition-all rounded-lg shadow-sm mb-2"
        >
          <div className="flex justify-between items-start">
            <div>
              <Link 
                to={`/resched-status/${user._id}`} 
                className="font-bold text-lg hover:text-blue-600"
              >
                {`${user.lastName}, ${user.firstName} ${user.middleName || ''}`}
              </Link>
              <div className="text-sm text-gray-600">
                {`${user.yearLevel} | ${user.college} | ${user.degreeProgram}`}
              </div>
            </div>
            
            <Link  className={`px-2 py-1 rounded-full text-md ${getStatusColor(user.rescheduleStatus)}`}
              to={`/resched-status/${user._id}`}>
                  
                  {user.rescheduleStatus || 'NO ACTION'}
              </Link>
          </div>

          <div className="mt-2 grid grid-cols-2 gap-4">
            <div>
              <div className="font-semibold text-sm">Original Schedule</div>
              {user.schedule.length > 0 ? (
                user.schedule.map((date, index) => (
                  <div key={index} className="text-gray-600">
                    {dateFormatter.format(new Date(date))}
                  </div>
                ))
              ) : (
                <div className="text-gray-400">No Schedule</div>
              )}
            </div>

            <div>
              <div className="font-semibold text-sm">Available Dates</div>
              {user.rescheduledDate.length > 0 ? (
                user.rescheduledDate.map((date, index) => (
                  <div key={index} className="text-gray-600">
                    {dateFormatter.format(new Date(date))}
                  </div>
                ))
              ) : (
                <div className="text-gray-400">No Reschedule</div>
              )}
            </div>
          </div>

          {user.remarks && (
            <div className="mt-2 text-sm text-gray-500">
              <strong>Remarks:</strong> {user.remarks}
            </div>
          )}

          <div className="mt-2 text-sm text-gray-500">
            Reschedule Attempts: {user.rescheduleLimit || 0}
          </div>
        </motion.div>
      ))}
    </AnimatePresence>
  );

  const renderTableView = () => (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3">Name</th>
            <th scope="col" className="px-6 py-3">Original Schedule</th>
            <th scope="col" className="px-6 py-3">Available Dates</th>
            <th scope="col" className="px-6 py-3">Status</th>
            <th scope="col" className="px-6 py-3">Attempts</th>
            <th scope="col" className="px-6 py-3">Remarks</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user._id} className="bg-white border-b hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                <Link 
                  className="text-right text-lg font-semibold text-blue-500 hover:underline" 
                  to={`/resched-status/${user._id}`}
                >
                  {`${user.lastName}, ${user.middleName || ''} ${user.firstName}`} <br />
                </Link>
                <span className="text-sm font-light">
                  {`${user.yearLevel} | ${user.college} | ${user.degreeProgram}`}
                </span>
              </td>
             
              <td className="px-6 py-4">
                {user.schedule.length > 0 
                  ? user.schedule.map((date, index) => (
                      <div key={index}>{dateFormatter.format(new Date(date))}</div>
                    ))
                  : 'No Schedule'}
              </td>
              <td className="px-6 py-4">
                {user.rescheduledDate.length > 0 
                  ? user.rescheduledDate.map((date, index) => (
                      <div key={index}>{dateFormatter.format(new Date(date))}</div>
                    ))
                  : 'No Reschedule'}
              </td>
              <td className="px-6 py-4">
                
              <Link  className={`px-2 py-1 rounded-full text-md ${getStatusColor(user.rescheduleStatus)}`}
              to={`/resched-status/${user._id}`}>
                  
                  {user.rescheduleStatus || 'NO ACTION'}
              </Link>
              </td>
              <td className="px-6 py-4">{user.rescheduleLimit || 0}</td>
              <td className="px-6 py-4">{user.remarks || 'NO REMARKS'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container m-0 p-0"
    >
      <div className="bg-white shadow-2xl overflow-hidden">
        <div className="p-4 bg-gray-200 flex space-x-4 items-center">
          <motion.input 
            whileFocus={{ scale: 1.02 }}
            type="text"
            placeholder="Search by name..."
            className="flex-grow px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <select 
            value={selectedDegreeProgram}
            onChange={(e) => setSelectedDegreeProgram(e.target.value)}
            className="px-3 py-2 border rounded-md bg-white"
          >
            {degreeProgramOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <select 
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border rounded-md bg-white"
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="flex items-center">
            <label className="mr-2">View:</label>
            <select 
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value)}
              className="px-3 py-2 border rounded-md bg-white"
            >
              <option value="list">List</option>
              <option value="table">Table</option>
            </select>
          </div>
        </div>

        {loading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ repeat: Infinity, duration: 1, repeatType: "reverse" }}
            className="text-center py-8 text-blue-600"
          >
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
            </div>
          </motion.div>
        ) : filteredUsers.length === 0 ? (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-center py-8 text-gray-500"
          >
            No reschedule requests found
          </motion.div>
        ) : (
          viewMode === 'list' ? renderListView() : renderTableView()
        )}
      </div>
    </motion.div>
  );
};

export default RescheduleRequest;