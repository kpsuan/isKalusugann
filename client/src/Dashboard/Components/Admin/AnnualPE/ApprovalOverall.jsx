import Sidebar from "../../SideBar Section/Sidebar";
import "../../Annual/annual.css";
import { Table, TableCell } from 'flowbite-react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import Pagination from './Pagination'; // Adjust the import path accordingly
import Select from 'react-select';
import StatsDashboard from './StatCard';

const ApprovedOverall = () => {
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
      setLoading(true); 
      setError(null); 
      try {
        const startIndex = (currentPage - 1) * limit;
        let url = `/api/user/overall-approval?startIndex=${startIndex}&limit=${limit}`;
        if (filter) {
          url += `&searchQuery=${encodeURIComponent(filter)}`;        
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
        <div className="bg-gradient-to-r from-blue-700 to-cyan-500 rounded-lg border border-gray-200 p-10 w-full">
            <div className="text-5xl font-bold  text-white mb-4">Approved by Doctor and Dentist</div>
            <p className="font-light my-4 text-white">
            View and manage students with complete submission</p>
           
          </div>
        <div>
        
        <div className='p-4 pl-0 mx-auto'>
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
        
         {/* Filters */}
         <div className="rounded-lg pl-0 mb-6">
            <div className="flex space-x-4">
              <div className="flex-grow">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={filter}
                  onChange={handleFilterChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="w-1/4">
                <Select
                  value={selectedDegreeProgram}
                  onChange={handleDegreeProgramChange}
                  options={degreeProgramOptions}
                  placeholder="Select Course"
                  className="basic-single"
                  classNamePrefix="select"
                />
              </div>
              <div className="w-1/4">
                <Select
                  value={statusFilter}
                  onChange={handleStatusFilterChange}
                  options={statusOptions}
                  placeholder="Select Status"
                  className="basic-single"
                  classNamePrefix="select"
                />
              </div>
            </div>
          </div>
          
        <div className='table-auto overflow-x-scroll md:mx-auto p-1 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
                {loading ? (
                <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
              </div>
                ) : currentUser.isAdmin && users.length > 0 ? (
                <>
                <Table hoverable className='shadow-md relative mt-4'>
                        <Table.Head className="text-left text-lg font-medium text-gray-500 dark:text-white px-3 py-2">
                        <Table.HeadCell>Name</Table.HeadCell>
                        <Table.HeadCell>Documents</Table.HeadCell>
                        <Table.HeadCell>Status</Table.HeadCell>
                        <Table.HeadCell>Dentist</Table.HeadCell>
                        <Table.HeadCell>Doctor</Table.HeadCell>

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
                                    <div style={{ backgroundColor: user.status === 'approved' ? 'green' : user.status === 'denied' ? 'red' : user.status === null ? '#888888' : '#888888' }} className="px-3 py-3 inline-block rounded-full text-xs font-semibold ">
                                        <Link className="text-white hover:underline" to={`/user-status/${user._id}`}>
                                            <span>{user.status || "NO ACTION"}</span>
                                        </Link>
                                    </div>
                            </Table.Cell>
                            <Table.Cell className="text-center px-2">
                                    <div style={{ backgroundColor: user.dentistStatus === 'approved' ? 'green' : user.dentistStatus === 'denied' ? 'red' : user.dentistStatus === null ? '#888888' : '#888888' }} className="px-3 py-3 inline-block rounded-full text-xs font-semibold ">
                                        <Link className="text-white hover:underline" to={`/user-status/${user._id}`}>
                                            <span>{user.dentistStatus || "NO ACTION"}</span>
                                        </Link>
                                    </div>
                            </Table.Cell>
                            <Table.Cell className="text-center px-2">
                                    <div style={{ backgroundColor: user.doctorStatus === 'approved' ? 'green' : user.doctorStatus === 'denied' ? 'red' : user.doctorStatus === null ? '#888888' : '#888888' }} className="px-3 py-3 inline-block rounded-full text-xs font-semibold ">
                                        <Link className="text-white hover:underline" to={`/user-status/${user._id}`}>
                                            <span>{user.doctorStatus || "NO ACTION"}</span>
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

                <div className='m-4 justify-center items-center'>
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
  );
};

export default ApprovedOverall;