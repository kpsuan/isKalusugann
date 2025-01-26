import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Alert, Button, Modal, ModalBody, TextInput, Table, TableCell } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import Sidebar from "../../SideBar Section/Sidebar";
import "../../Annual/annual.css";
import Pagination from './Pagination'; // Adjust the import path accordingly
import StatsDashboard from './StatCard';
import { FaCalendarAlt } from 'react-icons/fa'; // Import an icon


const CourseStudents = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { courseName  } = useParams();
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(9); // keep this constant
  const [loading, setLoading] = useState(true);

  const [totalApproved, setTotalApproved] = useState(0);
  const [totalDenied, setTotalDenied] = useState(0);
  const [totalPending, setTotalPending] = useState(0);

  useEffect(() => {
    const fetchUsersByCourse = async () => {
      setLoading(true);
      try {
        const startIndex = (currentPage - 1) * limit;
        let url = `/api/user/getUsersByCourseInPerson/${courseName}?startIndex=${startIndex}&limit=${limit}`;
        if (filter) {
          url += `&searchQuery=${encodeURIComponent(filter)}`;        
        }
        if (statusFilter) {
          url += `&status=${statusFilter}`;
        }
  
        const res = await fetch(url);
        const data = await res.json();
        console.log("API Response:", data); // Log the API response for debugging
  
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setTotalApproved(data.totalApproved);
          setTotalDenied(data.totalDenied);
          setTotalPending(data.totalPending);
          
          console.log("Total Approved:", data.totalApproved);
          console.log("Total Denied:", data.totalDenied);
          console.log("Total Pending:", data.totalPending);
        }
      } catch (error) {
        console.log("Error fetching users:", error.message);
      } finally{
        setLoading(false);
      }
      
    };
  
    if (currentUser.isAdmin) {
      fetchUsersByCourse();
    }
  }, [currentUser._id, filter,  statusFilter, currentPage, limit]);
  
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setCurrentPage(1);
  };
  
  const handleViewSchedule = () => {
    navigate('/manageInPerson'); // Navigate to the desired route
  };

  const capitalizeWords = (string) => 
    string.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
  
  const totalPages = Math.ceil(totalUsers / limit);
  const statusOptions = [
    { value: "", label: "All" },
    { value: "NO ACTION", label: "No Action" },
    { value: "approved", label: "Approved" },
    { value: "denied", label: "Denied" },
  ];
  return (
    <div className="dashboard my-flex">
      <div className="dashboardContainer my-flex">
        <Sidebar />
        <div className="mainContent m-0 p-0">
          <div className=" bg-gradient-to-r from-blue-700 to-cyan-500 rounded-lg border border-gray-200 p-10 w-full">
            <div className="text-5xl font-bold  text-white mb-4">{capitalizeWords(courseName)}</div>
            <button
              className="flex items-center justify-center bg-white text-blue-700 hover:bg-blue-50 font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-md"
              onClick={handleViewSchedule}>
              <FaCalendarAlt className="mr-2" /> {/* Add an icon */}
              View Scheduled Today
            </button>
          </div>
          <div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-5">
            <div className='p-4 mx-auto'>
              <h2 className="text-2xl font-semibold">Student Records</h2>
                <p className="text-sm text-gray-500">
                      Total Students: {totalUsers}
                </p>
            </div>  
            <StatsDashboard
              totalUsers={totalUsers}
              totalApproved={totalApproved}
              totalDenied={totalDenied}
              totalPending={totalPending}
            />     
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
              {/* Search Input */}
              <div className="w-full pl-3 md:w-auto flex-grow">
                <input
                  type="text"
                  placeholder="Search by name..."
                  value={filter}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                />
              </div>

              {/* Status Filter Dropdown */}
              <div className="w-full md:w-auto flex items-center gap-2">
                <label htmlFor="status" className="text-sm font-medium text-gray-700">
                  Filter By Status:
                </label>
                <select
                  id="status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                >
                  <option value="">All</option>
                  <option value="NO ACTION">No Action</option>
                  <option value="approved">Approved</option>
                  <option value="denied">Denied</option>
                </select>
              </div>
            </div>
            <div className='my-10 table-auto overflow-x-scroll md:mx-auto p-1 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            {loading ? ( 
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
            ) :
              currentUser.isAdmin && users.length > 0 ? (
                <>
                  <Table hoverable className='shadow-md relative'>
              <Table.Head className="text-left text-lg font-medium text-gray-500 dark:text-white px-3 py-2">
                <Table.HeadCell>Name</Table.HeadCell>
                
                <Table.HeadCell>Documents</Table.HeadCell>
                <Table.HeadCell>Schedule</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Remarks</Table.HeadCell>
              </Table.Head>

              <Table.Body className="divide-y my-4">
                {users.map((user) => (
                  <Table.Row key={user._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      <div className="flex items-center space-x-4">
                        {user.profilePicture ? (
                          <img
                            src={user.profilePicture}
                            alt={`${user.firstName} ${user.lastName}`}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500">No Image</span>
                          </div>
                        )}
                        <div>
                          <Link className="text-lg font-medium text-gray-900 hover:underline" to={`/users/${user.slug}`}>
                            {`${user.lastName}, ${user.middleName || ''} ${user.firstName}`}
                          </Link>
                          <span className="text-sm font-light block">{`${user.yearLevel} | ${user.college} | ${user.degreeProgram}`}</span>
                        </div>
                      </div>
                    </Table.Cell>


                    <Table.Cell className="text-left flex-col">
                      <div>
                        {user.peForm ? (
                          <Link className="text-teal-500 hover:underline" to={user.peForm}>
                            {user.lastName}_peForm.pdf
                          </Link>
                        ) : (
                          <span className="text-gray-400">Empty</span>
                        )}
                      </div>
                      <div>
                        {user.labResults ? (
                          <Link className="text-teal-500 hover:underline" to={user.labResults}>
                            {user.lastName}_labResults.pdf
                          </Link>
                        ) : (
                          <span className="text-gray-400">Empty</span>
                        )}
                      </div>
                      <div>
                        {user.requestPE ? (
                          <Link className="text-teal-500 hover:underline" to={user.requestPE}>
                            {user.lastName}_requestPE.pdf
                          </Link>
                        ) : (
                          <span className="text-gray-400">Empty</span>
                        )}
                      </div>
                      <div>
                        {user.medcert ? (
                          <Link className="text-teal-500 hover:underline" to={user.medcert}>
                            {user.lastName}_medcert.pdf
                          </Link>
                        ) : (
                          <span className="text-gray-400">Empty</span>
                        )}
                      </div>
                    </Table.Cell>
                    <Table.Cell className="text-left text-lg">
                      {user.schedule && !isNaN(new Date(user.schedule)) ? (
                        <Link className="text-teal-500 font-light">
                          {(() => {
                            const date = new Date(user.schedule);
                            const weekday = date.toLocaleString('en-US', { weekday: 'short' });
                            const month = date.toLocaleString('en-US', { month: 'short' });
                            const day = date.getDate().toString().padStart(2, '0');
                            const year = date.getFullYear();
                            return `${weekday} ${month} ${day} ${year}`;
                          })()}
                        </Link>
                      ) : (
                        <span className="text-gray-400">No Schedule Yet</span>
                      )}
                    </Table.Cell>


                    <Table.Cell className="text-center px-2">
                            <div style={{ backgroundColor: user.status === 'approved' ? 'green' : user.status === 'denied' ? 'red' : user.status === null ? '#888888' : '#888888' }} className="px-2 py-3 w-32 rounded">
                                <Link className="text-white hover:underline" to={`/user-status/${user._id}`}>
                                    <span>{user.status || "NO ACTION"}</span>
                                </Link>
                            </div>
                    </Table.Cell>

                    <Table.Cell className="text-left">
                                {user.comment ? (
                                    <span>
                                        {user.comment
                                            .replace(/<p>/g, '')
                                            .replace(/<\/p>/g, '')
                                            .replace(/<strong>/g, '')
                                            .replace(/<\/strong>/g, '')}
                                    </span>
                                ) : (
                                    <span className="text-gray-400">Empty</span>
                                )}
                            </Table.Cell>

                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
                  <div className=' flex m-4 justify-center gap-2'>
                  <Pagination 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
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
    </div>
  );
}

export default CourseStudents;
