import axios from 'axios';
import { Table } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Calendar from './Calendar';
import { Spinner } from 'flowbite-react';

const ScheduledForDate = () => {
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(false);
  const [viewMode, setViewMode] = useState('calendar'); // View mode state

  useEffect(() => {
    if (date) {
      handleFetchUsers(date);
    }
  }, [date]); // Fetch users when the date changes

  const handleFetchUsers = async (dateString) => {
    if (!dateString) return;

    setLoading(true);
    try {
      const response = await axios.get(`/api/user/scheduled-for-date/${dateString}`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users scheduled for the date:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDateChange = (selectedDate) => {
    const dateString = selectedDate.startOf('day').format('YYYY-MM-DD');
    setDate(dateString);
  };

  const handleShowMore = () => {
    // Your logic for showing more users
  };

  const toggleViewMode = () => {
    setViewMode((prevMode) => (prevMode === 'calendar' ? 'list' : 'calendar'));
  };

  return (
    <div className='my-5'>
      <div className="flex items-center justify-between px-5 mb-10">
        <h2 className='text-2xl font-semibold text-gray-800'>
          View Students Scheduled On: {date}
        </h2>
        <button 
          onClick={toggleViewMode} 
          className='px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all'
        >
          {viewMode === 'calendar' ? 'Show List View' : 'Show Calendar View'}
        </button>
      </div>

      {viewMode === 'calendar' ? (
        <div className="w-full">
          <Calendar 
            onDateChange={handleDateChange} 
            selectedDate={date} // Pass selected date to Calendar
          /> 
        </div>
      ) : (
        <div className='my-10 table-auto overflow-x-scroll md:mx-auto p-4'>
          {loading ? (
            <div className="flex justify-center">
              <Spinner />
            </div>
          ) : (
            <>
              {users.length > 0 ? (
                <>
                  <Table hoverable className='shadow-md z-10 relative'>
                    <Table.Head className="text-left px-4 py-2 bg-gray-100">
                      <Table.HeadCell>Name</Table.HeadCell>
                      <Table.HeadCell>Sex</Table.HeadCell>
                      <Table.HeadCell>Year Level</Table.HeadCell>
                      <Table.HeadCell>Degree Program</Table.HeadCell>
                      <Table.HeadCell>College</Table.HeadCell>
                      <Table.HeadCell>Documents</Table.HeadCell>
                      <Table.HeadCell>Status</Table.HeadCell>
                      <Table.HeadCell>Remarks</Table.HeadCell>
                    </Table.Head>
                    <Table.Body>
                      {users.map((user) => (
                        <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 hover:bg-gray-50" key={user._id}>
                          <Table.Cell>
                            <Link className="text-lg text-gray-900 hover:underline" to={`/users/${user.slug}`}>
                              {`${user.firstName} ${user.middleName || ''} ${user.lastName}`}
                            </Link>
                          </Table.Cell>
                          <Table.Cell className="text-left">{user.gender}</Table.Cell>
                          <Table.Cell className="text-left">{user.yearLevel}</Table.Cell>
                          <Table.Cell className="text-left">{user.degreeProgram}</Table.Cell>
                          <Table.Cell className="text-left">{user.college}</Table.Cell>
                          <Table.Cell className="text-left flex-col space-y-1">
                            {['peForm', 'labResults', 'requestPE', 'medcert'].map((file, index) => (
                              <div key={index}>
                                {user[file] ? (
                                  <Link className="text-teal-500 hover:underline" to={user[file]}>
                                    {user.lastName}_{file}.pdf
                                  </Link>
                                ) : (
                                  <span className="text-gray-400">Empty</span>
                                )}
                              </div>
                            ))}
                          </Table.Cell>
                          <Table.Cell className="text-center px-4">
                            <div className={`px-2 py-1 rounded-full text-white text-sm ${user.status === 'approved' ? 'bg-green-500' : user.status === 'denied' ? 'bg-red-500' : 'bg-gray-500'}`}>
                              <Link className="hover:underline" to={`/user-status/${user._id}`}>
                                {user.status}
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
                  {showMore && (
                    <button 
                      onClick={handleShowMore} 
                      className="w-full text-teal-500 text-sm py-4 hover:bg-teal-100 transition-all"
                    >
                      Load more
                    </button>
                  )}
                </>
              ) : (
                <p className="text-center text-gray-500">No users found for this date.</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ScheduledForDate;
