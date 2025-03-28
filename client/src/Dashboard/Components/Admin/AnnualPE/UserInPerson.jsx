import "../../Annual/annual.css";
import { Table, TableCell } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import Pagination from './Pagination'; // Adjust the import path accordingly
import * as XLSX from 'xlsx'; // Import the XLSX library
import Select from 'react-select';
import StatsDashboard from "./StatCard";



const UserInPerson = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
 
  const [loading, setLoading] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalApproved, setTotalApproved] = useState(0);
  const [totalDenied, setTotalDenied] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  
  const [selectedDegreeProgram, setSelectedDegreeProgram] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(9); // Keep this constant

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const startIndex = (currentPage - 1) * limit;
        let url = `/api/user/getinperson?startIndex=${startIndex}&limit=${limit}`;
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
      fetchUsers();
    }
  }, [currentUser._id, filter, selectedDegreeProgram, statusFilter, currentPage, limit]);
  

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
  const handleExport = async () => {
    try {
      // Fetch all users without pagination using the 'all' keyword
      const response = await fetch('/api/user/getinperson?limit=all');
      const data = await response.json();
  
      // Debugging: Log the fetched data
      console.log('Fetched data:', data);
  
      // Check if data.users is an array
      const allUsers = Array.isArray(data.users) ? data.users : [];
  
      // Prepare data for export
      const ws = XLSX.utils.json_to_sheet(allUsers.map(user => ({
        Name: `${user.lastName}, ${user.middleName || ''} ${user.firstName}`,
        'Year Level': user.yearLevel,
        College: user.college,
        'Degree Program': user.degreeProgram,
        'PE Form': user.peForm ? `${user.lastName}_peForm.pdf` : 'Empty',
        'Lab Results': user.labResults ? `${user.lastName}_labResults.pdf` : 'Empty',
        'Request PE': user.requestPE ? `${user.lastName}_requestPE.pdf` : 'Empty',
        'Medcert': user.medcert ? `${user.lastName}_medcert.pdf` : 'Empty',
        Schedule: user.schedule || 'NAN',
        Status: user.status || 'NO ACTION',
      })));
  
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Users');
      XLSX.writeFile(wb, 'Students_InPerson.xlsx');
    } catch (error) {
      console.error('Failed to export users:', error);
    }
  };
  
  
  
  
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
  

  const totalPages = Math.ceil(totalUsers / limit);

  return (
    <div> 
         
      <div className='p-3 pt-0 mt-0'>
      <h2 className="text-3xl font-semibold">All Students</h2>
      </div>  
      <StatsDashboard
        totalUsers={totalUsers}
        totalApproved={totalApproved}
        totalDenied={totalDenied}
        totalPending={totalPending}
      />   
      <div className="flex justify-start mb-4">
              <div className="flex items-center ">
                <input
                  type="text"
                  placeholder="Search..."
                  value={filter}
                  onChange={handleFilterChange}
                  className="pl-3 w-80 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
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

              <div className="flex justify-center py-4">
                <button
                  onClick={handleExport}
                  className="ml-5 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Export to Excel
                </button>
              </div>
      </div>

      <div className='table-auto overflow-x-scroll md:mx-auto p-1 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
        {loading ? ( 
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : currentUser.isAdmin && users.length > 0 ? (
        
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
  );
};

export default UserInPerson;
