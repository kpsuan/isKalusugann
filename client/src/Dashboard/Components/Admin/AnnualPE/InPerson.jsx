
import Sidebar from "../../SideBar Section/Sidebar";
import Top from "../../Profile/Components/Header";
import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import { Card, Select, Alert, Button, Modal, ModalBody, TextInput, FileInput } from 'flowbite-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, Clock, RefreshCw, Trash2, Calendar as CalendarIcon } from 'lucide-react';

import {
	ANNUALPE_SCHEDULE_TEMPLATE,
} from "../../../../../../api/utils/emailTemplate";

import { Tabs } from "flowbite-react";
import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Breadcrumb from '../../../Breadcrumb.jsx';

import "../../Annual/annual.css";

import axios from 'axios';


import {Link, useNavigate, useLocation} from 'react-router-dom'
import UserInPerson from "./UserInPerson";
import ScheduledForDate from "./ScheduledOn";
import ScheduledForToday from "./ScheduledToday";
import LoadingSkeleton from "./LoadingSkeleton.jsx";

import { motion } from 'framer-motion';

import { 
  HiOutlineDocumentText, 
  HiOutlineAcademicCap,

} from 'react-icons/hi';

const CollegeCard = ({ college, total, validated, checked, onClick }) => (
  <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={onClick}>
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xl font-semibold">{college}</h3>
      <HiOutlineAcademicCap className="w-6 h-6 text-blue-600" />
    </div>
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="text-gray-500">Total Students</span>
        <span className="font-semibold">{total}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-500">Validated</span>
        <span className="font-semibold text-green-600">{validated}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-500">To Check</span>
        <span className="font-semibold text-orange-500">{checked}</span>
      </div>
    </div>
  </Card>
);

const DegreeCard = ({ course, stats, onClick }) => (
  <Card className="cursor-pointer hover:shadow-lg transition-all" onClick={() => onClick(course)}>
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold">{course}</h3>
      <HiOutlineAcademicCap className="w-5 h-5 text-blue-600" />
    </div>
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="text-gray-500">Total Students</span>
        <span className="font-semibold">{stats?.total || 0}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-500">Validated</span>
        <span className="font-semibold text-green-600">{stats?.validated || 0}</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-500">To Check</span>
        <span className="font-semibold text-orange-500">{stats?.checked || 0}</span>
      </div>
    </div>
  </Card>
);

const ScheduleHeader = ({ 
  savedStartDate, 
  savedEndDate, 
  loading, 
  currentUser,
  onSetSchedule,
  onGenerateSchedule,
  onClearSchedules,
  onReschedule, 
  onEmailSchedule,
  onUnavailableDate,
  onRescheduleAll
}) => {
  return (
    <Card className="w-full bg-gradient-to-br from-cyan-600 via-cyan-500 to-cyan-400 border-none shadow-lg">
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-white/20" />
          <div className="absolute -left-16 -bottom-16 h-80 w-80 rounded-full bg-white/20" />
        </div>

        <div className="relative p-8 space-y-6">
          <h1 className="text-4xl font-bold text-white flex items-center gap-3">
            <Calendar className="h-8 w-8" />
            In-Person Physical Examinations
          </h1>

          {/* Date Information Card */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 max-w-md">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="text-cyan-100 text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Start Date
                </div>
                <p className="text-white font-semibold">
                  {savedStartDate && savedStartDate instanceof Date && !isNaN(savedStartDate.getTime()) 
                    ? savedStartDate.toLocaleDateString('en-US', { 
                        month: 'long', 
                        day: 'numeric', 
                        year: 'numeric' 
                      })
                    : 'Not Set'}
                </p>

              </div>
              <div className="space-y-1">
                <div className="text-cyan-100 text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  End Date
                </div>
                <p className="text-white font-semibold">
                {savedEndDate && savedEndDate instanceof Date && !isNaN(savedEndDate.getTime()) 
                  ? savedEndDate.toLocaleDateString('en-US', { 
                      month: 'long', 
                      day: 'numeric', 
                      year: 'numeric' 
                    })
                  : 'Not Set'}
              </p>

              </div>
            </div>
          </div>

          {currentUser.isSuperAdmin && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={onSetSchedule}
                  className="bg-blue-500 hover:bg-blue-600 text-white border-none"
                  disabled={loading}
                >
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  {loading ? 'Setting...' : 'Set Schedule'}
                </Button>
                <Button
                  onClick={onGenerateSchedule}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white border-none"
                  disabled={loading}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {loading ? 'Generating...' : 'Generate Schedule'}
                </Button>
                <Button
                    onClick={onEmailSchedule}
                    className="bg-pink-500 hover:bg-pink-800 text-white border-none"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Email Schedules
                </Button>
                <Button
                  onClick={onClearSchedules}
                  className="bg-red-500 hover:bg-red-600 text-white border-none"
                  disabled={loading}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {loading ? 'Clearing...' : 'Clear Schedules'}
                </Button>
                
              </div>
              
              
            </div>
          )}
           <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
            
              <Button
                    onClick={onReschedule}
                    className="bg-cyan-700 hover:bg-cyan-800 text-white border-none"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Handle Reschedules
              </Button>

              <Button
                    onClick={onRescheduleAll}
                    className="bg-yellow-400 hover:bg-yellow-500 text-white border-none"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Set Unavailable Reschedule Date
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};


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
  const [showEmailModal, setShowEmailModal] = useState(false);

  const location = useLocation();


  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  
  useEffect(() => {
    const fetchSavedDates = async () => {
      try {
        const response = await axios.get('/api/settings/getDates');
        if (response.status === 200) {
          const startDate = new Date(response.data.startDate);
          const endDate = new Date(response.data.endDate);
          
          // Check if the fetched dates are valid before updating state
          if (startDate.getTime() && endDate.getTime()) {
            setSavedStartDate(startDate);
            setSavedEndDate(endDate);
          } else {
            console.error("Invalid date fetched:", response.data);
          }
        }
      } catch (error) {
        console.error("Error fetching saved dates:", error);
        toast.error("Failed to fetch saved dates.");
      }
    };
  
    fetchSavedDates();
  }, []);
  

  useEffect(() => {
    // Initialize startDate and endDate with saved dates if available
    if (savedStartDate) setStartDate(savedStartDate);
    if (savedEndDate) setEndDate(savedEndDate);
  }, [savedStartDate, savedEndDate]);

  const handleSaveDates = async () => {
    if (!startDate || !endDate) {
      toast.error("Start and End dates are required.");
      return;
    }
    
    const userId = currentUser?._id;

    try {
      const response = await axios.post('/api/settings/saveDates', {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        userId
      });
  
      if (response.status === 200) {
        toast.success(response.data.message);
        setSavedStartDate(startDate);
        setSavedEndDate(endDate);
      }
    } catch (error) {
      console.error("Error saving dates:", error);
      toast.error("Failed to save dates. Please try again.");
    }
  };
  



  const handleSetSched = () => {
    setShowPopup(true);
    console.log("Popup visibility toggled:", true);
  };

  useEffect(() => {
    if (location.state?.openPopup) {
      handleSetSched(); 
    }
  }, [location.state]);
  
  
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
  
  const capitalizeWords = (string) => 
    string.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

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
    if (!savedStartDate || !savedEndDate) {
      toast.error('Please set the start and end dates before generating the schedule.');
      return;
    }
  
    const userId = currentUser?._id;

    setLoading(true);
    try {
      // Step 1: Generate the schedule
      await axios.post(`/api/user/assignschedule`, {
        userId,
        startDate: savedStartDate,
        endDate: savedEndDate,
      });
  
     
      toast.success('Schedule generated!');
    } catch (error) {
      console.error('Error generating schedule', error);
      toast.error('Error generating schedule. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendEmail = async () =>{
    setShowEmailModal(true);

  }
  
  const handleEmailSchedule = async () => {
    setLoading(true);
    try {
      // Step 2: Fetch all users to send the email
      const usersResponse = await axios.get(`/api/user/getinperson`);
      console.log(usersResponse.data); // Debugging step

    
      // Extract the 'users' array from the response
      const users = usersResponse.data.users;
      if (!Array.isArray(users)) {
        throw new Error('Invalid response format: expected an array of users');
      }

      
      // Step 3: Send email to each user
      for (const user of users) {

         // Prepare email content by replacing template placeholders
        let emailContent = ANNUALPE_SCHEDULE_TEMPLATE
         .replace('{firstName}',user.firstName)
         .replace('{schedule}', user.schedule);
   
        await axios.post('/api/email/emailUser', {
          email: user.email,
          subject: 'Annual PE Schedule Now Available',
          html: emailContent // Use html instead of text for formatted email
        });
      }
      toast.success('Emails sent successfully!');
    } catch (error) {
      console.error('Error sending emails', error);
      toast.error('Error sending emails. Please try again.');
    } finally {
      setLoading(false);
      setShowEmailModal(false);
    }
  };

  const handleRescheduleClick = () => {
    navigate('/reschedule', { state: { startDate: savedStartDate, endDate: savedEndDate } });
  };

  const handleRescheduleAllClick = () => {
    navigate('/handle-emergency');
  };


  const handleSetUnavailableDates = () => {
    navigate('/setunavailable');
  };
  
  const handleClearSchedules = async () => {
    setLoading(true);
    const userId = currentUser?._id;

    try {
      // Clear schedules on the backend
      await axios.delete(`/api/settings/clearDates`, { data: { userId } });
      await axios.delete(`/api/user/deleteschedule`, { data: { userId } });
      // Clear savedStartDate and savedEndDate from state
      setSavedStartDate(null);
      setSavedEndDate(null);
      
    
      
      // Notify user of success
      toast.success("Schedules cleared successfully!", {
        onClose: () => navigate(0), // Reload page after toast closes
      });
    } catch (error) {
      console.error("Error clearing schedules:", error);
      toast.error("Error clearing schedules. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  
  

  const headerTitle = "Annual Physical Examination";
  return (
    <>
    <div className="dashboard flex flex-col lg:flex-row">
  <ToastContainer className="z-50" />
  <Sidebar />
  <div className="mainContent flex-1 p-0 m-0">
   <ScheduleHeader 
          savedStartDate={savedStartDate}
          savedEndDate={savedEndDate}
          loading={loading}
          currentUser={currentUser}
          onSetSchedule={handleSetSched}
          onGenerateSchedule={handleGenerateSchedule}
          onEmailSchedule={handleSendEmail}
          onClearSchedules={handleClearSchedules}
          onReschedule={handleRescheduleClick}
          onRescheduleAll={handleRescheduleAllClick}
    />
          <div className="p-8 bg-gray-50">
          <Tabs aria-label="Tabs for schedules" style="default" className="my-4 ">
            <Tabs.Item active title="Scheduled for Today" icon={HiUserCircle}>
              <ScheduledForToday />
            </Tabs.Item>
            <Tabs.Item title="Scheduled on Date" icon={HiClipboardList}>
              <ScheduledForDate />
            </Tabs.Item>
            <Tabs.Item title="Colleges Overview" icon={HiAdjustments}>
              {/* Colleges */}
                              <Card>
                                <h2 className="text-xl font-semibold mb-4">Colleges</h2>
                                <div className="grid md:grid-cols-3 gap-4">
                                  <CollegeCard
                                    college="CAS"
                                    total={totalCAS}
                                    validated={totalCASValidated}
                                    checked={totalCASChecked}
                                    onClick={() => handleCollegeClick('CAS')}
                                  />
                                  <CollegeCard
                                    college="CFOS"
                                    total={totalCFOS}
                                    validated={totalCFOSValidated}
                                    checked={totalCFOSChecked}
                                    onClick={() => handleCollegeClick('CFOS')}
                                  />
                                  <CollegeCard
                                    college="SOTECH"
                                    total={totalSOTECH}
                                    validated={totalSOTECHValidated}
                                    checked={totalSOTECHChecked}
                                    onClick={() => handleCollegeClick('SOTECH')}
                                  />
                                </div>
                              </Card>
                            </Tabs.Item>
                          <Tabs.Item title="Degree Programs" icon={HiOutlineAcademicCap}>
                           <Card>
                             <h2 className="text-xl font-semibold mb-4">Degree Programs</h2>
                             <div className="grid md:grid-cols-3 gap-4">
                               {degreeCourses.map((course) => (
                                 <DegreeCard
                                   key={course}
                                   course={course}
                                   stats={degreeCourseCounts[course]}
                                   onClick={handleDegreeCourseClick}
                                 />
                               ))}
                             </div>
                           </Card>
                         </Tabs.Item>
            <Tabs.Item title="View All" icon={HiUserCircle}>
            {loading ? (
                <LoadingSkeleton />
              ) : (
              <UserInPerson />
            )}
            </Tabs.Item>


          </Tabs>
          </div>
        </div>
        {showPopup && (
          <Modal 
          show={showPopup} 
          onClose={() => setShowPopup(false)}
          size="xl"
          className="p-24 inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 rounded-xl shadow-xl"
        >
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6">
              <div className="flex items-center space-x-3">
                <Calendar className="h-8 w-8 text-white" />
                <h3 className="text-2xl font-semibold text-white">Set Schedule</h3>
              </div>
              <p className="text-blue-100 mt-2">Select your preferred date range</p>
              <p className="text-gray-200 mt-2 text-sm">Note: PH Holidays are already excluded</p>
              <Button
              onClick={handleSetUnavailableDates}
                    className="bg-red-600 mt-4 hover:bg-red-800 text-white"
                  >
                    Set Unavailable Dates
              </Button>

            </div>
    
            {/* Body */}
            <div className="p-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6  min-h-[200px] flex flex-col"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Start Date */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Start Date
                    </label>
                    <div className="relative">
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        dateFormat="MMMM d, yyyy"
                        popperPlacement="bottom-start"
                        popperModifiers={[
                          {
                            name: "offset",
                            options: {
                              offset: [0, 8]
                            }
                          }
                        ]}
                        placeholderText="Select start date"
                      />
                      <Calendar className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
    
                  {/* End Date */}
                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-700">
                      End Date
                    </label>
                    <div className="relative">
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        dateFormat="MMMM d, yyyy"
                        placeholderText="Select end date"
                      />
                      <Calendar className="absolute right-3 top-3 h-5 w-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
    
            {/* Footer */}
            <div className="bg-gray-50 px-6 py-4 flex justify-end space-x-3">
              <Button
                color="gray"
                onClick={() => setShowPopup(false)}
                className="px-4 py-2"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveDates}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                Save Schedule
              </Button>
            </div>
          </div>
        </Modal>
        )}
        {showEmailModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-4">Email Schedules</h2>
            <p className="mb-6">Would you like to email the generated schedules to all students?</p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowEmailModal(false)}
                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleEmailSchedule}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Sending...' : 'Send Emails'}
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
};
export default InPerson;