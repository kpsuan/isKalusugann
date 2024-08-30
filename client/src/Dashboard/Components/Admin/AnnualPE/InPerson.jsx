
import Sidebar from "../../SideBar Section/Sidebar";
import Top from "../../Profile/Components/Header";
import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import { Select, Alert, Button, Modal, ModalBody, TextInput, FileInput } from 'flowbite-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


import { Tabs } from "flowbite-react";
import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "../../Annual/annual.css";

import axios from 'axios';


import {Link, useNavigate} from 'react-router-dom'
import UserInPerson from "./UserInPerson";
import ScheduledForDate from "./ScheduledOn";
const InPerson = () => {
  
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
  const [savedStartDate, setSavedStartDate] = useState(null);
  const [savedEndDate, setSavedEndDate] = useState(null);
  const [showPopup, setShowPopup] = useState(false);


  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  
  useEffect(() => {
    // Load saved dates from localStorage
    const savedStart = localStorage.getItem('startDate');
    const savedEnd = localStorage.getItem('endDate');
    
    if (savedStart && savedEnd) {
      setSavedStartDate(new Date(savedStart));
      setSavedEndDate(new Date(savedEnd));
    }
  }, []);

  useEffect(() => {
    // Initialize startDate and endDate with saved dates if available
    if (savedStartDate) setStartDate(savedStartDate);
    if (savedEndDate) setEndDate(savedEndDate);
  }, [savedStartDate, savedEndDate]);

  const handleSaveDates = () => {
    // Save the selected dates to localStorage
    localStorage.setItem('startDate', startDate.toISOString());
    localStorage.setItem('endDate', endDate.toISOString());

    // Update state and show success message
    setSavedStartDate(startDate);
    setSavedEndDate(endDate);
    toast.success('Dates saved successfully!');
  };



  const handleSetSched = () => {
    setShowPopup(!showPopup); // Toggle popup visibility
  };
  
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
    window.open(`/course/${course}`, '_blank');
  };

  const handleCollegeClick = (college) => {
    window.open(`/college/${college}`, '_blank');
  };
  

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let url = "/api/user/getinperson";
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

  const handleGenerateSchedule = async () => {
    // Check if dates are set
    if (!savedStartDate || !savedEndDate) {
      toast.error('Please set the start and end dates before generating the schedule.');
      return;
    }

    setLoading(true);
    try {
      await axios.post(`/api/user/assignschedule`, {
        startDate: savedStartDate,
        endDate: savedEndDate,
      });
      toast.success('Schedule generated successfully!', {
        onClose: () => navigate(0) // Navigate after toast closes
      });
    } catch (error) {
      console.error('Error generating schedule:', error);
      toast.error('Error generating schedule. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRescheduleClick = () => {
    navigate('/reschedule', { state: { startDate: savedStartDate, endDate: savedEndDate } });
  };
  
  const handleClearSchedules = async () => {
    setLoading(true);
    try {
      await axios.delete(`/api/user/deleteschedule`);
      
      // Clear savedStartDate and savedEndDate from state
      setSavedStartDate(null);
      setSavedEndDate(null);
  
      // Clear savedStartDate and savedEndDate from localStorage
      localStorage.removeItem('startDate');
      localStorage.removeItem('endDate');
  
      toast.success('Schedules cleared successfully!', {
        onClose: () => navigate(0) // Navigate after toast closes
      });
    } catch (error) {
      console.error('Error clearing schedules:', error);
      toast.error('Error clearing schedules. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  const headerTitle = "Annual Physical Examination";
  return (
    <><div className="dashboard my-flex">
      <ToastContainer className={"z-50"} />
      <div className="dashboardContainer my-flex">
        <Sidebar />
        <div className="mainContent">
          <div className="bg-white rounded-lg border border-gray-200 p-10 w-full">
            <div className="text-3xl font-bold mb-4 pl-2">InPerson Physical Examinations</div>
            <div className="flex flex-1 ">
              <p className="font-light my-4 px-2">
              Start date for annual PE: <span className="font-bold ">{savedStartDate ? savedStartDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}</span>
              </p>
              <p className="font-light my-4 px-2">
              End date for annual PE: <span className="font-bold">{savedEndDate ? savedEndDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}</span>
              </p>
            </div>
            <button
                  className="my-2 transition duration-300 ease-in-out transform hover:scale-105 text-lg bg-gradient-to-r from-cyan-500 to-cyan-400 text-white px-6 py-3 rounded-md"
                  onClick={handleRescheduleClick}
                >
                  Reschedules
                </button>
            {currentUser.isSuperAdmin && (
              <div className="relative flex m-2 space-x-2">
                <button
                  className="my-2 transition duration-300 ease-in-out transform hover:scale-105 text-lg bg-gradient-to-r from-green-500 to-blue-400 text-white px-6 py-3 rounded-md"
                  onClick={handleSetSched}
                  disabled={loading}
                >
                  {loading ? 'Setting...' : 'Set Schedule'}
                </button>
                <button
                  className="my-2 transition duration-300 ease-in-out transform hover:scale-105 text-lg bg-gradient-to-r from-green-500 to-blue-400 text-white px-6 py-3 rounded-md"
                  onClick={handleGenerateSchedule}
                  disabled={loading}
                >
                  {loading ? 'Generating...' : 'Generate Schedule'}
                </button>
                <button
                  className="my-2 transition duration-300 ease-in-out transform hover:scale-105 text-lg bg-gradient-to-r from-red-500 to-red-400 text-white px-6 py-3 rounded-md"
                  onClick={handleClearSchedules}
                  disabled={loading}
                >
                  {loading ? 'Clearing...' : 'Clear Schedules'}
                </button>
                

                
              </div>
            )}

          </div>
          <Tabs aria-label="Default tabs" style="default" className="my-4 ">
            
            <Tabs.Item active title="SCHEDULED FOR TODAY" icon={HiUserCircle}>
              <ScheduledForDate />
            </Tabs.Item>
            <Tabs.Item title="SCHEDULED ON DATE " icon={HiUserCircle}>
              <ScheduledForDate />
            </Tabs.Item>
            <Tabs.Item title="COLLEGES" icon={HiUserCircle}>
              <div className="bg-white rounded-lg border border-gray-200 p-10 w-full my-4">
                <p className="text-3xl font-light mb-4">Colleges</p>
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
                <p className="text-3xl font-light mb-4">Degree Courses</p>
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
            <Tabs.Item title="View All" icon={HiUserCircle}>
              <UserInPerson />
            </Tabs.Item>


          </Tabs>
        </div>
        {showPopup && (
          <Modal className="p-20" show={showPopup} onClose={() => setShowPopup(false)}>
            <Modal.Header>Set Schedule</Modal.Header>
            <Modal.Body>
              <div className="flex flex-col p-5">
                <div className="flex flex-1 mb-4">
                  <div className="flex flex-col flex-1">
                    <p>Start Date:</p>
                    <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      className="mt-2 p-2 border border-gray-300 rounded"
                      dateFormat="MMMM d, yyyy"
                    />
                  </div>
                  <div className="flex flex-col flex-1 ml-4">
                    <p>End Date:</p>
                    <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      className="mt-2 p-2 border border-gray-300 rounded"
                      dateFormat="MMMM d, yyyy"
                    />
                  </div>
                </div>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSaveDates} >
                  Save Dates
                </Button>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button color="failure" onClick={() => setShowPopup(false)}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        )}
      </div>
    </div></>
  );
};
export default InPerson;