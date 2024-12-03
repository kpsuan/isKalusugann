import Sidebar from "../../SideBar Section/Sidebar";
import Top from "../../Profile/Components/Header";
import "../../Annual/annual.css";
import { Table, TableCell } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import Pagination from './Pagination'; // Adjust the import path accordingly
import Select from 'react-select';
import * as XLSX from 'xlsx'; // Import the XLSX library
import { PiUsersFourLight } from "react-icons/pi";
import { FaCheck } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";
import { LuPin } from "react-icons/lu";

const NoDocsSubmitted = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [selectedDegreeProgram, setSelectedDegreeProgram] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [documentStatusFilter, setDocumentStatusFilter] = useState(""); // New state for document status
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(9); // Keep this constant
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalApproved, setTotalApproved] = useState(0);
  const [totalDenied, setTotalDenied] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true); // Set loading to true
      setError(null); // Reset error state
      try {
        const startIndex = (currentPage - 1) * limit;
        let url = `/api/user/no-docs?startIndex=${startIndex}&limit=${limit}`;
        if (filter) {
          url += `&filter=${filter}`;
        }
        if (selectedDegreeProgram) {
          url += `&degreeProgram=${selectedDegreeProgram}`;
        }
        if (statusFilter) {
          url += `&status=${statusFilter}`;
        }
        
        const res = await fetch(url);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          setTotalApproved(data.totalApproved);
          setTotalDenied(data.totalDenied);
          setTotalPending(data.totalPending);
        } else {
          setError(data.message || "Failed to fetch users."); // Set error message
        }
      } catch (error) {
        setError("An error occurred while fetching users."); // Handle fetch error
      } finally {
        setLoading(false); // Reset loading state
      }
    };

    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id, filter, selectedDegreeProgram, statusFilter,  currentPage, limit]);

  const handleShowMore = async () => {
    setCurrentPage(prev => prev + 1);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setCurrentPage(1);
  };

  const handleDegreeProgramChange = (selectedOption) => {
    setSelectedDegreeProgram(selectedOption ? selectedOption.value : "");
    setFilter(""); // Reset the filter when selecting a degree program
    setCurrentPage(1);
  };

  const handleStatusFilterChange = (selectedOption) => {
    setStatusFilter(selectedOption ? selectedOption.value : "");
    setCurrentPage(1);
  };

  

  
  const totalPages = Math.ceil(totalUsers / limit);
  const degreeProgramOptions = [
    { value: "", label: "All" },
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
    { value: "History", label: "History" },
    { value: "LITERATURE", label: "Literature" },
    { value: "POLITICAL SCIENCE", label: "Political Science" },
    { value: "PSYCHOLOGY", label: "Psychology" },
    { value: "PUBLIC HEALTH", label: "Public Health" },
    { value: "SOCIOLOGY", label: "Sociology" },
    { value: "STATISTICS", label: "Statistics" },
  ];
  

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
        <div className="mainContent">
          <div className="bg-white rounded-lg border border-gray-200 p-10 w-full">
            <h1 className="text-2xl font-bold mb-4">Users with No Submissions</h1>
            <p className="font-light my-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec nisl quis risus eleifend venenatis. Mauris nec justo nec ligula suscipit consequat. Donec rutrum nisi nec faucibus euismod. Sed sit amet vestibulum metus.
            </p>
            <button 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => navigate('/manage-online')}>
              View All Users
            </button>
          </div>
            <div>
        <div className="flex space-x-8 my-4"> 
            <div className="my-4">
            <span className="font-bold block">Total Users</span> 
            <div className="flex items-center mt-1"> 
                <PiUsersFourLight className="mr-1 text-2xl" /> 
                <span>{totalUsers}  </span>
            </div> 
            </div>
            
            <div className="h-12 my-4 w-px bg-gray-300"></div>

            <div className="my-4">
            <span className="font-bold block">Approved</span> 
            <div className="flex items-center mt-1"> 
                <FaCheck className="mr-1 text-2xl text-green-500" /> 
                <span>{totalApproved} </span> 
            </div> 
            </div>

            <div className="h-12 my-4 w-px bg-gray-300"></div>


            <div className="my-4">
            <span className="font-bold block">Denied</span> 
            <div className="flex items-center mt-1 text-red-500"> 
                <FaCircleXmark className="mr-1 text-2xl" /> 
                <span>{totalDenied} </span> 
            </div> 
            </div>

            <div className="h-12 my-4 w-px bg-gray-300"></div>


            <div className="my-4">
            <span className="font-bold block">Pending</span> 
            <div className="flex items-center mt-1"> 
                <LuPin className="mr-1 text-2xl text-yellow-500" /> 
                <span>{totalPending} </span> 
            </div> 
            </div>

        </div>

        <div className='table-auto overflow-x-scroll md:mx-auto p-1 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            
                <div className="flex justify-start">
                <div className="flex items-center ">
                    <input
                    type="text"
                    placeholder="Search..."
                    value={filter}
                    onChange={handleFilterChange}
                    className="w-80 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                    />
                </div>

                <div className="flex items-center ml-4 w-64">
                    <Select
                    id="degreeProgram"
                    value={selectedDegreeProgram}
                    onChange={handleDegreeProgramChange}
                    options={degreeProgramOptions}
                    placeholder={selectedDegreeProgram ? selectedDegreeProgram.label : "Course"}
                    className="w-full"
                    />
                </div>

                <div className="flex items-center ml-4 w-40">
                    <Select
                    id="status"
                    value={statusFilter}
                    onChange={handleStatusFilterChange}
                    options={statusOptions}
                    placeholder={statusFilter ? statusFilter.label : "Status"}
                    className="w-full"
                    />
                </div>

                </div>
                {loading ? (
                <div className="flex justify-center items-center my-8">
                    <div className="loader">Loading...</div> {/* Add your loading spinner */}
                </div>
                ) : currentUser.isAdmin && users.length > 0 ? (
                <>
                <Table hoverable className='shadow-md relative mt-4'>
                        <Table.Head className="text-left text-lg font-medium text-gray-500 dark:text-white px-3 py-2">
                        <Table.HeadCell>Name</Table.HeadCell>
                        
                        <Table.HeadCell>Documents</Table.HeadCell>
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
                                    <Link className="text-lg font-medium text-gray-900 hover:underline" to={`/user-profile/${user._id}`}>
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
                                    <span className="text-gray-400">No medcert generated yet</span>
                                )}
                                </div>
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

                <div className='m-4'>
                        <Pagination 
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                        />
                    </div>
            </>
            ) : (
            <p className="text-center text-2xl mx-auto p-10 font-light">NO USERS</p>
            )}
        </div>
            </div>
        </div>
    </div>
    </div>
  );
};

export default NoDocsSubmitted;
