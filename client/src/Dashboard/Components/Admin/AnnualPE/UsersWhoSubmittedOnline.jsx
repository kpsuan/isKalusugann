import Sidebar from "../../SideBar Section/Sidebar";
import Top from "../../Profile/Components/Header";
import "../../Annual/annual.css";
import {Alert, Button, Modal, ModalBody, TextInput, Table, TableCell} from 'flowbite-react'

import { HiOutlineExclamationCircle } from 'react-icons/hi';
import {Link} from 'react-router-dom'
import { useEffect, useState  } from "react"
import { useSelector } from 'react-redux';
import { set } from 'mongoose';

const UsersWhoSubmittedOnline = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedDegreeProgram, setSelectedDegreeProgram] = useState("");
  const [filter, setFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [degreeProgramFilter, setDegreeProgramFilter] = useState("");



  useEffect(() => {
    const fetchSubmittedUsers = async () => {
      try {
        let url = "/api/user/getsubmmitedusers";
        const params = new URLSearchParams();
        
        // Add query parameters for degree program and status
        if (selectedDegreeProgram) {
          params.append('degreeProgram', selectedDegreeProgram);
        }
        if (statusFilter) {
          params.append('status', statusFilter);
        }
        
        if (filter) {
          params.append('filter', filter);
        }
        
        const queryString = params.toString();
        if (queryString) {
          url += `?${queryString}`;
        }
  
        const res = await fetch(url);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalOnlinePE);
          setTotalCAS(data.totalCAS);
          setTotalCFOS(data.totalCFOS);
          setTotalSOTECH(data.totalSOTECH);
        }
      } catch (error) {
        console.log(error.message);
      }
    };
  
    if (currentUser.isAdmin) {
      fetchSubmittedUsers();
    }
  }, [currentUser._id, selectedDegreeProgram, statusFilter, filter]);
  

  const handleStatusFilterChange = (event) => {
    const selectedStatus = event.target.value;
    setStatusFilter(selectedStatus);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const handleDegreeProgramChange = (event) => {
    setSelectedDegreeProgram(event.target.value);
    setFilter(""); // Reset the filter when selecting a degree program
    fetchFilteredUsers(event.target.value);
  };

  const fetchFilteredUsers = async (degreeProgram) => {
    try {
      const res = await fetch(`/api/user/getusers?degreeProgram=${degreeProgram} `);
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users);
        setTotalUsers(data.totalOnlinePE);
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(
        `/api/user/getusers?startIndex=${startIndex}&degreeProgram=${selectedDegreeProgram}&filter=${filter}&status=${statusFilter}`
      );
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };
  

  return (
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

        <div className="flex justify-between">
          <div className="flex items-center">
            <label htmlFor="degreeProgram" className="mr-2 font-semibold">
              Select Course:
            </label>
            <select id="" 
              value={degreeProgramFilter} 
              onChange={(e) => setDegreeProgramFilter(e.target.value)} 
              className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500">

              <option value="">All</option>
              <option value="COMMUNITY DEVELOPMENT">Community Development</option>
              <option value="History">History</option>
              <option value="COMMUNICATION AND MEDIA STUDIES">Communication and Media Studies</option>
              <option value="LITERATURE">Literature</option>
              <option value="POLITICAL SCIENCE">Political Science</option>
              <option value="PSYCHOLOGY">Psychology</option>
              <option value="SOCIOLOGY">Sociology</option>
              <option value="APPLIED MATHEMATICS">Applied Mathematics</option>
              <option value="BIOLOGY">Biology</option>
              <option value="CHEMISTRY">Chemistry</option>
              <option value="COMPUTER SCIENCE">Computer Science</option>
              <option value="PUBLIC HEALTH">Public Health</option>
              <option value="STATISTICS">Statistics</option>
              <option value="FISHERIES">Fisheries</option>
              <option value="CHEMICAL ENGINEERING">Chemical Engineering</option>
              <option value="FOOD TECHNOLOGY">Food Technology</option>
            </select>
          </div>
          <div className="flex items-center ml-4">
        <label htmlFor="" className="mr-2 font-semibold">Filter By Status:</label>
        <select id="" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:border-blue-500">
          <option value="">All</option>
          <option value="NO ACTION">No Action</option>
          <option value="approved">Approved</option>
          <option value="denied">Denied</option>
        </select>
      </div>
        </div>

      </div>
    
    <div className='my-10 table-auto overflow-x-scroll md:mx-auto p-1 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head className="text-left px-3">
              <Table.HeadCell>Name </Table.HeadCell>
              <Table.HeadCell>Sex </Table.HeadCell>
              <Table.HeadCell>Year Level </Table.HeadCell>
              <Table.HeadCell>Degree Program </Table.HeadCell>
              <Table.HeadCell>College </Table.HeadCell>
              <Table.HeadCell>Documents </Table.HeadCell>

              <Table.HeadCell>
                <span>Status </span>
              </Table.HeadCell>
              <Table.HeadCell>Remarks</Table.HeadCell>
            </Table.Head>
            {users.map((user) => (
              <Table.Body className="divide-y my-4">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 ">
                  
                    <Table.Cell >
                      <Link className="text-right font-medium text-gray-900 hover:underline" to ={`/users/${user.slug}`}>
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
              </Table.Body>
            ))

            }
          </Table>
          {showMore && (
            <button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm py-7">Load more</button>
          )}
        </>
      ):(
        <p>NO USERS</p>
      )}
    </div>
    </div>
    
  );
}


export default UsersWhoSubmittedOnline