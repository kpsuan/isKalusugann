import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from "../../SideBar Section/Sidebar";
import "../../Annual/annual.css";
import { Table } from 'flowbite-react';
import Pagination from './Pagination'; 
import Select from 'react-select';
import StatsDashboard from './StatCard';

import * as XLSX from 'xlsx'; 

const CompleteDocs = () => {
  const { currentUser } = useSelector((state) => state.user);
  
  const [users, setUsers] = useState([]);  
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [filter, setFilter] = useState("");
  const [selectedDegreeProgram, setSelectedDegreeProgram] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(9); 
  const [totalApproved, setTotalApproved] = useState(0);
  const [totalDenied, setTotalDenied] = useState(0);
  const [totalPending, setTotalPending] = useState(0);
  
  const fetchUsersByDocumentStatus = async () => {
    const startIndex = (currentPage - 1) * limit; // Pagination logic
    try {
      const response = await fetch(`/api/user/complete-docs?startIndex=${startIndex}&course=${selectedDegreeProgram}`); // Fetch with query parameters
      const data = await response.json();
  
      // Debugging: Log the response to check its structure
      console.log('API Response:', data);
  
      if (response.ok) {
        // Debugging: Log fetched users to verify field names
        console.log('Fetched users:', data.users);
        setUsers(data.users); // Update the users state
        setTotalUsers(data.totalUsers); // Update the totalUsers state
        filterUsers(data.users, filter); // Apply any filters to the users
      } else {
        console.error('Failed to fetch users:', data); // Log any errors from the response
      }
    } catch (error) {
      console.error('Error fetching users:', error); // Log any network errors
    }
  };
  
  

  useEffect(() => {
    console.log("Fetching users with filters:", { selectedDegreeProgram, currentPage, filter });
    fetchUsersByDocumentStatus();
  }, [selectedDegreeProgram, currentPage, filter]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    filterUsers(users, event.target.value);
  };

  const handleDegreeProgramChange = (selectedOption) => {
    setSelectedDegreeProgram(selectedOption ? selectedOption.value : "");
    setFilter(""); // Reset filter when selecting a degree program
    setCurrentPage(1);
  };

  const filterUsers = (users, query) => {
    const filtered = users.filter(user => {
      const fullName = `${user.firstName} ${user.middleName || ''} ${user.lastName}`.toLowerCase();
      return fullName.includes(query.toLowerCase());
    });
    setFilteredUsers(filtered);
  };

  const totalPages = Math.ceil(totalUsers / limit);

  const degreeProgramOptions = [
    { value: "", label: "All" },
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

  const handleExport = async () => {
    try {
      const response = await fetch(`/api/user/getUsersByCollegeInPerson?limit=1000`);
      const data = await response.json();
      
      console.log('Fetched data:', data); // Debugging: Log fetched data
      
      const allUsers = Array.isArray(data.users) ? data.users : [];
      
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
        Remarks: user.remarks || 'No Remarks',
      })));
      
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Users');
      
      const fileName = `Complete_Docs_InPerson.xlsx`;
      XLSX.writeFile(wb, fileName);
    } catch (error) {
      console.error('Failed to export users:', error);
    }
  };

  return (
    <div className="dashboard my-flex">
      <div className="dashboardContainer my-flex">
        <Sidebar />
        <div className="mainContent">
          <div className="bg-white rounded-lg border border-gray-200 p-10 w-full">
            <p className="font-light my-4">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec nisl quis risus eleifend venenatis. Mauris nec justo nec ligula suscipit consequat. Donec rutrum nisi nec faucibus euismod. Sed sit amet vestibulum metus.
            </p>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              View Scheduled Today
            </button>
          </div>
          <div>
            <p className="font-bold my-4">Total Users: {totalUsers}</p>
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

             
              <div className="flex justify-center py-4">
                <button
                  onClick={handleExport}
                  className="ml-5 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Export to Excel
                </button>
              </div>
            </div>

            <div className='my-10 table-auto overflow-x-scroll md:mx-auto p-1 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
              {currentUser.isAdmin && filteredUsers.length > 0 ? (
                <>
                  <Table hoverable className='shadow-md relative'>
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
                    

                    <Table.Cell className="text-center px-2">
                            <div style={{ backgroundColor: user.status === 'approved' ? 'green' : user.status === 'denied' ? 'red' : user.status === null ? '#888888' : '#888888' }} className="px-2 py-3 w-32 rounded">
                                <Link className="text-white hover:underline" to={`/user-status/${user._id}`}>
                                    <span>{user.status || "NO ACTION"}</span>
                                </Link>
                            </div>
                    </Table.Cell>

                    <Table.Cell className="text-left">
                            {user.comment ? (
                              <span>{user.comment.replace(/<p>/g, '').replace(/<\/p>/g, '')}</span>
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
}

export default CompleteDocs;
