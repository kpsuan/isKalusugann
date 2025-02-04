import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Card, Spinner  } from 'flowbite-react'; // Make sure you have the correct import
import { Link, useNavigate } from 'react-router-dom'; // Make sure to use react-router for linking
import { LiaFileMedicalAltSolid } from "react-icons/lia";
import { HiOutlineCalendar, HiOutlineUsers, HiOutlineClipboardCheck } from 'react-icons/hi';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone);

const ScheduledForToday = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false); // Show more feature state
  const [error, setError] = useState(null); // State to handle errors
  const [todayDate, setTodayDate] = useState(''); // State to store today's date
  const currentDate = dayjs().tz('Asia/Manila').format('MMMM D, YYYY');

  useEffect(() => {
    const fetchUsersScheduledForToday = async () => {
      try {
        const response = await axios.get(`/api/user/sched-for-today`);
        console.log(response.data); // Check the response to ensure `isPresent` is `"ARRIVED"`
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users scheduled for today:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUsersScheduledForToday();
    // polling kada 5s
    const intervalId = setInterval(() => {
      fetchUsersScheduledForToday();
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);
  

  // Function to handle 'Load more' (this is just a placeholder)
  const handleShowMore = () => {
    setShowMore(!showMore);
  };
  
  

    


  return (
    <div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card href="/yesterdaypresent" target="_blank"  className="transition duration-300 ease-in-out transform hover:shadow-lg">
          <div className="flex items-center">
            <div className="p-3 bg-cyan-100 rounded-lg">
              <HiOutlineCalendar className="w-6 h-6 text-cyan-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-700">Yesterday's Attendance</h3>
              <p className="text-sm text-gray-500">View Annual PE attendance</p>
            </div>
          </div>
        </Card>

        <Card  href="/overallabsent" target="_blank" className="transition duration-300 ease-in-out transform hover:shadow-lg">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <HiOutlineUsers className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-700">Missed Schedule</h3>
              <p className="text-sm text-gray-500">View all absent students</p>
            </div>
          </div>
        </Card>

        <Card  href="/overallpresent" target="_blank" className="transition duration-300 ease-in-out transform hover:shadow-lg">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <HiOutlineClipboardCheck className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-semibold text-gray-700">Present Students</h3>
              <p className="text-sm text-gray-500">View all attending students</p>
            </div>
          </div>
        </Card>
      </div>
      
      
      <div className="block text-center">
        <h2 className="text-lg p-2 font-semibold text-gray-800">
          Today's Schedule:
        </h2>
        <span className="text-blue-500 text-4xl mt-0 block font-light">
          {currentDate}
        </span>
       
      </div>
      <button 
          onClick={() => navigate('/manage-queue')} 
          className="inline-flex items-center px-6 py-2.5 mt-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-all duration-200 shadow-sm hover:shadow-md mx-auto gap-2"
        >
          <span>Manage Scheduled Today</span>
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M5 12h14m-7-7 7 7-7 7"/>
          </svg>
        </button>

      {loading ? (
       <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : error ? (
        <p className="text-red-500">{error}</p> // Display the error message
      ) : users.length > 0 ? (
        <div className='my-10 table-auto overflow-x-scroll md:mx-auto p-1 scrollbar'>
          <Table hoverable className='shadow-md z-10 relative'>
          <Table.Head className="text-left text-lg font-medium text-gray-500 dark:text-white px-3 py-2">
          <Table.HeadCell>Name</Table.HeadCell>
              <Table.HeadCell>Status</Table.HeadCell>
              <Table.HeadCell>Attendance</Table.HeadCell>
            </Table.Head>
            <Table.Body>
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
                      <Link className="text-lg font-medium text-gray-900 hover:underline" to={`/user-status/${user._id}`}>
                        {`${user.lastName}, ${user.middleName || ''} ${user.firstName}`}
                      </Link>
                      <span className="text-sm font-light block">{`${user.yearLevel} | ${user.college} | ${user.degreeProgram}`}</span>
                    </div>
                  </div>
                </Table.Cell>


                
                <Table.Cell className="text-center px-2">
                        <div style={{ backgroundColor: user.status === 'approved' ? 'green' : user.status === 'denied' ? 'red' : user.status === null ? '#888888' : '#888888' }} className="px-2 py-3 w-32 rounded">
                            <Link className="text-white hover:underline" to={`/user-status/${user._id}`}>
                                <span>{user.status || "NO ACTION"}</span>
                            </Link>
                        </div>
                </Table.Cell>

                <Table.Cell className="text-center px-2">
                  <div
                    style={{
                      backgroundColor:
                        user.isPresent === 'ARRIVED'
                          ? 'green'
                          : user.isPresent === 'ABSENT'
                          ? 'red'
                          : user.isPresent === null
                          ? '#e7aa18'
                          : '#e7aa18',
                    }}
                    className="px-2 py-3 w-32 rounded"
                  >
                    <Link className="text-white hover:underline" to={`/user-status/${user._id}`}>
                      <span>{user.isPresent || "DID NOT YET ARRIVE"}</span>
                    </Link>
                  </div>
                </Table.Cell>

              </Table.Row>
              ))}
            </Table.Body>
          </Table>
          {showMore && (
            <button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm py-7">
              Load more
            </button>
          )}
        </div>
      ) : (
      <div className="text-center py-12">
        <HiOutlineUsers className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No Scheduled Users</h3>
        <p className="mt-1 text-sm text-gray-500">No users are scheduled for today.</p>
      </div>

      )}
    </div>
  );
};

export default ScheduledForToday;
