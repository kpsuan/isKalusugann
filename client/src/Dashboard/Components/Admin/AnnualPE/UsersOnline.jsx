
import "../../Annual/annual.css";
import { Table, TableCell } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import Pagination from './Pagination'; // Adjust the import path accordingly
import Select from 'react-select';
import * as XLSX from 'xlsx'; // Import the XLSX library
import StatsDashboard from "./StatCard";


const UsersOnline = () => {
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
  

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true); // Set loading to true
      setError(null); // Reset error state
      try {
        const startIndex = (currentPage - 1) * limit;
        let url = `/api/user/getusers?startIndex=${startIndex}&limit=${limit}`;
        if (filter) {
          url += `&searchQuery=${encodeURIComponent(filter)}`;        
        }
        if (selectedDegreeProgram) {
          url += `&degreeProgram=${selectedDegreeProgram}`;
        }
        if (statusFilter) {
          url += `&status=${statusFilter}`;
        }
        if (documentStatusFilter) { // Add document status filter to URL
          url += `&documentStatus=${documentStatusFilter}`;
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
  }, [currentUser._id, filter, selectedDegreeProgram, statusFilter, documentStatusFilter, currentPage, limit]);


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

  const handleDocumentStatusFilterChange = (selectedOption) => { // New handler for document status filter
    setDocumentStatusFilter(selectedOption ? selectedOption.value : "");
    setCurrentPage(1);
  };

  const handleExport = async () => {
    try {
      // Fetch all users without pagination using the 'all' keyword
      const response = await fetch('/api/user/getusers?limit=2000');
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
        Status: user.status || 'NO ACTION',
      })));

      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Users');
      XLSX.writeFile(wb, 'Students_Online.xlsx');
    } catch (error) {
      console.error('Failed to export users:', error);
    }
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

  const documentStatusOptions = [
    { value: "", label: "All" },
    { value: "complete", label: "Complete Submission" },
    { value: "incomplete", label: "Incomplete Submission" },
    { value: "no_submission", label: "No Submission" },
  ];


  return (
    <div>
      <div className='p-3 pt-3 pb-0 mt-0'>
        <h2 className="text-3xl font-semibold">All Students</h2>
      </div>  

      <StatsDashboard
        totalUsers={totalUsers}
        totalApproved={totalApproved}
        totalDenied={totalDenied}
        totalPending={totalPending}
      />   

      <div className="table-auto overflow-x-scroll md:mx-auto p-1 z-50">
        <div className="flex justify-start">
          
          
          {/* Search and Filters */}
          <div className="flex items-center">
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
          <div className="flex items-center ml-4 w-64">
            <Select
              options={documentStatusOptions}
              onChange={handleDocumentStatusFilterChange}
              placeholder="Document Status"
              className="w-48"
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

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : currentUser.isAdmin && users.length > 0 ? (
          <>
            <Table hoverable className="shadow-md relative">
              {/* Table headers */}
              <Table.Head>
                <Table.HeadCell>Name</Table.HeadCell>
                <Table.HeadCell>Documents</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Remarks</Table.HeadCell>
              </Table.Head>
              {/* Table body */}
              <Table.Body className="divide-y my-4">
                {users.map((user) => (
                  <Table.Row key={user._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    {/* User information */}
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
                    {/* Documents */}
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
                    {/* Status */}
                    <Table.Cell className="text-center px-2">
                      <div style={{ backgroundColor: user.status === 'approved' ? 'green' : user.status === 'denied' ? 'red' : '#888888' }} className="px-2 py-3 w-32 rounded">
                        <Link className="text-white hover:underline" to={`/user-status/${user._id}`}>
                          <span>{user.status || "NO ACTION"}</span>
                        </Link>
                      </div>
                    </Table.Cell>
                    {/* Remarks */}
                    <Table.Cell>
                      {user.remarks ? user.remarks : <span className="text-gray-500 italic">No remarks</span>}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>

            <div className="flex items-center justify-center text-center py-4">
              <Pagination
                currentPage={currentPage}
                onPageChange={setCurrentPage}
                showIcons={true}
                totalPages={totalPages}
                previousLabel="Prev"
                nextLabel="Next"
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

export default UsersOnline;