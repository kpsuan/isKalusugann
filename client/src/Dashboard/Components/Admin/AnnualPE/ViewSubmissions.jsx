
import Sidebar from "../../SideBar Section/Sidebar";
import Top from "../../Profile/Components/Header";
import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';


import "../../Annual/annual.css";

import axios from 'axios';


import {Link, useNavigate} from 'react-router-dom'
import UsersWhoSubmittedOnline from "./UsersWhoSubmittedOnline";
import ViewIn from "./ViewIn";
import { Tabs } from "flowbite-react";
import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";

const ViewSubmissions = () => {
  const navigate = useNavigate();

  const handleCourseClick = (course) => {
    console.log(course);
    setSelectedDegreeProgram(course);
    navigate(`/users/course/${course}`); // Navigating to the selected course
  };

  const handleCollegeClick = (college) => {
    setSelectedCollege(college);
    navigate(`/users/college/${college}`); // Navigate to the correct backend route
  };
  
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [totalUsers, setTotalUsers] = useState(0);
  const [selectedDegreeProgram, setSelectedDegreeProgram] = useState("");
  const [selectedCollege, setSelectedCollege] = useState("");
  const [filter, setFilter] = useState("");
  const [totalCAS, setTotalCAS] = useState(0);
  const [totalCFOS, setTotalCFOS] = useState(0);
  const [totalSOTECH, setTotalSOTECH] = useState(0);
  
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

  const college = [
    "CAS",
    "CFOS",
    "SOTECH",
  ];
  useEffect(() => {
    const fetchSubmittedUsers = async () => {
      try {
        let url = "/api/user/getSubmittedUsers"; // Update the URL endpoint
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
        }
      } catch (error) {
        console.log(error.message);
      }
    };
  
    if (currentUser.isAdmin) {
      fetchSubmittedUsers();
    }
  }, [currentUser._id, filter]);
  

  const headerTitle = "Annual Physical Examination";
    return (
        <div className="dashboard my-flex">
          <div className="dashboardContainer my-flex">
            <Sidebar />
            <div className="mainContent">
            <div className="bg-white rounded-lg border border-gray-200 p-10 w-full">
                        <div className="text-2xl font-bold mb-4">List of Students with Submitted Documents</div>
                          <p className="font-light my-4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec nisl quis risus eleifend venenatis. Mauris nec justo nec ligula suscipit consequat. Donec rutrum nisi nec faucibus euismod. Sed sit amet vestibulum metus.</p>

                        </div>
<Tabs aria-label="Default tabs" style="default" className="my-4 ">
          <Tabs.Item active title="COLLEGES" icon={HiUserCircle}>
            <div className="bg-white rounded-lg border border-gray-200 p-10 w-full my-4">
              

                            <p className="text-2xl font-light mb-4">COLLEGES</p>
                            <div className="flex space-x-4">
                            {college.map((college, index) => (
                                  <button
                                    key={index}
                                    className="bg-white rounded-lg border border-gray-200 p-5 w-1/4 my-4 bg-gradient-to-r from-green-400 to-blue-400 text-white text-left transition duration-300 ease-in-out transform hover:scale-105"
                                    onClick={() => handleCollegeClick(college)}
                                  >
                                      <div className="text-lg font-semibold mb-2">{college}</div>
                                      <p className="text-sm font-light mb-2">Total Students: {college.totalSubmissions}</p>
                                      <p className="text-sm font-light mb-2">Total Validated: {college.totalValidated}</p>
                                      <p className="text-sm font-light mb-2">To be Checked: {college.toBeChecked}</p>
                                  </button>
                              ))}
                            </div>


                        </div>
                        </Tabs.Item>
                        <Tabs.Item active title="Degree Program" icon={HiUserCircle}>

                        <div className="bg-white rounded-lg border border-gray-200 p-10 w-full my-4">
                          <p className="text-2xl font-light mb-4">Degree Courses</p>
                          <div className="flex flex-wrap gap-3">
                              {degreeCourses.map((course, index) => (
                                  <button
                                    key={index}
                                    className="bg-white rounded-lg border border-gray-200 p-5 w-1/4 my-4 bg-gradient-to-r from-green-400 to-blue-400 text-white text-left transition duration-300 ease-in-out transform hover:scale-105"
                                    onClick={() => handleCourseClick(course)}
                                  >
                                      <div className="text-lg font-semibold mb-2">{course}</div>
                                      <p className="text-sm font-light mb-2">Total Students: {course.totalSubmissions}</p>
                                      <p className="text-sm font-light mb-2">Total Validated: {course.totalValidated}</p>
                                      <p className="text-sm font-light mb-2">To be Checked: {course.toBeChecked}</p>
                                  </button>
                              ))}
                          </div>

                        </div>
                        </Tabs.Item>
                        <Tabs.Item active title="View All" icon={HiUserCircle}>
                        <UsersWhoSubmittedOnline/>
                        </Tabs.Item>
         
          </Tabs>
            </div>       
          </div>
        </div>
    );
};
export default ViewSubmissions;