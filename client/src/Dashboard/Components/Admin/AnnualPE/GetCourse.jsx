import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { Alert, Button, Modal, ModalBody, TextInput, Table, TableCell } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import Sidebar from "../../SideBar Section/Sidebar";
import "../../Annual/annual.css";
import Pagination from './Pagination'; // Adjust the import path accordingly

const CourseStudents = () => {
  const { currentUser } = useSelector((state) => state.user);
  const { courseName  } = useParams();

  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(9); // keep this constant

  useEffect(() => {
    const fetchUsersByCourse = async () => {
      const startIndex = (currentPage - 1) * limit;
      try {
        const response = await fetch(`/api/user/getUsersByCourse/${courseName}?startIndex=${startIndex}&status=${statusFilter}`);
        const data = await response.json();
        if (response.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          filterUsers(data.users, filter);
        }
      } catch (error) {
        console.error('Error fetching users by course:', error);
      }
    };

    fetchUsersByCourse();
  }, [courseName, statusFilter, currentPage, limit, filter]);

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    filterUsers(users, event.target.value);
  };

  const filterUsers = (users, query) => {
    const filtered = users.filter(user => {
      const fullName = `${user.firstName} ${user.middleName || ''} ${user.lastName}`.toLowerCase();
      return fullName.includes(query.toLowerCase());
    });
    setFilteredUsers(filtered);
  };

  const totalPages = Math.ceil(totalUsers / limit);

  return (
    <div className="dashboard my-flex">
      <div className="dashboardContainer my-flex">
        <Sidebar />
        <div className="mainContent">
        <Card sx={{ maxHeight: 700}}>
            <CardActionArea>
              <CardMedia sx={{ maxHeight: 180}}
                component="img"
                object-fit="fill"
                image="https://blog.coursify.me/wp-content/uploads/2019/09/online-education-cover.jpg"
                alt="green iguana"
              />
              <CardContent>
              <Typography gutterBottom variant="h4" component="div" sx={{ fontSize: '24px', fontFamily: 'Montserrat' }}>
              {courseName}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '16px', fontFamily: 'Montserrat' }}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec nisl quis risus eleifend venenatis. Mauris nec justo nec ligula suscipit consequat. Donec rutrum nisi nec faucibus euismod. Sed sit amet vestibulum metus.
            </Typography>

                <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded my-3">
                  View Scheduled Today
                </Button>
              </CardContent>
            </CardActionArea>
          </Card>
          <div>

            <p className="font-bold my-4">Total Users: {totalUsers}</p>
            <div className="flex justify-between">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Search..."
                  value={filter}
                  onChange={handleFilterChange}
                  className="w-full mb-4 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
                />
              </div>
              <div className="flex items-center">
                <label htmlFor="status" className="mr-2 font-semibold">Filter By Status:</label>
                <select
                  id="status"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500"
                >
                  <option value="">All</option>
                  <option value="NO ACTION">No Action</option>
                  <option value="approved">Approved</option>
                  <option value="denied">Denied</option>
                </select>
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

export default CourseStudents;
