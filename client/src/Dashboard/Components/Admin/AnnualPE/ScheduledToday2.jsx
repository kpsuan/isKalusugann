import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Card, Spinner } from 'flowbite-react'; 
import { Link } from 'react-router-dom'; 
import { LiaFileMedicalAltSolid } from "react-icons/lia";
import { HiOutlineCalendar, HiOutlineUsers, HiOutlineClipboardCheck } from 'react-icons/hi';


const ScheduledForToday2 = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(false); // Show more feature state
  const [error, setError] = useState(null); // State to handle errors

  useEffect(() => {
    const fetchUsersScheduledForToday = async () => {
      try {
        const response = await axios.get('/api/user/sched-for-today');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users scheduled for today:', error);
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsersScheduledForToday();
  }, []);

  const handleToggleView = () => {
    setShowMore(!showMore); // Toggle showMore state
  };

  // Get the first 5 users if showMore is false, otherwise show all users
  const displayedUsers = showMore ? users : users.slice(0, 5);

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-8">
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
              <Table.HeadCell>Is Present?</Table.HeadCell>
            </Table.Head>
            <Table.Body>
              {displayedUsers.map((user) => (
                <Table.Row key={user._id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell>
                    <div className="flex items-center space-x-4">
                      {user.profilePicture ? (
                        <img src={user.profilePicture} alt={`${user.firstName} ${user.lastName}`} className="w-12 h-12 rounded-full object-cover" />
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
                    <div style={{ backgroundColor: user.status === 'approved' ? 'green' : user.status === 'denied' ? 'red' : '#888888' }} className="px-2 py-3 w-32 rounded">
                      <Link className="text-white hover:underline" to={`/user-status/${user._id}`}>
                        <span>{user.status || "NO ACTION"}</span>
                      </Link>
                    </div>
                  </Table.Cell>

                  <Table.Cell className="text-center px-2">
                    <div style={{ backgroundColor: user.isPresent === 'ARRIVED' ? 'green' : user.isPresent === 'ABSENT' ? 'red' : '#e7aa18' }} className="px-2 py-3 w-32 rounded">
                      <Link className="text-white hover:underline" to={`/user-status/${user._id}`}>
                        <span>{user.isPresent || "DID NOT YET ARRIVE"}</span>
                      </Link>
                    </div>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>

          {users.length > 5 && (
            <div className="flex justify-center mt-4">
              <button
                onClick={handleToggleView}
                className="text-teal-500 text-sm py-3 px-6 rounded-md hover:bg-teal-200 transition duration-200"
              >
                {showMore ? 'See Less' : 'See More'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <LiaFileMedicalAltSolid className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No Scheduled Users</h3>
          <p className="mt-1 text-sm text-gray-500">No users are scheduled for today.</p>
        </div>
      )}
    </div>
  );
};

export default ScheduledForToday2;
