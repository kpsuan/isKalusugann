import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { 
    HiOutlineTrash, 
    HiOutlineUserGroup, 
    HiOutlineUserAdd, 
    HiOutlineDownload,
    HiOutlineRefresh
  } from 'react-icons/hi';
  import { FaFileUpload, FaGraduationCap, FaUserPlus, FaFilter } from 'react-icons/fa';
import Sidebar from "../../SideBar Section/Sidebar";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AddStudentModal from './AddStudentModal';
import ImportStudentsModal from './ImportStudentModal';
import { useDispatch } from 'react-redux';

import * as XLSX from 'xlsx'; // Import the XLSX library

const ArchiveStudents = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [limit] = useState(9);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedUserId, setSelectedUserId] = useState(null);



  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);

  const [graduationFilter, setGraduationFilter] = useState("all"); // "all", "graduating", "active"
  const [collegeFilter, setCollegeFilter] = useState("");
  const [degreeProgramFilter, setDegreeProgramFilter] = useState("");
  const [yearLevelFilter, setYearLevelFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("desc"); // "asc" or "desc"
  const [sortField, setSortField] = useState("lastName");
  const [yearLevels, setYearLevels] = useState(["1st Year", "2nd Year", "3rd Year", "4th Year", "5th Year"]);
  const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
  const [isArchiveUserModalOpen, setIsArchiveUserModalOpen] = useState(false);

  
  const dispatch = useDispatch();

  useEffect(() => {
     const fetchUsers = async () => {
       setLoading(true); 
       setError(null); 
       try {
         const startIndex = (currentPage - 1) * limit;
         let url = `/api/user/get-archived?startIndex=${startIndex}&limit=${limit}`;
         if (filter) {
           url += `&searchQuery=${encodeURIComponent(filter)}`;        
         }
         if (graduationFilter === "graduating") {
            url += `&isGraduating=true`;
          } else if (graduationFilter === "active") {
            url += `&isGraduating=false`;
          }
          
          if (collegeFilter) {
            url += `&college=${encodeURIComponent(collegeFilter)}`;
          }
          
          if (degreeProgramFilter) {
            url += `&degreeProgram=${encodeURIComponent(degreeProgramFilter)}`;
          }
          
          if (yearLevelFilter) {
            url += `&yearLevel=${encodeURIComponent(yearLevelFilter)}`;
          }
         
         const res = await fetch(url);
         const data = await res.json();
         if (res.ok) {
           setUsers(data.users);
           setTotalUsers(data.totalUsers);
           setTotalArchived(data.totalInactive)
           setTotalGraduating(data.totalGraduating);
           setStudents(data.users);
           setIsLoading(false);
            
           // Extract unique colleges and degree programs for filters
           const uniqueColleges = [...new Set(data.users.map(user => user.college))].filter(Boolean);
           const uniqueDegreePrograms = [...new Set(data.users.map(user => user.degreeProgram))].filter(Boolean);
           
           setColleges(uniqueColleges);
           setDegreePrograms(uniqueDegreePrograms);

         } else {
           setError(data.message || "Failed to fetch users.");
           setIsLoading(false);
         }
       } catch (error) {
         setError("An error occurred while fetching users.");
         setIsLoading(false);
       } finally {
         setLoading(false);
       }
     };
 
     if (currentUser && currentUser.isAdmin) {
       fetchUsers();
     } else {
       // If it's not an admin, still set loading to false
       setIsLoading(false);
     }
   }, [currentUser, filter, currentPage, limit, graduationFilter, collegeFilter, degreeProgramFilter, yearLevelFilter, sortOrder, sortField]);
 

   const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setCurrentPage(1);
  };
 

   const handleGraduationFilterChange = (value) => {
    setGraduationFilter(value);
    setCurrentPage(1);
  };
  
  const handleResetFilters = () => {
    setFilter("");
    setGraduationFilter("all");
    setCollegeFilter("");
    setDegreeProgramFilter("");
    setYearLevelFilter("");
    setSortOrder("desc");
    setSortField("lastName");
    setCurrentPage(1);
  };

  const handleExport = async () => {
    try {
      const response = await fetch('/api/user/getall?limit=all');
      const data = await response.json();
  
      console.log('Fetched data:', data);
  
      const allUsers = Array.isArray(data.users) ? data.users : [];
  
      // Get current date (YYYY,MM,DD format)
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0'); // Ensure two-digit format
      const day = String(now.getDate()).padStart(2, '0'); 
  
      const fileName = `[ARCHIVED]Student_Data_${year}_${month}_${day} exported.xlsx`;
  
      const ws = XLSX.utils.json_to_sheet(allUsers.map(user => ({
        'firstName': user.firstName,
        'middleName': user.middleName,
        'lastName': user.lastName,
        'Year Level': user.yearLevel,
        College: user.college,
        'degreeProgram': user.degreeProgram,
        'peForm': user.peForm ? `${user.lastName}_peForm.pdf` : 'Empty',
        'labResults': user.labResults ? `${user.lastName}_labResults.pdf` : 'Empty',
        'requestPE': user.requestPE ? `${user.lastName}_requestPE.pdf` : 'Empty',
        'medcert': user.medcert ? `${user.lastName}_medcert.pdf` : 'Empty',
        schedule: user.schedule || 'NAN',
        status: user.status || 'NO ACTION',
      })));
  
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Users');
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      console.error('Failed to export users:', error);
    }
  };
  
  const handleRestoreArchived = async (userId) => {
    console.log(userId);
    try {
        const res = await fetch(`/api/user/restore-archive/${userId}`, {
            method: 'PUT',
        });

        const data = await res.json();

        if (!res.ok) {
            toast.error(data.message || 'Failed to restore student');
            return;
        }

        // Fetch restored user details
        const userRes = await fetch(`/api/user/${userId}`);
        const userData = await userRes.json();

        if (!userRes.ok) {
            toast.error('Failed to retrieve user details for logging');
            return;
        }

        // Log activity 
        const now = new Date(); // Get current timestamp

        const approvalLog = {
            modifiedBy: `${currentUser.firstName} ${currentUser.lastName}`,
            role: currentUser.isSuperAdmin ? "superadmin" : currentUser.role || "user",
            approvedAt: now.toISOString(),
            userId: currentUser._id,
            restoredUser: {
                id: userData._id,
                name: `${userData.firstName} ${userData.lastName}`,
                email: userData.email,
                degreeProgram: userData.degreeProgram,
            }
        };

        try {
            const logResponse = await fetch("/api/activity/log", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: currentUser?._id,
                    action: `${currentUser.role} restored student ${userData.firstName} ${userData.lastName} back to database`,
                    details: approvalLog,
                }),
            });

            const logData = await logResponse.json();

            if (!logResponse.ok) {
                throw new Error(`Activity log failed: ${logData.error || "Unknown error"}`);
            }

            console.log("Activity log success:", logData);
        } catch (error) {
            console.error("Error logging activity:", error);
        }

        toast.success('Student restored successfully');
        setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
        toast.error('An error occurred while restoring student');
    }
};

  
  const handleRestoreAllArchived = async () => {
    try {
      const res = await fetch(`/api/user/restore-allArchived`, {
        method: 'PUT',
      });
  
      const data = await res.json();
  
      if (!res.ok) {
        toast.error(data.message || 'Failed to restore archived users');
        return;
      }
  
      //Log activity 
      const now = new Date(); // Get current timestamp

      const approvalLog = {
        modifiedBy: `${currentUser.firstName} ${currentUser.lastName}`,
        role: currentUser.isSuperAdmin ? "superadmin" : currentUser.role || "user",
        approvedAt: now.toISOString(), 
        userId: currentUser._id, 
      };
      
      try {
        const logResponse = await fetch("/api/activity/log", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: currentUser?._id, 
            action: `${currentUser.role} restored all students back to database`,
            details: approvalLog,
          }),
        });
      
        const logData = await logResponse.json();
        
        if (!logResponse.ok) {
          throw new Error(`Activity log failed: ${logData.error || "Unknown error"}`);
        }
      
        console.log("Activity log success:", logData);
      } catch (error) {
        console.error("Error logging activity:", error);
      }

      toast.success(`${data.message}`);
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      toast.error('An error occurred while restoring archived users');
    }
  };
  


  return (
    <div className="dashboard my-flex">
        <div className="dashboardContainer my-flex">
            <Sidebar />
            <ToastContainer className="z-50" />
            <div className="mainContent m-0 p-0">
                <div className="flex-1 overflow-auto">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-rose-600 to-red-500 p-8">
                    <div className="max-w-7xl p-8 mx-auto">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between pb-6">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-2">
                            Archived Students
                            </h1>
                            <p className="text-blue-100">
                            View, add, import and manage student accounts
                            </p>
                        </div>
                        
                        {currentUser && currentUser.isAdmin && (
                            <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
                            <button
                                onClick={() => setIsArchiveModalOpen(true)}
                                className="inline-flex items-center px-4 py-2 bg-white text-red-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                            >
                                <FaUserPlus className="w-4 h-4 mr-2" />
                                Restore All Student
                            </button>
                
                           </div>
                        )}
                        </div>
                    </div>
                    </div>
                    
                    {/* Main Content */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="bg-white rounded-lg shadow-sm p-4">
                        <div className="flex items-center">
                          <div className="bg-blue-100 p-3 rounded-full">
                            <HiOutlineUserGroup className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="ml-4">
                            <h2 className="text-sm font-medium text-gray-500">Total Students</h2>
                            <p className="text-2xl font-semibold text-gray-800">{totalUsers}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                          <h2 className="text-xl font-semibold text-gray-800 mb-4 sm:mb-0">Student Directory</h2>
                          
                          <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                            {/* Search Input */}
                            <div className="relative w-full sm:w-auto mb-3 sm:mb-0">
                              <input
                                type="text"
                                placeholder="Search students..."
                                className="pl-10 pr-4 py-2 w-full sm:w-64 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={filter}
                                onChange={handleFilterChange}
                              />
                              <div className="absolute left-3 top-2.5 text-gray-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                              </div>
                            </div>
                            
                            
                            
                            {/* Filter button */}
                            <button
                              onClick={() => setIsFilterModalOpen(true)}
                              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                            >
                              <FaFilter className="w-4 h-4 mr-2 text-gray-500" />
                              <span>Filters</span>
                            </button>
                            
                            <button
                                onClick={handleExport}
                                className="inline-flex items-center px-4 py-2 bg-white text-green-600 rounded-lg font-medium hover:bg-blue-50 transition-colors"
                            >
                                <FaUserPlus className="w-4 h-4 mr-2" />
                                Export
                            </button>
                          </div>
                        </div>
                        
                        {/* Active filters display */}
                        {(collegeFilter || degreeProgramFilter || yearLevelFilter || graduationFilter !== "all") && (
                          <div className="mb-4 flex flex-wrap gap-2">
                            <span className="text-sm text-gray-500">Active filters:</span>
                            
                            {graduationFilter !== "all" && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                {graduationFilter === "graduating" ? "Graduating" : "Active"}
                                <button 
                                  className="ml-1 text-blue-600 hover:text-blue-800"
                                  onClick={() => setGraduationFilter("all")}
                                >
                                  &times;
                                </button>
                              </span>
                            )}
                            
                            {collegeFilter && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                College: {collegeFilter}
                                <button 
                                  className="ml-1 text-blue-600 hover:text-blue-800"
                                  onClick={() => setCollegeFilter("")}
                                >
                                  &times;
                                </button>
                              </span>
                            )}
                            
                            {degreeProgramFilter && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                Program: {degreeProgramFilter}
                                <button 
                                  className="ml-1 text-blue-600 hover:text-blue-800"
                                  onClick={() => setDegreeProgramFilter("")}
                                >
                                  &times;
                                </button>
                              </span>
                            )}
                            
                            {yearLevelFilter && (
                              <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                Year: {yearLevelFilter}
                                <button 
                                  className="ml-1 text-blue-600 hover:text-blue-800"
                                  onClick={() => setYearLevelFilter("")}
                                >
                                  &times;
                                </button>
                              </span>
                            )}
                          </div>
                        )}
                            {isLoading ? (
                            <div className="flex justify-center items-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                            ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>

                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users.map((student) => (
                                    <tr key={student.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-lg font-medium text-gray-900">
                                        {`${student.firstName} ${student.middleName} ${student.lastName}`}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                        {`${student.yearLevel} |  ${student.college} | ${student.degreeProgram}`}
                                        </div>

                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500">{student.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                        {student.isActive ? (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                            Active
                                            </span>
                                        ) : (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                            Inactive
                                            </span>
                                        )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                        
                                        <button 
                                        onClick={() => {
                                            setSelectedUserId(student._id);
                                            setIsArchiveUserModalOpen(true);
                                        }}
                                        className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                        Restore
                                        </button>

                                        
                                        </td>
                                       
                                    </tr>
                                    ))}
                                </tbody>
                                </table>
                                
                                {users.length === 0 && (
                                <div className="text-center py-10">
                                    <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No students found</h3>
                                    <p className="mt-1 text-sm text-gray-500">Get started by adding a new student or importing students.</p>
                                </div>
                                )}
                            </div>
                            )}

                            {/* Pagination Controls */}
                            {totalUsers > limit && (
                            <div className="flex justify-center mt-6">
                                <nav className="flex items-center">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className={`px-3 py-1 rounded-md mr-2 ${
                                    currentPage === 1 
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Previous
                                </button>
                                
                                <span className="text-sm text-gray-700">
                                    Page {currentPage} of {Math.ceil(totalUsers / limit)}
                                </span>
                                
                                <button
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                    disabled={currentPage >= Math.ceil(totalUsers / limit)}
                                    className={`px-3 py-1 rounded-md ml-2 ${
                                    currentPage >= Math.ceil(totalUsers / limit)
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                                >
                                    Next
                                </button>
                                </nav>
                            </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
      </div>
      

        {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        Filter Students
                    </h3>
                    
                    <div className="space-y-4">
                        {/* College Filter */}
                        <div>
                        <label htmlFor="collegeFilter" className="block text-sm font-medium text-gray-700">College</label>
                        <select
                            id="collegeFilter"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                            value={collegeFilter}
                            onChange={(e) => setCollegeFilter(e.target.value)}
                        >
                            <option value="">All Colleges</option>
                            <option value="CAS">CAS</option>
                            <option value="SOTECH">SOTECH</option>
                            <option value="FISHERIES">FISHERIES</option>
                        </select>
                        </div>
                        
                        {/* Degree Program Filter */}
                        <div>
                        <label htmlFor="programFilter" className="block text-sm font-medium text-gray-700">Degree Program</label>
                        <select
                            id="programFilter"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                            value={degreeProgramFilter}
                            onChange={(e) => setDegreeProgramFilter(e.target.value)}
                        >
                            <option value="">All Programs</option>
                            {[
                            { value: "", label: "All Programs" },
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
                            { value: "STATISTICS", label: "Statistics" }
                        ].map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                        </select>
                        </div>
                        
                        {/* Year Level Filter */}
                        <div>
                        <label htmlFor="yearFilter" className="block text-sm font-medium text-gray-700">Year Level</label>
                        <select
                            id="yearFilter"
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                            value={yearLevelFilter}
                            onChange={(e) => setYearLevelFilter(e.target.value)}
                        >
                            <option value="">All Year Levels</option>
                            {yearLevels.map((year, index) => (
                            <option key={index} value={year}>{year}</option>
                            ))}
                        </select>
                        </div>
                        
                        {/* Sort Options */}
                        <div>
                        <label htmlFor="sortField" className="block text-sm font-medium text-gray-700">Sort By</label>
                        <div className="mt-1 flex space-x-2">
                            <select
                            id="sortField"
                            className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                            value={sortField}
                            onChange={(e) => setSortField(e.target.value)}
                            >
                            <option value="lastName">Last Name</option>
                            <option value="firstName">First Name</option>
                            <option value="college">College</option>
                            <option value="degreeProgram">Degree Program</option>
                            <option value="yearLevel">Year Level</option>
                            </select>
                            
                            <select
                            id="sortOrder"
                            className="block w-40 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            >
                            <option value="asc">Ascending</option>
                            <option value="desc">Descending</option>
                            </select>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
                
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                    type="button"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => {
                    setCurrentPage(1); // Reset to first page when applying new filters
                    setIsFilterModalOpen(false);
                    }}
                >
                    Apply Filters
                </button>
                <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setIsFilterModalOpen(false)}
                >
                    Cancel
                </button>
                <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => {
                    handleResetFilters();
                    setIsFilterModalOpen(false);
                    }}
                >
                    Reset All
                </button>
                </div>
            </div>
            </div>
        </div>
        )}

          {/* Restore Archived Students Confirmation Modal */}
              {isArchiveModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto mb-4">
                      <FaGraduationCap className="w-6 h-6 text-red-600" />
                    </div>
                    
                    <h3 className="text-lg font-medium text-gray-900 text-center mb-2">Restore Archived Students</h3>
                    <p className="text-sm text-gray-500 text-center mb-4">
                      Are you sure you want to restore all archived students? Action cannot be undone.
                    </p>
                    
                    <div className="flex justify-center space-x-3 mt-4">
                      <button
                        onClick={() => setIsArchiveModalOpen(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleRestoreAllArchived}
                        className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700"
                      >
                        Yes, Archive
                      </button>
                    </div>
                  </div>
                </div>
              )}

        
          {/* Restore Archived Students Confirmation Modal */}
          {isArchiveUserModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mx-auto mb-4">
                      <FaGraduationCap className="w-6 h-6 text-green-600" />
                    </div>
                    
                    <h3 className="text-lg font-medium text-gray-900 text-center mb-2">Restore Student</h3>
                    <p className="text-sm text-gray-500 text-center mb-4">
                      Are you sure you want to restore archived student? Action cannot be undone.
                    </p>
                    
                    <div className="flex justify-center space-x-3 mt-4">
                        <button
                        onClick={() => setIsArchiveUserModalOpen(false)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                        >
                        Cancel
                        </button>
                        <button
                        onClick={() => handleRestoreArchived(selectedUserId)}
                        className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-red-700"
                        >
                        Yes, Restore
                        </button>
                    </div>
                  </div>
                </div>
          )}

      {/* Custom CSS for animations */}
      <style jsx>{`
        @keyframes slideInRight {
          from { transform: translateX(20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        .slide-in-right {
          animation: slideInRight 0.3s ease-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default ArchiveStudents;