
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card, Table, Tabs } from 'flowbite-react';
import {Link, useNavigate} from 'react-router-dom'
import { FileText, Users } from 'lucide-react';
import Pagination from '../AnnualPE/Pagination';
import Sidebar from "../../SideBar Section/Sidebar";
import "./../../Annual/Appointment/appointment.css";

import axios from 'axios';
import { 
    HiOutlineDocumentText, 
    HiOutlineAcademicCap,
    HiOutlineUserGroup,
    HiOutlineClock,
    HiOutlineCheckCircle,
    HiOutlineXCircle,
    HiOutlineViewGrid,
    HiUsers
  } from 'react-icons/hi';

const StatCard = ({ title, value, icon: Icon, colorClass, bgClass, onClick }) => (
  <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={onClick}>
    <div className="flex items-center">
      <div className={`p-4 ${bgClass} rounded-lg`}>
        <Icon className={`w-6 h-6 ${colorClass}`} />
      </div>
      <div className="ml-4">
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
      </div>
    </div>
  </Card>
);



const AppointmentsHome = () => {

    const { currentUser } = useSelector((state) => state.user);
    const [users, setUsers] = useState([]);
   
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalApproved, setTotalApproved] = useState(0);
    const [totalDenied, setTotalDenied] = useState(0);
    const [totalPending, setTotalPending] = useState(0);
    
    const [selectedDegreeProgram, setSelectedDegreeProgram] = useState("");
    const [statusFilter, setStatusFilter] = useState("");
    const [filter, setFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [limit] = useState(9); // Keep this constant
    const totalPages = Math.ceil(totalUsers / limit);


    useEffect(() => {
        const fetchUsers = async () => {
          try {
            const startIndex = (currentPage - 1) * limit;
            let url = `/api/user/getinperson?startIndex=${startIndex}&limit=${limit}`;
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
            console.log("API Response:", data); // Log the API response for debugging
      
            if (res.ok) {
              setUsers(data.users);
              setTotalUsers(data.totalUsers);
              setTotalApproved(data.totalApproved);
              setTotalDenied(data.totalDenied);
              setTotalPending(data.totalPending);
              
              console.log("Total Approved:", data.totalApproved);
              console.log("Total Denied:", data.totalDenied);
              console.log("Total Pending:", data.totalPending);
            }
          } catch (error) {
            console.log("Error fetching users:", error.message);
          }
        };
      
        if (currentUser.isAdmin) {
          fetchUsers();
        }
      }, [currentUser._id, filter, selectedDegreeProgram, statusFilter, currentPage, limit]);
      
      
  
  
  return (
    <div className="dashboard my-flex">
      <div className="dashboardContainer my-flex">
        <Sidebar />
        <div className="mainContent">
          
          {/* Start editing from here */}
          <Card className="w-full bg-gradient-to-br from-blue-600 via-blue-600 to-blue-500 border-none shadow-lg">
            <div className="relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white/20" />
                <div className="absolute -left-16 -bottom-16 h-80 w-80 rounded-full bg-white/20" />
              </div>

              <div className="relative p-8 space-y-6">
                {/* Header Content */}
                <div className="flex items-start justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <h1 className="text-3xl font-bold text-white">
                        Dental Appointments
                      </h1>
                    </div>
                    <p className="text-emerald-50 text-lg max-w-2xl">
                      View and manage dental appointments
                    </p>
                  </div>
                </div>

                {/* Quick Stats */}
                                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 mt-4">
                                  <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                                    <div className="flex items-center space-x-2">
                                      <Users className="h-5 w-5 text-emerald-100" />
                                      <span className="text-emerald-50">Total Appointments</span>
                                    </div>
                                    <p className="text-2xl font-bold text-white mt-2">{142}</p>
                                  </div>
                                  <div className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                                    <div className="flex items-center space-x-2">
                                      <FileText className="h-5 w-5 text-emerald-100" />
                                      <span className="text-emerald-50">Today's Appointments</span>
                                    </div>
                                    <p className="text-2xl font-bold text-white mt-2">{12}</p>
                                  </div>
                                </div>
               
              </div>
            </div>
          </Card>
          <div className="mt-10 mb-8">
                                    <div className="grid md:grid-cols-3 gap-4">
                                      <StatCard
                                        title="Approved"
                                        value='12'
                                        icon={HiOutlineCheckCircle}
                                        colorClass="text-green-600"
                                        bgClass="bg-green-100"
                                      />
                                      <StatCard
                                        title="Pending"
                                        value={12}
                                        icon={HiOutlineClock}
                                        colorClass="text-yellow-600"
                                        bgClass="bg-yellow-100"
                                      />
                                      <StatCard
                                        title="Denied"
                                        value={13}
                                        icon={HiOutlineXCircle}
                                        colorClass="text-red-600"
                                        bgClass="bg-red-100"
                                      />
                                    </div>
            </div>
            <div className="mt-10 mb-8">
                <h1 className='text-2xl ml-2 font-semibold'>Today's Appointment</h1>
                <div className='my-10 table-auto overflow-x-scroll md:mx-auto p-1 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
              {currentUser.isAdmin && users.length > 0 ? (
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
            <div className="mt-10 mb-8">
                <Card>Appointment Requests</Card>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsHome;
