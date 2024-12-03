import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Sidebar from "../../SideBar Section/Sidebar";
import "../../Annual/annual.css";
import { Table } from 'flowbite-react';
import Pagination from './Pagination'; // Adjust the import path accordingly
import Select from 'react-select';
import * as XLSX from 'xlsx'; // Import the XLSX library

const CollegeStudents = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { collegeName } = useParams();

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedDegreeProgram, setSelectedDegreeProgram] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(9); // Keep this constant

  const fetchUsersByCollege = async () => {
    const startIndex = (currentPage - 1) * limit;
    try {
      const response = await fetch(`/api/user/getUsersByCollegeInPerson/${collegeName}?startIndex=${startIndex}&status=${statusFilter}&course=${selectedDegreeProgram}`);
      const data = await response.json();
      if (response.ok) {
        console.log('Fetched users:', data.users); // Add this line
        setUsers(data.users);
        setTotalUsers(data.totalUsers);
        filterUsers(data.users, filter);
      } else {
        console.error('Failed to fetch users:', data);
      }
    } catch (error) {
      console.error('Error fetching users by college:', error);
    }
  };
  
  

  useEffect(() => {
    fetchUsersByCollege();
  }, [collegeName, statusFilter, selectedDegreeProgram, currentPage, filter]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    filterUsers(users, event.target.value);
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

  const statusOptions = [
    { value: "", label: "All" },
    { value: "NO ACTION", label: "No Action" },
    { value: "approved", label: "Approved" },
    { value: "denied", label: "Denied" },
  ];

  const handleExport = async () => {
  try {
    // Fetch all users without pagination using the 'all' keyword
    const response = await fetch(`/api/user/getUsersByCollegeInPerson/${collegeName}?limit=1000`);
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
    
    // Generate file name
    const fileName = `${collegeName.replace(/\s+/g, '_')}_InPerson.xlsx`;
    
    // Write the file
    XLSX.writeFile(wb, fileName);
  } catch (error) {
    console.error('Failed to export users:', error);
  }
};


  return (
    <div className="dashboard my-flex">
      <div className="dashboardContainer my-flex">
        <Sidebar />
        <div className="mainContent m-0 p-0">
          <div className=" h-1/3 bg-gradient-to-r from-blue-700 to-cyan-500 rounded-lg border border-gray-200 p-10 w-full">
            <div className="text-5xl font-bold  text-white mb-4">{collegeName}</div>
            <p className="font-light my-4 text-white">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec nisl quis risus eleifend venenatis. Mauris nec justo nec ligula suscipit consequat. Donec rutrum nisi nec faucibus euismod. Sed sit amet vestibulum metus.
            </p>
            <button className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded">
              View Scheduled Today
            </button>
          </div>
          <div className="bg-white border border-gray-200 p-5">
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

            <div className='my-10 table-auto overflow-x-scroll md:mx-auto p-1 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
              {currentUser.isAdmin && filteredUsers.length > 0 ? (
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

export default CollegeStudents;
