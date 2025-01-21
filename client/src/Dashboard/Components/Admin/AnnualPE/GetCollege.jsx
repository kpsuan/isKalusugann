import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from "../../SideBar Section/Sidebar";
import "../../Annual/annual.css";
import * as XLSX from 'xlsx';

const CollegeStudents = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { collegeName } = useParams();
  
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedDegreeProgram, setSelectedDegreeProgram] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [limit] = useState(9);

  // Fetch all users for search
  const fetchAllUsers = async () => {
    try {
      const response = await fetch(`/api/user/getUsersByCollege/${collegeName}?limit=1000`);
      const data = await response.json();
      if (response.ok) {
        return data.users;
      }
      return [];
    } catch (error) {
      console.error('Error fetching all users:', error);
      return [];
    }
  };

  useEffect(() => {
    const fetchAndFilterUsers = async () => {
      setLoading(true);
      try {
        const allUsers = await fetchAllUsers();
        const filteredUsers = allUsers.filter(user => {
          const fullName = `${user.firstName} ${user.middleName || ''} ${user.lastName}`.toLowerCase();
          const matchesSearch = fullName.includes(searchQuery.toLowerCase());
          const matchesStatus = !statusFilter || user.status === statusFilter;
          const matchesDegree = !selectedDegreeProgram || user.degreeProgram === selectedDegreeProgram;
          return matchesSearch && matchesStatus && matchesDegree;
        });

        setTotalUsers(filteredUsers.length);
        const startIndex = (currentPage - 1) * limit;
        setUsers(filteredUsers.slice(startIndex, startIndex + limit));
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndFilterUsers();
  }, [collegeName, searchQuery, statusFilter, selectedDegreeProgram, currentPage]);

  const totalPages = Math.ceil(totalUsers / limit);

  const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const renderPages = () => {
      if (totalPages <= 5) {
        // Show all pages if totalPages is 5 or less
        return Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 rounded ${
              currentPage === page ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {page}
          </button>
        ));
      }
  
      const pages = [];
  
      if (currentPage > 2) {
        pages.push(
          <button
            key={1}
            onClick={() => onPageChange(1)}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            1
          </button>
        );
      }
  
      if (currentPage > 3) {
        pages.push(
          <span key="dots-left" className="px-2 py-2 text-gray-500">
            ...
          </span>
        );
      }
  
      const startPage = Math.max(1, currentPage - 1);
      const endPage = Math.min(totalPages, currentPage + 1);
  
      for (let page = startPage; page <= endPage; page++) {
        pages.push(
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-4 py-2 rounded ${
              currentPage === page ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
            }`}
          >
            {page}
          </button>
        );
      }
  
      if (currentPage < totalPages - 2) {
        pages.push(
          <span key="dots-right" className="px-2 py-2 text-gray-500">
            ...
          </span>
        );
      }
  
      if (currentPage < totalPages - 1) {
        pages.push(
          <button
            key={totalPages}
            onClick={() => onPageChange(totalPages)}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            {totalPages}
          </button>
        );
      }
  
      return pages;
    };
  
    return (
      <div className="flex justify-center gap-2 mt-4">
        {currentPage > 1 && (
          <button
            onClick={() => onPageChange(currentPage - 1)}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Prev
          </button>
        )}
        {renderPages()}
        {currentPage < totalPages && (
          <button
            onClick={() => onPageChange(currentPage + 1)}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
          >
            Next
          </button>
        )}
      </div>
    );
  };
  

  const StatusBadge = ({ status }) => {
    const getStatusColor = (status) => {
      switch (status?.toLowerCase()) {
        case 'approved': return 'bg-green-500';
        case 'denied': return 'bg-red-500';
        default: return 'bg-gray-500';
      }
    };

    return (
      <span className={`${getStatusColor(status)} text-white px-3 py-1 rounded-full text-sm`}>
        {status || 'NO ACTION'}
      </span>
    );
  };

  const handleExport = async () => {
    try {
      const allUsers = await fetchAllUsers();
      const ws = XLSX.utils.json_to_sheet(allUsers.map(user => ({
        Name: `${user.lastName}, ${user.middleName || ''} ${user.firstName}`,
        'Year Level': user.yearLevel,
        College: user.college,
        'Degree Program': user.degreeProgram,
        'Status': user.status || 'NO ACTION',
        'Remarks': user.comment?.replace(/<\/?p>/g, '') || ''
      })));
      
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Users');
      XLSX.writeFile(wb, `${collegeName.replace(/\s+/g, '_')}_Online.xlsx`);
    } catch (error) {
      console.error('Failed to export:', error);
    }
  };

  return (
    <div className="dashboard my-flex">
      <div className="dashboardContainer my-flex">
        <Sidebar />
        <div className="mainContent m-2 p-2 bg-gray-50">
          <div className="bg-gradient-to-r from-blue-700 to-cyan-500 rounded-lg p-8 mb-8 text-white">
            <h1 className="text-5xl font-bold mb-4">{collegeName}</h1>
            <p className="text-lg opacity-90 mb-6">
                View and manage student records for {collegeName}
            </p>
            <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
              View Schedule
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className='p-4 mx-auto'>
              <h2 className="text-2xl font-semibold">Student Records</h2>
                <p className="text-sm text-gray-500">
                      Total Students: {totalUsers}
                </p>
            </div>
            <div className="flex flex-wrap gap-4 mb-6 p-4">
              <input
                type="text"
                placeholder="Search by name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 min-w-[300px] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              
              <select
                value={selectedDegreeProgram}
                onChange={(e) => setSelectedDegreeProgram(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Programs</option>
                {degreeProgramOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Status</option>
                <option value="NO ACTION">No Action</option>
                <option value="approved">Approved</option>
                <option value="denied">Denied</option>
              </select>

              <button
                onClick={handleExport}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Export
              </button>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : users.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Name</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Documents</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            {user.profilePicture ? (
                              <img
                                src={user.profilePicture}
                                alt={`${user.firstName} ${user.lastName}`}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500 text-lg">
                                  {user.firstName[0]}{user.lastName[0]}
                                </span>
                              </div>
                            )}
                            <div>
                              <Link 
                                to={`/users/${user.slug}`}
                                className="text-blue-600 hover:underline font-medium"
                              >
                                {`${user.lastName}, ${user.middleName || ''} ${user.firstName}`}
                              </Link>
                              <div className="text-md text-gray-500">
                                {`${user.yearLevel} | ${user.degreeProgram}`}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="space-y-1">
                            {['peForm', 'labResults', 'requestPE', 'medcert'].map(doc => (
                              user[doc] ? (
                                <Link 
                                  key={doc}
                                  to={user[doc]}
                                  className="block text-blue-600 hover:underline text-sm"
                                >
                                  {`${user.lastName}_${doc}.pdf`}
                                </Link>
                              ) : (
                                <span key={doc} className="block text-gray-400 text-sm">Empty</span>
                              )
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <Link className="text-white hover:underline" to={`/user-status/${user._id}`}>
                            <StatusBadge status={user.status || "NO ACTION" } />
                          </Link>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          {user.comment?.replace(/<\/?p>/g, '') || 'No remarks'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                No students found
              </div>
            )}

            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const degreeProgramOptions = [
  { value: "APPLIED MATHEMATICS", label: "Applied Mathematics" },
  { value: "BIOLOGY", label: "Biology" },
  { value: "CHEMICAL ENGINEERING", label: "Chemical Engineering" },
  { value: "CHEMISTRY", label: "Chemistry" },
  { value: "COMMUNICATION AND MEDIA STUDIES", label: "Communication and Media Studies" },
  { value: "COMMUNITY DEVELOPMENT", label: "Community Development" },
  { value: "COMPUTER SCIENCE", label: "Computer Science" },
  { value: "ECONOMICS", label: "Economics" },
  { value: "FISHERIES", label: "Fisheries" },
  { value: "FOOD TECHNOLOGY", label: "Food Technology" },
  { value: "HISTORY", label: "History" },
  { value: "LITERATURE", label: "Literature" },
  { value: "POLITICAL SCIENCE", label: "Political Science" },
  { value: "PSYCHOLOGY", label: "Psychology" },
  { value: "PUBLIC HEALTH", label: "Public Health" },
  { value: "SOCIOLOGY", label: "Sociology" },
  { value: "STATISTICS", label: "Statistics" },
];

export default CollegeStudents;