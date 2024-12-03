import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Card } from 'flowbite-react'; 
import { Link } from 'react-router-dom'; 
import { LiaFileMedicalAltSolid } from "react-icons/lia";

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

  const handleShowMore = () => {
    setShowMore(!showMore); // Toggle showMore state
  };

  // Get the first 5 users if showMore is false, otherwise show all users
  const displayedUsers = showMore ? users : users.slice(0, 5);

  return (
    <div>
      <div className="flex flex-1 w-full my-4">
        <Card href="/yesterdaypresent" target="_blank" className="flex-1 mr-2 p-5 cursor-pointer bg-gray-50 mb-4 transition duration-300 ease-in-out transform hover:shadow-lg" horizontal>
          <div className="flex">
            <div className="flex items-center w-full">
              <h5 className="text-2xl font-light tracking-tight text-cyan-500 dark:text-white">
                <LiaFileMedicalAltSolid />
              </h5>
              <div className="flex flex-col pl-4">
                <p className="font-semibold text-gray-500 dark:text-gray-400">
                  View Yesterday's Annual PE Attendance
                </p>
              </div>
            </div>
          </div>
        </Card>
        <Card href="/overallabsent" target="_blank" className="flex-1 mr-2 p-5 cursor-pointer bg-gray-50 mb-4 transition duration-300 ease-in-out transform hover:shadow-lg" horizontal>
          <div className="flex">
            <div className="flex items-center w-full">
              <h5 className="text-2xl font-light tracking-tight text-cyan-500 dark:text-white">
                <LiaFileMedicalAltSolid />
              </h5>
              <div className="flex flex-col pl-4">
                <p className="font-semibold text-gray-500 dark:text-gray-400">
                  View All Students who missed their schedule
                </p>
              </div>
            </div>
          </div>
        </Card>
        <Card href="/overallpresent" target="_blank" className="flex-1 mr-2 p-5 cursor-pointer bg-gray-50 mb-4 transition duration-300 ease-in-out transform hover:shadow-lg" horizontal>
          <div className="flex">
            <div className="flex items-center w-full">
              <h5 className="text-2xl font-light tracking-tight text-cyan-500 dark:text-white">
                <LiaFileMedicalAltSolid />
              </h5>
              <div className="flex flex-col pl-4">
                <p className="font-semibold text-gray-500 dark:text-gray-400">
                  View All Students arrived at their schedule
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {loading ? (
        <p className='text-center text-xl py-10'>Loading...</p>
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
                        <Link className="text-lg font-medium text-gray-900 hover:underline" to={`/users/${user.slug}`}>
                          {`${user.lastName}, ${user.middleName || ''} ${user.firstName}`}
                        </Link>
                        <span className="text-sm font-light block">{`${user.yearLevel} | ${user.college} | ${user.degreeProgram}`}</span>
                      </div>
                    </div>
                  </Table.Cell>

                  <Table.Cell className="text-center px-1">
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
          <button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm py-7">
            {showMore ? 'See Less' : 'See More'}
          </button>
        </div>
      ) : (
        <p>No users found</p>
      )}
    </div>
  );
};

export default ScheduledForToday2;
