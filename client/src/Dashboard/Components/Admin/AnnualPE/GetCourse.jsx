import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from "../../SideBar Section/Sidebar";
import "../../Annual/annual.css";
import { Search } from 'lucide-react';
import StatsDashboard from './StatCard';

const CourseStudents = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { courseName } = useParams();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  
  const [totalApproved, setTotalApproved] = useState(0);
  const [totalDenied, setTotalDenied] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const limit = 9;

  const capitalizeWords = (string) => 
    string.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const searchParams = new URLSearchParams({
          startIndex: (currentPage - 1) * limit,
          limit,
          status: statusFilter,
          search: searchQuery
        });
        
        const response = await fetch(`/api/user/getUsersByCourse/${courseName}?${searchParams}`);
        const data = await response.json();
        
        if (response.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setTotalApproved(data.totalApproved);
          setTotalDenied(data.totalDenied);
          setTotalPending(data.totalPending);
          setTotalPages(Math.ceil(data.totalUsers / limit));
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchUsers, 300);
    return () => clearTimeout(debounceTimer);
  }, [courseName, statusFilter, currentPage, searchQuery]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-500';
      case 'denied':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="dashboard my-flex">
      <div className="dashboardContainer my-flex">
        <Sidebar />
        <div className="mainContent m-2 p-2 bg-gray-50">
            <div className="mb-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg p-8 text-white">
              <h1 className="text-5xl font-bold mb-4">{capitalizeWords(courseName)}</h1>
              <p className="text-lg opacity-90 mb-6">
                View and manage student records for {capitalizeWords(courseName)}
              </p>
              <button className="bg-white text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                Go to Colleges
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-semibold">Student Records</h2>
                    <p className="text-sm text-gray-500">
                      Total Students: {totalPages * limit}
                    </p>
                  </div>
                </div>
                <StatsDashboard
              totalUsers={totalUsers}
              totalApproved={totalApproved}
              totalDenied={totalDenied}
              totalPending={totalPending}
            />  

                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search by name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                  >
                    <option value="">All Status</option>
                    <option value="NO ACTION">No Action</option>
                    <option value="approved">Approved</option>
                    <option value="denied">Denied</option>
                  </select>
                </div>

                {loading ? (
                  <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                  </div>
                ) : users.length > 0 ? (
                  <>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documents</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Dentist</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Doctor</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Remarks</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {users.map((user) => (
                            <tr key={user._id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center space-x-4">
                                  {user.profilePicture ? (
                                    <img
                                      src={user.profilePicture}
                                      alt={`${user.firstName} ${user.lastName}`}
                                      className="w-12 h-12 rounded-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                      <span className="text-2xl text-gray-500">
                                        {user.firstName[0]}
                                        {user.lastName[0]}
                                      </span>
                                    </div>
                                  )}
                                  <div className="ml-4">
                                    <Link
                                      to={`/users/${user.slug}`}
                                      className="text-lg font-medium text-gray-900 hover:text-blue-600"
                                    >
                                      {`${user.lastName}, ${user.firstName}`}
                                    </Link>
                                    <p className="text-md text-gray-500">
                                      {`${user.yearLevel} | ${user.college}`}
                                    </p>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <div className="space-y-1">
                                  {['peForm', 'labResults', 'requestPE', 'medcert'].map((doc) => (
                                    user[doc] ? (
                                      <Link
                                        key={doc}
                                        to={user[doc]}
                                        className="block text-sm text-blue-500 hover:underline"
                                      >
                                        {`${user.lastName}_${doc}.pdf`}
                                      </Link>
                                    ) : (
                                      <div key={doc} className="block text-sm text-gray-500">
                                        Empty
                                      </div>
                                    )
                                  ))}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                <Link className="text-white hover:underline" to={`/user-status/${user._id}`}>
                                    <span className={`${getStatusColor(user.status)} px-3 py-1 rounded-full text-white text-sm`}>
                                      {user.status || "NO ACTION"}</span>
                                </Link>
                              </td>
                              <td className="px-6 py-4">
                                <Link className="text-white hover:underline" to={`/user-status/${user._id}`}>
                                    <span className={`${getStatusColor(user.dentistStatus)} px-3 py-1 rounded-full text-white text-sm`}>
                                      {user.dentistStatus || "NO ACTION"}</span>
                                </Link>
                              </td>
                              <td className="px-6 py-4">
                                <Link className="text-white hover:underline" to={`/user-status/${user._id}`}>
                                    <span className={`${getStatusColor(user.doctorStatus)} px-3 py-1 rounded-full text-white text-sm`}>
                                      {user.doctorStatus || "NO ACTION"}</span>
                                </Link>
                              </td>
                              <td className="px-6 py-4">
                                <p className="text-sm text-gray-600">
                                  {user.comment?.replace(/<\/?p>/g, '') || 'No remarks'}
                                </p>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="flex justify-center gap-2 mt-6">
                      {[...Array(totalPages)].map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentPage(i + 1)}
                          className={`w-8 h-8 rounded-lg ${
                            currentPage === i + 1
                              ? 'bg-blue-500 text-white'
                              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-center py-12">
                    <p className="text-xl text-gray-500">No students found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
    </div>
    </div>
  );
};

export default CourseStudents;