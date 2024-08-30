import axios from 'axios';
import { Table } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Calendar from './Calendar';

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

    console.log('Fetching users for date:', dateString);

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
    <div className='my-2'>
      <div className="flex items-center justify-between px-5 mb-10">
        <h2 className='text-2xl font-light'>View Students Scheduled On: {date}</h2>
        <button 
          onClick={toggleViewMode} 
          className='px-4 py-2 bg-blue-500 text-white rounded'
        >
          {viewMode === 'calendar' ? 'Show List View' : 'Show Calendar View'}
        </button>
      </div>

      {viewMode === 'calendar' ? (
        <div className="w-full ">
          <Calendar 
            onDateChange={handleDateChange} 
            selectedDate={date} // Pass selected date to Calendar
          /> 
        </div>
      ) : (
        <div className='my-10 table-auto overflow-x-scroll md:mx-auto p-1 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <>
              {users.length > 0 ? (
                <>
                  <Table hoverable className='shadow-md  z-10 relative'>
                    <Table.Head className="text-left px-3">
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
                        <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 " key={user._id}>
                          <Table.Cell>
                            <Link className="text-right text-lg text-gray-900 hover:underline" to={`/users/${user.slug}`}>
                              {`${user.firstName} ${user.middleName || ''} ${user.lastName}`}
                            </Link>
                          </Table.Cell>
                          <Table.Cell className="text-left">{user.gender}</Table.Cell>
                          <Table.Cell className="text-left">{user.yearLevel}</Table.Cell>
                          <Table.Cell className="text-left">{user.degreeProgram}</Table.Cell>
                          <Table.Cell className="text-left">{user.college}</Table.Cell>
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
                            <div style={{ backgroundColor: user.status === 'approved' ? 'green' : user.status === 'denied' ? 'red' : '#888888' }} className="px-2 py-1 rounded">
                              <Link className="text-white hover:underline" to={`/user-status/${user._id}`}>
                                <span>{user.status}</span>
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
                    <button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm py-7">Load more</button>
                  )}
                </>
              ) : (
                <p>NO USERS</p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ScheduledForDate;
