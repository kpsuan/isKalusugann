import Sidebar from "../../SideBar Section/Sidebar";
import Top from "../../Profile/Components/Header";
import "../../Annual/annual.css";
import { Table, TableCell } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import Pagination from './Pagination'; // Adjust the import path accordingly
import { useLocation } from 'react-router-dom';
import Select from 'react-select';

const RescheduleRequest = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedDegreeProgram, setSelectedDegreeProgram] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(9); // Keep this constant

  const [loading, setLoading] = useState(false); // Loading state


  const location = useLocation();
  const { startDate, endDate } = location.state || {};
  console.log('Received Start Date:', startDate);
  console.log('Received End Date:', endDate);


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const startIndex = (currentPage - 1) * limit;
        let url = `/api/user/reschedUsers?startIndex=${startIndex}&limit=${limit}`;
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
        }
      } catch (error) {
        console.log(error.message);
      }
      finally {
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

  const dateFormatter = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',  // 'Mon'
    month: 'short',     // 'Aug'
    day: '2-digit',    // '23'
    year: 'numeric'    // '2024'
  });

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

  return (
    <div>
      <div className='table-auto overflow-x-scroll md:mx-auto p-1 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
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
              placeholder="Course"
              className="w-full"
            />
          </div>

          <div className="flex items-center ml-4 w-40">
            <Select
              id="status"
              value={statusFilter}
              onChange={handleStatusFilterChange}
              options={statusOptions}
              placeholder="Status"
              className="w-full"
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-5">
            <p className="text-gray-500 text-lg">Loading...</p>
          </div>
        ) : currentUser.isAdmin && users.length > 0 ? (
          <>
            <Table hoverable className='shadow-md mt-5 bg-transparent relative overflow-scroll'>
              <Table.Head className="text-left-blue text-md px-3 p-15 bg-gray-200 rounded-b shadow-md">
                <Table.HeadCell>Name</Table.HeadCell>
                <Table.HeadCell>Documents</Table.HeadCell>
                <Table.HeadCell>Original Schedule</Table.HeadCell>
                <Table.HeadCell>New Schedules</Table.HeadCell>
                <Table.HeadCell>Status</Table.HeadCell>
                <Table.HeadCell>Remarks</Table.HeadCell>
              </Table.Head>

              <Table.Body className="divide-y my-4">
                {users.map((user) => (
                  <Table.Row key={user._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                    <Table.Cell>
                      <Link className="text-right text-lg font-medium text-gray-900 hover:underline" to={`/users/${user.slug}`}>
                        {`${user.lastName}, ${user.middleName || ''} ${user.firstName}`} <br />
                      </Link>
                      <span className="text-sm font-light">{`${user.yearLevel} | ${user.college} | ${user.degreeProgram}`}</span>
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

                    <Table.Cell>
                      {user.schedule.length > 0 ? (
                        user.schedule.map((date, index) => (
                          <div key={index}>{dateFormatter.format(new Date(date))}</div>
                        ))
                      ) : (
                        <span className="text-gray-400">No Schedule</span>
                      )}
                    </Table.Cell>

                    <Table.Cell>
                      {user.rescheduledDate.length > 0 ? (
                        user.rescheduledDate.map((date, index) => (
                          <div key={index}>{dateFormatter.format(new Date(date))}</div>
                        ))
                      ) : (
                        <span className="text-gray-400">No Reschedule</span>
                      )}
                    </Table.Cell>

                    <Table.Cell>
                      <span className={`font-bold bg-${user.rescheduleStatus === 'approved' ? 'green' : user.rescheduleStatus === 'denied' ? 'red' : 'gray'}-500 rounded-full px-3 py-1 ${user.rescheduleStatus === 'approved' ? 'text-green-600' : user.rescheduleStatus === 'denied' ? 'text-red-600' : 'text-gray-400'}`}>
                        <Link
                          className="text-white hover:underline"
                          to={{
                            pathname: `/resched-status/${user._id}`,
                            state: { startDate, endDate } // Pass dates here
                          }}
                        >
                          <span>{user.rescheduleStatus || "NO ACTION"}</span>
                        </Link>
                      </span>
                    </Table.Cell>


                    <Table.Cell>
                      <span>{user.remarks || 'NO REMARKS'}</span>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
            <div className="flex justify-center mt-4">
              {currentPage < totalPages && (
                <button
                  onClick={handleShowMore}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Show More
                </button>
              )}
            </div>
          </>
        ) : (
          <div className="flex justify-center p-5">
            <p className="text-gray-500">No users found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RescheduleRequest;
