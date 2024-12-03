
import Sidebar from "../../SideBar Section/Sidebar";
import Top from "../../Profile/Components/Header";
import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import { Select, Card, Alert, Button, Modal, ModalBody, TextInput, FileInput } from 'flowbite-react';
import Breadcrumb from "../../../Breadcrumb.jsx";

import { Tabs } from "flowbite-react";
import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";

import "../../Annual/annual.css";

import axios from 'axios';


import {Link, useNavigate} from 'react-router-dom'
import UsersOnline from "./UsersOnline";
const Online = () => {
  

  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedDegreeProgram, setSelectedDegreeProgram] = useState("");
  const [filter, setFilter] = useState("");
  const [totalCAS, setTotalCAS] = useState(0);
  const [totalCFOS, setTotalCFOS] = useState(0);
  const [totalSOTECH, setTotalSOTECH] = useState(0);
  const [totalCASValidated, setTotalCASValidated] = useState(0);
  const [totalCASChecked, setTotalCASChecked] = useState(0);
  const [totalCFOSValidated, setTotalCFOSValidated] = useState(0);
  const [totalCFOSChecked, setTotalCFOSChecked] = useState(0);
  const [totalSOTECHValidated, setTotalSOTECHValidated] = useState(0);
  const [totalSOTECHChecked, setTotalSOTECHChecked] = useState(0);
  const [degreeCourseCounts, setDegreeCourseCounts] = useState({});

  const [totalComplete, setTotalComplete] = useState(0);
  const [totalIncomplete, setTotalIncomplete] = useState(0);
  const [totalNoSubmissions, setTotalNoSubmissions] = useState(0);
  const [totalApproved, setTotalApproved] = useState(0);
  const [totalDenied, setTotalDenied] = useState(0);
  const [totalPending, setTotalPending] = useState(0);

  const degreeCourses = [
    "COMMUNITY DEVELOPMENT",
    "History",
    "COMMUNICATION AND MEDIA STUDIES",
    "LITERATURE",
    "POLITICAL SCIENCE",
    "PSYCHOLOGY",
    "SOCIOLOGY",
    "APPLIED MATHEMATICS",
    "BIOLOGY",
    "CHEMISTRY",
    "COMPUTER SCIENCE",
    "ECONOMICS",
    "PUBLIC HEALTH",
    "STATISTICS",
    "FISHERIES",
    "CHEMICAL ENGINEERING",
    "FOOD TECHNOLOGY"
  ];

  const navigate = useNavigate(); 

  

  const handleDegreeCourseClick = (course) => {
    window.open(`/users/course/${course}`, '_blank');
  };

  const handleCollegeClick = (college) => {
    window.open(`/users/college/${college}`, '_blank');
  };
  

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true); // Start loading
        let url = "/api/user/getusers";
        if (filter) {
          url += `?filter=${filter}`;
        }
        const res = await fetch(url);
        const data = await res.json();
        console.log("API Response:", data); // Log the response
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers); // Ensure this matches backend response
          setTotalCAS(data.totalCAS);
          setTotalCFOS(data.totalCFOS);
          setTotalSOTECH(data.totalSOTECH);
          setTotalCASValidated(data.totalCASValidated);
          setTotalCASChecked(data.totalCASChecked);
          setTotalCFOSValidated(data.totalCFOSValidated);
          setTotalCFOSChecked(data.totalCFOSChecked);
          setTotalSOTECHValidated(data.totalSOTECHValidated);
          setTotalSOTECHChecked(data.totalSOTECHChecked);
          setDegreeCourseCounts(data.degreeCourseCounts);
          setTotalComplete(data.totalComplete); // Check existence
          setTotalIncomplete(data.totalIncomplete); // Check existence
          setTotalNoSubmissions(data.totalNoSubmissions); // Check existence
          setTotalApproved(data.totalApproved); // Check existence
          setTotalDenied(data.totalDenied); // Check existence
          setTotalPending(data.totalPending); // Check existence
        }
      } catch (error) {
        console.log(error.message);
      }
      finally {
        setLoading(false); // End loading
      }
    };
  
    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id, filter]);
  
  const [loading, setLoading] = useState(false);

  

  const headerTitle = "Annual Physical Examination";
  return (
    <div className="dashboard my-flex">
      <div className="dashboardContainer my-flex">
        <Sidebar />
         <div className="mainContent p-0 m-0">
                <Card href="#" className="w-full h-1/4  p-10 bg-gradient-to-r from-green-700 to-green-500">
                    <div className="text-3xl mt-5 font-semibold tracking-tight text-white dark:text-white">Online Submissions of Physical Examinations</div>     
                    <p className="font-light my-4 text-white ">View and manage documents submitted for physical examination</p>
                    <Breadcrumb/>
                </Card>

          <div className="p-8">
          <Tabs aria-label="Default tabs" style="default" className="my-2 ">
                      <Tabs.Item  title="Main" icon={HiUserCircle}>

                      <div className="bg-white rounded-lg border border-gray-200 p-10 w-full my-4">
                          <p className="text-2xl font-light mb-4">Annual PE Status</p>
                          <div className="flex space-x-4">
                            {/* Card for Complete Submissions */}
                            <div
                              className="bg-white rounded-lg border border-gray-200 p-5 w-1/3 my-4 p-2 bg-gradient-to-r from-green-400 to-green-300 text-white text-left transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer h-32 flex items-center"
                              
                            >
                              <div className="flex justify-between w-full">
                                <div className="text-2xl font-semibold">
                                  Approved
                                </div>
                                <div className="flex items-center p-5 justify-center w-12 h-12 bg-green-500 rounded-full text-white font-semibold ml-4" >
                                  {totalApproved}
                                </div>

                              </div>
                            </div>
                            
                            {/* Card for Incomplete Submissions */}
                            <div
                              className="bg-white rounded-lg border border-gray-200 p-5 w-1/3 my-4 bg-gradient-to-r from-yellow-400 to-yellow-300 text-white text-left transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer h-32 flex items-center"
                              
                            >
                              <div className="flex justify-between w-full">
                                <div className="text-2xl font-semibold">
                                  Pending
                                </div>
                                <div className="flex items-center p-5 justify-center w-12 h-12 bg-yellow-500 rounded-full text-white font-semibold ml-4">
                                  {totalPending}
                                </div>
                              </div>
                            </div>
                            
                            {/* Card for No Documents Submitted */}
                            <div
                              className="bg-white rounded-lg border border-gray-200 p-5 w-1/3 my-4 bg-gradient-to-r from-red-400 to-red-500 text-white text-left transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer h-32 flex items-center"
                             
                            >
                              <div className="flex justify-between w-full">
                                <div className="text-2xl font-semibold">
                                  Denied
                                </div>
                                <div className="flex items-center justify-center w-12 h-12 bg-red-800 rounded-full text-white font-semibold ml-4 p-2">
                                  {totalDenied}
                                </div>
                              </div>
                            </div>
                          </div>
                      </div>

                      <div className="bg-white rounded-lg border border-gray-200 p-10 w-full my-4">
                          <p className="text-2xl font-light mb-4">Document Status</p>
                          <div className="flex space-x-4">
                            {/* Card for Complete Submissions */}
                            <div
                              className="bg-white rounded-lg border border-gray-200 p-5 w-1/3 my-4 p-2 bg-gradient-to-r from-green-400 to-green-300 text-white text-left transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer h-32 flex items-center"
                              onClick={() => window.open('/completeDocs', '_blank')}
                            >
                              <div className="flex justify-between w-full">
                                <div className="text-2xl font-semibold">
                                  Students with Complete Submissions
                                </div>
                                <div className="flex items-center p-5 justify-center w-12 h-12 bg-green-500 rounded-full text-white font-semibold ml-4" >
                                  {totalComplete}
                                </div>

                              </div>
                            </div>
                            
                            {/* Card for Incomplete Submissions */}
                            <div
                              className="bg-white rounded-lg border border-gray-200 p-5 w-1/3 my-4 bg-gradient-to-r from-yellow-400 to-yellow-300 text-white text-left transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer h-32 flex items-center"
                              onClick={() => window.open('/incDocs', '_blank')}
                            >
                              <div className="flex justify-between w-full">
                                <div className="text-2xl font-semibold">
                                  Students with Inc Submissions
                                </div>
                                <div className="flex items-center p-5 justify-center w-12 h-12 bg-yellow-500 rounded-full text-white font-semibold ml-4">
                                  {totalIncomplete}
                                </div>
                              </div>
                            </div>
                            
                            {/* Card for No Documents Submitted */}
                            <div
                              className="bg-white rounded-lg border border-gray-200 p-5 w-1/3 my-4 bg-gradient-to-r from-red-400 to-red-500 text-white text-left transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer h-32 flex items-center"
                              onClick={() => window.open('/noDocs', '_blank')}
                            >
                              <div className="flex justify-between w-full">
                                <div className="text-2xl font-semibold">
                                  Students with No Documents Submitted
                                </div>
                                <div className="flex items-center justify-center w-12 h-12 bg-red-800 rounded-full text-white font-semibold ml-4 p-2">
                                  {totalNoSubmissions}
                                </div>
                              </div>
                            </div>
                          </div>
                      </div>
                          <div className="bg-white rounded-lg border border-gray-200 p-10 w-full my-4">
                                          <p className="text-2xl font-light mb-4">COLLEGES</p>
                                          <div className="flex space-x-4">
                                  <div
                                    className="bg-white rounded-lg border border-gray-200 p-5 w-full my-4 bg-gradient-to-r from-green-400 to-blue-400 text-white text-left transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                                    onClick={() => handleCollegeClick('CAS')}
                                  >
                                    <div className="text-2xl justify-center font-semibold  mb-4">CAS</div>
                                    <p className="text-sm font-light mb-4">Total Students: {totalCAS}</p>
                                    <p className="text-sm font-light mb-4">Total Validated: {totalCASValidated}</p>
                                    <p className="text-sm font-light mb-4">To be Checked: {totalCASChecked}</p>
                                  </div>
                                  <div
                                    className="bg-white rounded-lg border border-gray-200 p-5 w-full my-4 bg-gradient-to-r from-green-400 to-blue-400 text-white text-left transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                                    onClick={() => handleCollegeClick('CFOS')}
                                  >
                                    <div className="text-2xl justify-center font-semibold mb-4">CFOS</div>
                                    <p className="text-sm font-light mb-4">Total Students: {totalCFOS}</p>
                                    <p className="text-sm font-light mb-4">Total Validated: {totalCFOSValidated}</p>
                                    <p className="text-sm font-light mb-4">To be Checked: {totalCFOSChecked}</p>
                                  </div>
                                  <div
                                    className="bg-white rounded-lg border border-gray-200 p-5 w-full my-4 bg-gradient-to-r from-green-400 to-blue-400 text-white text-left transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                                    onClick={() => handleCollegeClick('SOTECH')}
                                  >
                                    <div className="text-2xl justify-center font-semibold mb-4">SOTECH</div>
                                    <p className="text-sm font-light mb-4">Total Students: {totalSOTECH}</p>
                                    <p className="text-sm font-light mb-4">Total Validated: {totalSOTECHValidated}</p>
                                    <p className="text-sm font-light mb-4">To be Checked: {totalSOTECHChecked}</p>
                                  </div>
                                </div>

                          </div>

                          

                        </Tabs.Item>
                      <Tabs.Item active title="View All" icon={HiUserCircle}>
                          {loading ? (
                            <div className="text-center my-4">
                              <p className="text-xl">Loading...</p>
                            </div>
                          ) : (
                            <UsersOnline users={users} />
                          )}
                        </Tabs.Item>
                        
                        <Tabs.Item title="Degree Program" icon={HiUserCircle}>
                          <div className="bg-white rounded-lg border border-gray-200 p-10 w-full my-4">
                            <p className="text-2xl font-light mb-4">Degree Courses</p>
                            <div className="flex flex-wrap gap-3">
                              {degreeCourses.map((course, index) => (
                                <div
                                  key={index}
                                  className="bg-white rounded-lg border border-gray-200 p-5 w-1/4 my-4 bg-gradient-to-r from-green-400 to-blue-400 text-white text-left transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                                  onClick={() => handleDegreeCourseClick(course)}
                                >
                                  <div className="text-lg font-semibold mb-2">{course}</div>
                                  <p className="text-sm font-light mb-2">Total Students: {degreeCourseCounts[course]?.total}</p>
                                  <p className="text-sm font-light mb-2">Total Validated: {degreeCourseCounts[course]?.validated}</p>
                                  <p className="text-sm font-light mb-2">To be Checked: {degreeCourseCounts[course]?.checked}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        </Tabs.Item>
                        
         
          </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Online;