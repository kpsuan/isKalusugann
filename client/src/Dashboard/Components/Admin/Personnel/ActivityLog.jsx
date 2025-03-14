import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiOutlinePlusCircle, HiOutlinePencilAlt, HiOutlineClipboardList, HiOutlineCalendar, HiOutlineSearch, 
         HiOutlineFilter, HiOutlineRefresh, HiOutlineDownload, HiOutlineTrash, HiOutlineInformationCircle, 
         HiOutlineUser, HiOutlineClock, HiOutlineClipboard, HiChevronDown, HiChevronUp } from 'react-icons/hi';
import { format, parseISO } from 'date-fns';
import axios from 'axios';
import Sidebar from "../../SideBar Section/Sidebar";
import { toast, ToastContainer } from 'react-toastify';

const ActivityLog = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [expandedItems, setExpandedItems] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [users, setUsers] = useState({});
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Fetch activity logs
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/activity/get-activity');
        setLogs(response.data);
        setTotalPages(Math.ceil(response.data.length / itemsPerPage));
        setLoading(false);
        
        // Extract unique user IDs for fetching user info
        const userIds = [...new Set(
          response.data
            .map(log => log.userId?._id || (log.details?.userId && typeof log.details.userId === 'string' ? log.details.userId : null))
            .filter(id => id)
        )];
        
        if (userIds.length > 0) {
          fetchUserDetails(userIds);
        }
      } catch (err) {
        setError('Failed to load activity logs');
        toast.error('Failed to load activity logs');
        setLoading(false);
      }
    };
    fetchLogs();
  }, [itemsPerPage]);

  const fetchUserDetails = async (userIds) => {
    try {
        setLoadingUsers(true);
        
        const userPromises = userIds.map(id => axios.get(`/api/user/${id}`));
        const responses = await Promise.all(userPromises);

        const userMap = {};
        responses.forEach(res => {
            console.log("Fetched user:", res.data); // Debug log
            userMap[res.data._id] = res.data; 
        });

        setUsers(userMap);
    } catch (err) {
        console.error("Failed to fetch user details:", err);
    } finally {
        setLoadingUsers(false);
    }
};



const getUserData = (userId) => {
  if (!userId) {
    console.log("getUserData called with an empty userId");
    return { name: "Unknown", isSuperAdmin: false, image: null };
  }

  const id = typeof userId === "object" && userId._id ? userId._id : userId;

  console.log("Fetching user for ID:", id);
  console.log("Users state:", users);

  const user = users[id];

  if (user) {
    console.log("User found:", user);

    const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
    console.log("Computed fullName:", fullName);

    return {
      name: fullName || user.username || user.email || "Unknown",
      isSuperAdmin: user.isSuperAdmin || false,
      image: user.profilePicture || null, // Corrected key from `pofilePicture` to `profilePicture`
    };
  }

  console.log("User not found for ID:", id);
  return { name: "Unknown", isSuperAdmin: false, image: null };
};



  // Handle expanding log details
  const toggleDetails = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const formatDate = (dateString) => {
    try {
      return format(parseISO(dateString), "MMM dd, yyyy hh:mm:ss a");
    } catch (e) {
      return dateString;
    }
  };

  // Filter logs
  const filteredLogs = logs.filter(log => {
    // Search term filter
    const searchMatch = 
      log.action?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (log.userId?.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      JSON.stringify(log.details)?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Action type filter
    const filterMatch = filterBy === 'all' || log.action?.includes(filterBy);
    
    // Date range filter
    let dateMatch = true;
    if (dateRange.start && dateRange.end) {
      const logDate = new Date(log.timestamp);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59);
      dateMatch = logDate >= startDate && logDate <= endDate;
    }
    
    return searchMatch && filterMatch && dateMatch;
  });

  const paginatedLogs = filteredLogs.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const actionTypes = [...new Set(logs.map(log => log.action))];

  // Export logs as CSV
  const exportToCSV = () => {
    const headers = ['ID', 'User', 'Action', 'Details', 'Timestamp'];
    const csvData = filteredLogs.map(log => [
      log._id,
      getUserName(log.userId) || log.details?.modifiedBy || 'Unknown',
      log.action,
      JSON.stringify(log.details),
      formatDate(log.timestamp)
    ]);
    
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `activity_log_${new Date().toISOString().slice(0,10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getBadgeColor = (action) => {
    if (!action) return 'bg-gray-100 text-gray-800'; // Handle undefined/null
  
    const lowerCaseAction = action.toLowerCase();
  
    if (lowerCaseAction.includes('delete') || lowerCaseAction.includes('archive')) return 'bg-red-100 text-red-800';
    if (lowerCaseAction.includes('create') || lowerCaseAction.includes('add')|| lowerCaseAction.includes('restore')) return 'bg-green-100 text-green-800';
    if (lowerCaseAction.includes('status') || lowerCaseAction.includes('modified')) return 'bg-purple-100 text-purple-800';
    if (lowerCaseAction.includes('update')) return 'bg-yellow-100 text-yellow-800';
    
    return 'bg-blue-100 text-blue-800'; // Default case
  };
  

  // Reset all filters
  const resetFilters = () => {
    setSearchTerm('');
    setFilterBy('all');
    setDateRange({ start: '', end: '' });
    setPage(1);
  };

  const renderDetailItem = (label, value, icon) => {
    if (value === undefined || value === null) return null;
    
    return (
      <div className="flex items-start space-x-2 py-1.5 border-b border-gray-100 last:border-0">
        {icon && <span className="text-gray-400 mt-0.5">{icon}</span>}
        <div className="flex-1">
          <span className="text-xs font-medium text-gray-500">{label}:</span>
          {typeof value === 'object' ? (
            <pre className="mt-1 text-xs text-gray-700 overflow-auto max-h-20 bg-gray-50 p-2 rounded whitespace-pre-wrap">
              {JSON.stringify(value, null, 2)}
            </pre>
          ) : (
            <span className="ml-1 text-sm text-gray-700">{value.toString()}</span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="dashboard my-flex">
      <div className="dashboardContainer my-flex">
        <Sidebar />
        <ToastContainer className="z-50" />
        <div className="mainContent m-0 p-0">
          <div className="flex-1">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-8 sm:p-12 animate-gradient-x">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-5 md:pb-8">
                  <div className="animate-fade-in mb-4 md:mb-0">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
                      Activity Log
                    </h1>
                    <p className="text-blue-100 text-base md:text-lg">
                      Track all system actions and admin activities
                    </p>
                  </div>
                  <div className="flex space-x-3">
                    <button
                      onClick={resetFilters}
                      className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition"
                    >
                      <HiOutlineRefresh className="w-5 h-5" />
                      <span className="hidden sm:inline">Reset Filter</span>
                    </button>
                    <button
                      onClick={exportToCSV}
                      className="bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition"
                    >
                      <HiOutlineDownload className="w-5 h-5" />
                      <span className="hidden sm:inline">Export</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters Section */}
            <div className="bg-white shadow rounded-lg mx-4 md:mx-8 -mt-6 p-4 animate-slide-up">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {/* Search */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiOutlineSearch className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search logs..."
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-10 border p-2"
                  />
                </div>

                {/* Action Type Filter */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiOutlineFilter className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    value={filterBy}
                    onChange={(e) => setFilterBy(e.target.value)}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-10 border p-2"
                  >
                    <option value="all">All Actions</option>
                    {actionTypes.map((type, index) => (
                      <option key={index} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Range Start */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiOutlineCalendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-10 border p-2"
                  />
                </div>

                {/* Date Range End */}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <HiOutlineCalendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                    className="pl-10 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm h-10 border p-2"
                  />
                </div>
              </div>
            </div>

            {/* Log Entries */}
            <div className="bg-white shadow rounded-lg mx-4 md:mx-8 mt-6 overflow-hidden animate-slide-up">
              {loading ? (
                <div className="p-12 text-center">
                  <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading activity logs...</p>
                </div>
              ) : error ? (
                <div className="p-12 text-center text-red-500">
                  <HiOutlineInformationCircle className="w-12 h-12 mx-auto mb-4" />
                  <p>{error}</p>
                </div>
              ) : paginatedLogs.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  <HiOutlineClipboardList className="w-12 h-12 mx-auto mb-4" />
                  <p>No activity logs found</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Action
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            User
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Timestamp
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Details
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {paginatedLogs.map((log) => (
                          <React.Fragment key={log._id}>
                            <tr className={`hover:bg-gray-50 transition-colors ${expandedItems[log._id] ? 'bg-blue-50' : ''}`}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getBadgeColor(log.action)}`}>
                                  {log.action}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              <div className="flex items-center">
                                {(() => {
                                  const { name, isSuperAdmin, image } = getUserData(log.userId); // ✅ Destructure `image` properly

                                  return (
                                    <>
                                      <div className="flex-shrink-0 h-8 w-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 overflow-hidden">
                                        {image ? (
                                          <img src={image} alt={name} className="h-full w-full object-cover" />
                                        ) : (
                                          <HiOutlineUser className="h-5 w-5" />
                                        )}
                                      </div>
                                      <div className="ml-3">
                                        <div className="text-sm font-medium text-gray-900">{name}</div>

                                        {console.log("Checking isSuperAdmin for:", log.userId, users[log.userId])}

                                        {isSuperAdmin ? (
                                          <div className="text-xs text-gray-500">Superadmin</div>
                                        ) : (
                                          log.details?.role && <div className="text-xs text-gray-500">{log.details.role}</div>
                                        )}
                                      </div>
                                    </>
                                  );
                                })()}
                              </div>


                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <div className="flex items-center">
                                  <HiOutlineClock className="h-4 w-4 mr-1.5 text-gray-400" />
                                  {formatDate(log.timestamp)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <button 
                                  onClick={() => toggleDetails(log._id)}
                                  className={`text-blue-600 hover:text-blue-800 flex items-center space-x-1 focus:outline-none ${expandedItems[log._id] ? 'font-medium' : ''}`}
                                >
                                  <span>{expandedItems[log._id] ? 'Hide Details' : 'View Details'}</span>
                                  {expandedItems[log._id] ? <HiChevronUp className="w-4 h-4" /> : <HiChevronDown className="w-4 h-4" />}
                                </button>
                              </td>
                            </tr>
                            {expandedItems[log._id] && (
                              <tr>
                                <td colSpan="4" className="px-6 py-4 bg-gray-50 border-b">
                                  <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200">
                                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                                      Activity Details
                                    </h4>
                                    <div className="divide-y divide-gray-100">
                                      {/* Display common fields */}
                                      {renderDetailItem('ID', log._id, <HiOutlineClipboard className="h-4 w-4" />)}
                                      {renderDetailItem('User ID', log.userId?._id || log.details?.userId, <HiOutlineUser className="h-4 w-4" />)}
                                      {renderDetailItem('Name', log.userId?.firstName || log.details?.modifiedBy, <HiOutlineUser className="h-4 w-4" />)}

                                      {log.details?.approvedAt && renderDetailItem('Approved At', formatDate(log.details.approvedAt), <HiOutlineClock className="h-4 w-4" />)}
                                      
                                     
                                      
                                      {/* Any other details as an object */}
                                      {Object.keys(log.details || {}).length > 0 && (
                                        <div className="py-2">
                                          <span className="text-xs font-medium text-gray-500">All Details:</span>
                                          <div className="mt-1.5 bg-gray-50 rounded-md p-3 overflow-auto max-h-60">
                                            <pre className="text-xs text-gray-700 whitespace-pre-wrap">
                                              {JSON.stringify(log.details, null, 2)}
                                            </pre>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                    <div className="flex-1 flex justify-between sm:hidden">
                      <button
                        onClick={() => setPage(Math.max(1, page - 1))}
                        disabled={page === 1}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white ${page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setPage(Math.min(totalPages, page + 1))}
                        disabled={page === totalPages}
                        className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white ${page === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                      >
                        Next
                      </button>
                    </div>
                    <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <p className="text-sm text-gray-700">
                          Showing <span className="font-medium">{((page - 1) * itemsPerPage) + 1}</span> to{' '}
                          <span className="font-medium">{Math.min(page * itemsPerPage, filteredLogs.length)}</span> of{' '}
                          <span className="font-medium">{filteredLogs.length}</span> results
                        </p>
                      </div>
                      <div>
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                          <button
                            onClick={() => setPage(1)}
                            disabled={page === 1}
                            className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 ${page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                          >
                            <span className="sr-only">First</span>
                            <span>First</span>
                          </button>
                          <button
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page === 1}
                            className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 ${page === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                          >
                            <span className="sr-only">Previous</span>
                            <span>Prev</span>
                          </button>
                          
                          {/* Page numbers */}
                          {[...Array(Math.min(5, totalPages)).keys()].map((i) => {
                            const pageNum = Math.min(
                              Math.max(1, page - 2) + i,
                              totalPages
                            );
                            if (pageNum <= totalPages) {
                              return (
                                <button
                                  key={pageNum}
                                  onClick={() => setPage(pageNum)}
                                  className={`relative inline-flex items-center px-4 py-2 border ${page === pageNum
                                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                    } text-sm font-medium`}
                                >
                                  {pageNum}
                                </button>
                              );
                            }
                            return null;
                          })}
                          
                          <button
                            onClick={() => setPage(Math.min(totalPages, page + 1))}
                            disabled={page === totalPages}
                            className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 ${page === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                          >
                            <span className="sr-only">Next</span>
                            <span>Next</span>
                          </button>
                          <button
                            onClick={() => setPage(totalPages)}
                            disabled={page === totalPages}
                            className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 ${page === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-50'}`}
                          >
                            <span className="sr-only">Last</span>
                            <span>Last</span>
                          </button>
                        </nav>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Items per page selector */}
            <div className="bg-white shadow rounded-lg mx-4 md:mx-8 mt-6 p-4 flex justify-end animate-slide-up">
              <div className="flex items-center space-x-2">
                <label className="text-sm text-gray-600">Items per page:</label>
                <select 
                  value={itemsPerPage} 
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setPage(1);
                  }}
                  className="border border-gray-300 rounded-md text-sm p-1"
                >
                  {[5, 10, 25, 50, 100].map(value => (
                    <option key={value} value={value}>{value}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActivityLog;

// Add these custom animations to your CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes gradient-x {
    0%, 100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }
  
  .animate-gradient-x {
    background-size: 200% 200%;
    animation: gradient-x 15s ease infinite;
  }
  
  @keyframes fade-in {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  
  .animate-fade-in {
    animation: fade-in 0.3s ease-out;
  }
  
  @keyframes slide-up {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-slide-up {
    animation: slide-up 0.5s ease-out;
  }
`;
document.head.appendChild(style);