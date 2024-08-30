
import Sidebar from "../../SideBar Section/Sidebar";
import Top from "../../Profile/Components/Header";
import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import { Select, Alert, Button, Modal, ModalBody, TextInput, FileInput } from 'flowbite-react';


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
        let url = "/api/user/getusers";
        if (filter) {
          url += `?filter=${filter}`;
        }
        const res = await fetch(url);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalOnlinePE);
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
          console.log(data.degreeCourseCounts); // Debugging
        }
      } catch (error) {
        console.log(error.message);
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
        <div className="mainContent">
          <div className="bg-white rounded-lg border border-gray-200 p-10 w-full">
          <div className="text-2xl font-bold mb-4">Online Submissions of Physical Examinations</div>
            <p className="font-light my-4 px-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec nisl quis risus eleifend venenatis. Mauris nec justo nec ligula suscipit consequat. Donec rutrum nisi nec faucibus euismod. Sed sit amet vestibulum metus.</p>
          </div>
          <Tabs aria-label="Default tabs" style="default" className="my-4 ">
          <Tabs.Item  title="COLLEGES" icon={HiUserCircle}>
            <div className="bg-white rounded-lg border border-gray-200 p-10 w-full my-4">
                            <p className="text-2xl font-light mb-4">COLLEGES</p>
                            <div className="flex space-x-4">
                    <div
                      className="bg-white rounded-lg border border-gray-200 p-5 w-1/4 my-4 bg-gradient-to-r from-green-400 to-blue-400 text-white text-left transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                      onClick={() => handleCollegeClick('CAS')}
                    >
                      <div className="text-2xl justify-center font-semibold  mb-4">CAS</div>
                      <p className="text-sm font-light mb-4">Total Students: {totalCAS}</p>
                      <p className="text-sm font-light mb-4">Total Validated: {totalCASValidated}</p>
                      <p className="text-sm font-light mb-4">To be Checked: {totalCASChecked}</p>
                    </div>
                    <div
                      className="bg-white rounded-lg border border-gray-200 p-5 w-1/4 my-4 bg-gradient-to-r from-green-400 to-blue-400 text-white text-left transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
                      onClick={() => handleCollegeClick('CFOS')}
                    >
                      <div className="text-2xl justify-center font-semibold mb-4">CFOS</div>
                      <p className="text-sm font-light mb-4">Total Students: {totalCFOS}</p>
                      <p className="text-sm font-light mb-4">Total Validated: {totalCFOSValidated}</p>
                      <p className="text-sm font-light mb-4">To be Checked: {totalCFOSChecked}</p>
                    </div>
                    <div
                      className="bg-white rounded-lg border border-gray-200 p-5 w-1/4 my-4 bg-gradient-to-r from-green-400 to-blue-400 text-white text-left transition duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
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
                        <Tabs.Item active title="Degree Program" icon={HiUserCircle}>
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
                        <Tabs.Item  title="View All" icon={HiUserCircle}>
                        <UsersOnline/>
                        </Tabs.Item>
         
          </Tabs>
        </div>
      </div>
    </div>
  );
};
export default Online;