import Sidebar from "../SideBar Section/Sidebar";
import FileSettings from "./components/FileSettings";
import Top from "../Profile/Components/Header";
import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import { updateUserStart, updateUserSuccess, updateUserFailure } from '../../../redux/user/userSlice';

import { Card, Timeline, Accordion, Tabs, Alert, Button, Modal, ModalBody, TextInput, Table, TableCell } from 'flowbite-react';
import { HiAdjustments, HiClipboardList, HiUserCircle } from "react-icons/hi";
import { HiArrowNarrowRight } from "react-icons/hi";
import Divider from '@mui/material/Divider';
import { Banner } from "flowbite-react";
import { HiX } from "react-icons/hi";
import { MdAnnouncement } from "react-icons/md";
import { FaCheckSquare } from "react-icons/fa";

import { MdDashboard } from "react-icons/md";
import { useDispatch } from 'react-redux';
import { BsFillFileEarmarkArrowDownFill } from "react-icons/bs";
import "./annual.css";
import { BsFiletypePng } from 'react-icons/bs';

import axios from 'axios';
import { getStorage, ref, getMetadata } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

import { Link, useNavigate } from 'react-router-dom';
import GetDocsUser from "../DocumentsUser/GetDocsUser";
import RescheduleStatus from "../Admin/AnnualPE/RescheduleStatus";

const Status = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const [userDocs, setUserDocs] = useState([]);
    const [isPreEnlistEnabled, setIsPreEnlistEnabled] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [userChoice, setUserChoice] = useState('Online'); // New state for user choice
    const [showRescheduleModal, setShowRescheduleModal] = useState(false); // New state for reschedule modal
    const preEnlistStart = new Date('2024-08-01T00:00:00+08:00');
    const preEnlistEnd = new Date('2024-08-11T23:59:59+08:00');
    const [availableDates, setAvailableDates] = useState([]);
    const [requestSubmitted, setRequestSubmitted] = useState(false);
    const [showCancelRescheduleModal, setShowCancelRescheduleModal] = useState(false); // New state for reschedule modal


    const formattedStartDate = preEnlistStart.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const formattedEndDate = preEnlistEnd.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const dateFormatter = new Intl.DateTimeFormat('en-US', {
        weekday: 'short',  // 'Mon'
        month: 'short',     // 'Aug'
        day: '2-digit',    // '23'
        year: 'numeric'    // '2024'
      });
    

    const { currentUser } = useSelector((state) => state.user);
    const userHasChoice = currentUser?.annualPE;

    const [formData, setFormData] = useState({});

    useEffect(() => {
        // Set userChoice based on currentUser reschedule status
        if (currentUser.reschedule === 'YES') {
            setUserChoice('YES');
        } else {
            setUserChoice('Online'); // Default or other logic if not rescheduled
        }
    }, [currentUser.reschedule]);

    useEffect(() => {
        const now = new Date();
        setIsPreEnlistEnabled(now >= preEnlistStart && now <= preEnlistEnd);
    }, [preEnlistStart, preEnlistEnd]);

    useEffect(() => {
        if (currentUser.reschedule === 'YES') {
            setRequestSubmitted(true);
        } else {
            setRequestSubmitted(false);
        }
    }, [currentUser.reschedule]);

    const handlePreEnlistClick = () => {
        const now = new Date();

        if (now < preEnlistStart || now > preEnlistEnd) {
            setShowModal(true); // Show modal if not within pre-enlistment period
        } else {
            navigate('/annualPE'); // Navigate if within pre-enlistment period
        }
    };

    const fetchDocs = async () => {
        try {
          const res = await fetch(`/api/docs/getdocuments`);
          const data = await res.json();
          if (res.ok) {
            const medicalDocs = data.docs.filter(doc => doc.category === 'medical');
            setUserDocs(medicalDocs);
          }
        } catch (error) {
          console.log(error.message);
        }
      };
      
      useEffect(() => {
        fetchDocs();
      }, [currentUser._id]);
      

 
    const handleDateSelection = (selectedDate) => {
      const formattedDate = new Date(selectedDate).toISOString();
      setFormData({ ...formData, schedule: selectedDate });
      console.log("Selected date:", selectedDate);
  };
      

    const updateSchedule = async (selectedDate) => {
      try {
        const res = await fetch(`/api/user/updateReschedule/${currentUser._id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ schedule: selectedDate}), // Only sending the schedule field
        });
        const data = await res.json();
        if (data.success === false) {
          dispatch(updateUserFailure(data));
          return;
        }
        dispatch(updateUserSuccess(data));
        setUpdateSuccess(true);
        set
      } catch (error) {
        dispatch(updateUserFailure(error));
      }
    };
  
      
    
    
      

    const bannerText = () => {
        if (currentUser.status === "approved") {
            return "Your documents have been verified. See attached medcert below.";
        } else if (currentUser.status === "denied") {
            return "Your documents were denied. Please submit again.";
        } else {
            if (!isPreEnlistEnabled) {
                if (currentUser.annualPE === "Online") {
                    return "You may now start submitting the forms needed for Annual PE";
                } else if (currentUser.annualPE === "InPerson") {
                    return "You can now view your schedule in the Schedule Tab below";
                }
            } else {
                return (
                    <>
                        Pre-enlistment period starts on <span className="font-medium text-blue-500">{formattedStartDate}</span> and ends on <span className="font-medium text-blue-500">{formattedEndDate}</span>
                    </>
                );
            }
        }
    };

    
    // Function to extract the file name from a URL
    
    

    const handleRescheduleRequest = async (choice) => {
        setShowRescheduleModal(false);
        if (choice === 'YES') {
            try {
                await fetch(`/api/user/update/${currentUser._id}`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ reschedule: "YES" }), // Only sending the schedule field
                  });
                await handleSubmit();
                setRequestSubmitted(true); // Update state to indicate request has been submitted
            } catch (error) {
                // Handle error if needed
            }
        }
    };
    

    const handleCancelRescheduleRequest = async (choice) => {
        setShowCancelRescheduleModal(false);
        if (choice === 'YES') {
            try {
                    await fetch(`/api/user/update/${currentUser._id}`, {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ reschedule: "" }), // Only sending the schedule field
                  });
                await handleSubmit();
                setRequestSubmitted(false); // Update state to indicate request has been submitted
            } catch (error) {
                // Handle error if needed
            }
        }
    };
    
    
    const handleSubmit = async () => {
        console.log('Submitting formData:', formData); // Debug log
        try {
            dispatch(updateUserStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            console.log('Response data:', data); // Debug log
            if (data.success === false) {
                dispatch(updateUserFailure(data));
                return;
            }
            dispatch(updateUserSuccess(data));
            setUpdateSuccess(true);
            alert('Reschedule request submitted successfully');
        } catch (error) {
            dispatch(updateUserFailure(error));
        }
    };
    
    
    

    
    return (
        <div className="dashboard my-flex">
          <div className="dashboardContainer my-flex">
            <Sidebar />
            <div className="mainContent"> 
            <Banner >
            <div className="flex w-full justify-between border-b border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-700">
                <div className="mx-auto flex items-center">
                    <p className="flex items-center text-sm font-normal text-gray-500 dark:text-gray-400">
                        <MdAnnouncement className="mr-4 h-4 w-4" />
                        <span className="[&_p]:inline">
                            {bannerText()}
                        </span>
                    </p>
                </div>
                <Banner.CollapseButton color="gray" className="border-0 bg-transparent text-gray-500 dark:text-gray-400">
                    <HiX className="h-4 w-4" />
                </Banner.CollapseButton>
            </div>
            </Banner>
            <div className="relative">
    <Card href="#" className="w-full h-150 p-10 bg-gradient-to-r from-green-600 to-green-500">
        <div className="flex justify-between">
            <div className="flex-1">
                {/* Content for Annual PE Status */}
                <h5 className="text-4xl font-light tracking-tight text-white dark:text-white">Annual PE Status</h5>
                <p className="font-normal text-white dark:text-gray-400 pt-4">
                    Here you can track the status of your Annual PE
                </p>
                {/* Other content */}
                
                <div className="relative flex space-x-2 mt-4">
                    <p className="my-auto text-lg bg-gradient-to-r from-green-500 to-green-400 text-white px-3 py-3 rounded-md">
                        PE Mode: <span className="font-semibold">{userHasChoice}</span>
                    </p>
                    <Button
                        className={`my-auto font-semibold text-white p-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105 ${
                            userHasChoice === "Online"
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-600'
                                : isPreEnlistEnabled
                                ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-600'
                                : 'bg-gray-400 cursor-not-allowed'
                        }`}
                        onClick={() => {
                            if (userHasChoice === "Online") {
                                navigate('/fileSubmissions'); // Navigate to /fileSubmissions
                            } else if (isPreEnlistEnabled) {
                                handlePreEnlistClick(); // Otherwise, handle pre-enlistment
                            }
                        }}
                    >
                        {userHasChoice === "Online" ? 'Submit Documents' : (userHasChoice ? 'Modify Choice' : 'Pre-enlist')}
                    </Button>
                </div>
            </div>

            {/* Card for in-person PE, checking if user is not online and has not arrived */}
            {currentUser.annualPE !== "Online" && currentUser.isPresent !== "ABSENT" && currentUser.status !== "approved" && (
                <Card className="flex-1 bg-gray-50 p-5 ml-4">
                    <div className="flex flex-col items-start">
                        <h5 className="text-lg font-light tracking-tight text-gray-900 dark:text-white">
                            {currentUser.firstName}, here's your schedule: 
                        </h5>
                        <p className="text-2xl text-gray-700 dark:text-gray-400 mt-2">
                            {currentUser.schedule
                                ? new Date(currentUser.schedule).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                })
                                : "TBA"
                            }
                        </p>

                        {currentUser.rescheduleLimit >= 3 ? (
                            <p className="text-sm text-red-700 dark:text-gray-400 mt-2">Can no longer reschedule. Limit has been reached</p>
                        ) : (
                            <p className="text-sm text-red-700 dark:text-gray-400 mt-2">
                                Current reschedule request: {currentUser.rescheduleLimit}
                            </p>
                        )}

                        {currentUser.isPresent === "ARRIVED" ? (
                            <Button className="bg-blue-500 text-white font-medium rounded-lg text-sm px-5 py-2.5 mt-4 cursor-not-allowed">
                                ARRIVED AT ANNUAL PE SCHEDULE
                            </Button>
                        ) : (
                            !currentUser.rescheduledDate?.length ? (
                                <Button
                                    className={`text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 mt-4 ${requestSubmitted
                                        ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-600'
                                        : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-600'} hover:shadow-lg`}
                                    onClick={() => {
                                        if (requestSubmitted) {
                                            setShowCancelRescheduleModal(true);  // If request is submitted, handle cancel
                                        } else {
                                            setShowRescheduleModal(true);  // Otherwise, show reschedule modal
                                        }
                                    }}
                                    disabled={currentUser.rescheduleLimit >= 3} // Disable if reschedule limit is reached
                                >
                                    {requestSubmitted ? 'Cancel Request' : 'Request to be Rescheduled'}
                                </Button>
                            ) : (
                                <div className="flex flex-col pt-2 w-full">
                                    <h5 className="text-lg font-medium text-green-600">Available Reschedule Dates:</h5>
                                    <div className="flex flex-row mt-2">
                                        <select
                                            className="my-2 border rounded-lg w-3/4"
                                            onChange={(e) => handleDateSelection(e.target.value)}
                                        >
                                            <option value="" className="p-2 text-lg">Select a date</option>
                                            {currentUser.rescheduledDate.length ? (
                                                currentUser.rescheduledDate.map((date, index) => (
                                                    <option key={index} value={date} className="p-2 text-lg">
                                                        {dateFormatter.format(new Date(date))}
                                                    </option>
                                                ))
                                            ) : (
                                                <option disabled>No available dates</option>
                                            )}
                                        </select>
                                        <Button
                                            className="w-1/4 h-12 text-white ml-2 mt-1 bg-blue-500 hover:bg-blue-600 font-medium rounded-lg px-5 py-1 text-sm text-center"
                                            onClick={() => updateSchedule(formData.schedule)}
                                        >
                                            Save
                                        </Button>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </Card>
            )}

            {currentUser.isPresent === "ABSENT" && (
                <Card className="flex-1 bg-gray-50 p-5 ml-4">
                    <div className="flex flex-col items-start">
                        <h5 className="text-lg font-light tracking-tight text-gray-900 dark:text-white">
                            {currentUser.firstName}, you did not arrive at your assigned date. Would you like to reschedule?
                        </h5>
                        <p className="text-2xl text-gray-700 dark:text-gray-400 mt-2">
                            {currentUser.schedule
                                ? new Date(currentUser.schedule).toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                })
                                : "TBA"
                            }
                        </p>

                        {currentUser.rescheduleLimit >= 3 ? (
                            <p className="text-sm text-red-700 dark:text-gray-400 mt-2">Can no longer reschedule. Limit has been reached</p>
                        ) : (
                            <p className="text-sm text-red-700 dark:text-gray-400 mt-2">
                                Current reschedule request: {currentUser.rescheduleLimit}
                            </p>
                        )}

                        {!currentUser.rescheduledDate?.length ? (
                            <Button
                                className={`text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 mt-4 ${requestSubmitted
                                    ? 'bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-600'
                                    : 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-600'} hover:shadow-lg`}
                                onClick={() => {
                                    if (requestSubmitted) {
                                        setShowCancelRescheduleModal(true);  // If request is submitted, handle cancel
                                    } else {
                                        setShowRescheduleModal(true);  // Otherwise, show reschedule modal
                                    }
                                }}
                                disabled={currentUser.rescheduleLimit >= 3} // Disable if reschedule limit is reached or in progress
                            >
                                {requestSubmitted ? 'Cancel Request' : 'Request to be Rescheduled'}
                            </Button>
                        ) : (
                            <div className="flex flex-col pt-2 w-full">
                                <h5 className="text-lg font-medium text-green-600">Available Reschedule Dates:</h5>
                                <div className="flex flex-row mt-2">
                                    <select
                                        className="my-2 border rounded-lg w-3/4"
                                        onChange={(e) => handleDateSelection(e.target.value)}
                                    >
                                        <option value="" className="p-2 text-lg">Select a date</option>
                                        {currentUser.rescheduledDate.length ? (
                                            currentUser.rescheduledDate.map((date, index) => (
                                                <option key={index} value={date} className="p-2 text-lg">
                                                    {dateFormatter.format(new Date(date))}
                                                </option>
                                            ))
                                        ) : (
                                            <option disabled>No available dates</option>
                                        )}
                                    </select>
                                    <Button
                                        className="w-1/4 h-12 text-white ml-2 mt-1 bg-blue-500 hover:bg-blue-600 font-medium rounded-lg px-5 py-1 text-sm text-center"
                                        onClick={() => updateSchedule(formData.schedule)}
                                    >
                                        Save
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>
            )}
        </div>
    </Card>
</div>


            {/* Reschedule Modal */}
            <Modal
                        show={showRescheduleModal}
                        size="md"
                        popup
                        onClose={() => setShowRescheduleModal(false)}
                    >
                        <Modal.Header />
                        <Modal.Body>
                            <div className="text-center">
                                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                    Do you want to reschedule?
                                </h3>
                                <div className="flex justify-center gap-4 m-5 p-1
                                ">
                                    <Button className="bg-green-500 hover:bg-green-600"
                                        color="failure"
                                        onClick={() => handleRescheduleRequest('YES')}
                                    >
                                        Yes
                                    </Button>
                                    <Button
                                        color="gray"
                                        onClick={() => handleRescheduleRequest('NO')}
                                    >
                                        No
                                    </Button>
                                </div>
                            </div>
                        </Modal.Body>
            </Modal>

            <Modal
                        show={showCancelRescheduleModal}
                        size="md"
                        popup
                        onClose={() => setShowCancelRescheduleModal(false)}
                    >
                        <Modal.Header />
                        <Modal.Body>
                            <div className="text-center">
                                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                                    Do you want to cancel reschedule?
                                </h3>
                                <div className="flex justify-center gap-4 m-5 p-1
                                ">
                                    <Button className="bg-green-500 hover:bg-green-600"
                                        color="failure"
                                        onClick={() => handleCancelRescheduleRequest('YES')}
                                    >
                                        Yes
                                    </Button>
                                    <Button
                                        color="gray"
                                        onClick={() => handleCancelRescheduleRequest('NO')}
                                    >
                                        No
                                    </Button>
                                </div>
                            </div>
                        </Modal.Body>
            </Modal>

            <div className="bg-white pr-3 w-full"> 
                <div className="flex flex-col justify-center pt-3">
                <Tabs aria-label="Tabs with underline" variant="underline" >
                  
                
                <Tabs.Item active title="Overview" icon={HiUserCircle}>
                    
                    <h1 className="pt-2 pb-4 text-2xl font-medium"> General </h1>
                    <div className="flex pb-10">
                        <div className="flex flex-col w-1/2">
                        <Card className={`flex-1 mb-4 p-5 ${currentUser.status === 'approved' ? 'bg-green-500' : 
                                        currentUser.status === 'denied' ? 'bg-red-600' : 
                                        currentUser.status === 'NO ACTION' ? 'bg-transparent text-gray-500' : 'bg-white'}`} horizontal>
                          <div className="flex items-center w-full">
                              <h5 className="text-2xl font-light tracking-tight dark:text-white">
                                  STATUS
                              </h5>
                              <p className={`font-bold text-lg pl-10 ${currentUser.status === 'NO ACTION' ? 'text-gray-500' : 'text-white'}`}>
                                  {currentUser.status === 'approved' ? 'Approved' : 
                                  currentUser.status === 'denied' ? 'Denied' : 
                                  currentUser.status === 'NO ACTION' ? 'PENDING' : 'PENDING'}
                              </p>
                          </div>
                      </Card>





                      <Card className="flex-1 p-5" horizontal>
                        <div className="flex items-center w-full">
                            <h5 className="text-2xl font-light tracking-tight text-gray-900 dark:text-white">
                                REMARKS
                            </h5>
                            <p className="font-bold pl-5 text-gray-700 dark:text-gray-400">
                                {currentUser.comment 
                                    ? currentUser.comment.replace(/<p>/g, '').replace(/<\/p>/g, '') 
                                    : "No remarks"}
                            </p>
                        </div>
                    </Card>

                        </div>
                        <Card className="w-1/2 ml-5 p-5">
                        <h5 className="text-2xl font-medium tracking-tight text-gray-900 dark:text-white">
                            Medical Certificate
                        </h5>
                        {currentUser.medcert ? (
                            <div className="flex flex-col items-center mb-2">
                                <Link target="_blank" rel="noopener noreferrer" to={currentUser.medcert}>
                                    <img
                                        src={currentUser.medcert}
                                        alt="Medical Certificate"
                                        className="object-contain w-full h-auto max-h-64" // Adjust max height as needed
                                    />
                                </Link>
                                <h3 className="text-sm font-semibold mb-2">{currentUser.lastName}_medcert.png</h3>
                                <Link 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    to={currentUser.medcert} 
                                    className="block w-full mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm text-center"
                                >
                                    View
                                </Link>
                            </div>
                        ) : (
                            <p className="text-1xl pt-5 flex font-light">
                                [Nothing to display]
                            </p>
                        )}
                    </Card>

                    </div>
                
                <div className="flex justify-between w-full">
                
                    <h1 className="pt-5 pb-4 text-2xl font-medium"> Downloadable Forms</h1>
                    <Button className="my-2 transition duration-300 ease-in-out transform hover:scale-105 text-lg  text-blue-500 px-3 py-3 rounded-md">
                                View All   
                    </Button>
                </div>
                <div className="flex flex-wrap">
                {userDocs.map((doc) => (
                    <div key={doc._id} className="flex flex-col w-full md:w-1/2 lg:w-1/3 p-2">
                    <Card href={doc.content} className="flex-1 p-5 bg-gray-50 mb-4 transition duration-300 ease-in-out transform hover:shadow-lg" horizontal>
                        <div className="flex">
                        <div className="flex items-center w-full">
                            <h5 className="text-2xl font-light tracking-tight text-gray-900 dark:text-white">
                            <BsFillFileEarmarkArrowDownFill />
                            </h5>
                            <div className="flex flex-col pl-4">
                            <p className="font-semibold text-gray-500 dark:text-gray-400">
                                {doc.title}
                            </p>
                            <p className="font-normal text-sm text-gray-400 dark:text-gray-400">
                                {doc.size} | {new Date(doc.updatedAt).toLocaleDateString()} {new Date(doc.updatedAt).toLocaleTimeString()}
                            </p>
                            </div>
                        </div>
                        <FileSettings />
                        </div>
                    </Card>
                    </div>
                ))}
                </div>


                </Tabs.Item>
                {userHasChoice !== 'Online' && (
                    <Tabs.Item active title="Schedule" icon={HiUserCircle}>
                    <div className="flex pb-3">
                        <div className="flex flex-col w-1/2">
                            <Card className="flex-1 bg-gray-50 mb-4 p-5" horizontal>
                                <div className="flex items-center w-full">
                                    <h5 className="text-2xl font-light tracking-tight text-gray-900 dark:text-white">
                                    Schedule
                                    </h5>
                                    <p className="text-2xl pl-10 text-gray-700 dark:text-gray-400">
                                    {currentUser.schedule
                                                ? new Date(currentUser.schedule).toLocaleDateString('en-US', {
                                                    weekday: 'short',  // "Wed"
                                                    year: 'numeric',  // "2024"
                                                    month: 'short',   // "Jun"
                                                    day: 'numeric'    // "19"
                                                })
                                                : "TBA"
                                            }
                                    </p>
                                </div>
                            </Card>
                        </div>
                        
                        
                    </div>
                    <h1 className="pt-4 pl-2 pb-2 text-2xl font-medium">General Reminders</h1>
                        <Accordion className="mt-4 mb-4">
                            <Accordion.Panel>
                            <Accordion.Title className="text-lg font-medium">
                            <span className="flex items-center">
                                <FaCheckSquare className="text-green-500 mr-2 text-3xl" />
                                Requirements
                            </span>
                            </Accordion.Title>
                                <Accordion.Content>
                                <p className="mb-2 text-gray-500 dark:text-gray-400">
                                Please bring with you the following:
                                </p>
                                <p className="text-gray-500 dark:text-gray-400 p-2 text-lg">
                                    1. Completely Filled-Out &nbsp;
                                    <a
                                    href="https://crs.upv.edu.ph/views/HSU-PERIODIC%20HEALTH%20EXAMINATION%20FORM.pdf"
                                    className="text-cyan-600 hover:underline dark:text-cyan-500"
                                    >
                                    Periodic Health Examination Form [UPPERCLASS]&nbsp;
                                    </a>  OR  <a
                                    href="https://crs.upv.edu.ph/views/HSU-Entrance%20Health%20Examination%20Form.pdf"
                                    className="text-cyan-600 hover:underline dark:text-cyan-500"
                                    >
                                    Periodic Health Examination Form [FRESHMAN]&nbsp;
                                    </a><br/>
                                    2. <a
                                    href="https://crs.upv.edu.ph/views/HSU-PERIODIC%20HEALTH%20EXAMINATION%20FORM.pdf"
                                    className="text-cyan-600 hover:underline dark:text-cyan-500"
                                    >
                                    Dental Health Record &nbsp;
                                    </a> <br/>
                                    3. University ID / Form 5 <br/>
                                    4. White Folder <br/>
                                    5. Request for P.E.
                                    
                                </p>
                                </Accordion.Content>
                            </Accordion.Panel>
                            <Accordion.Panel>
                                <Accordion.Title className="text-lg font-medium active">
                                <span className="flex items-center">
                                    <FaCheckSquare className="text-green-500 mr-2 text-3xl" />
                                    Procedures
                                </span>
                                </Accordion.Title>
                                <Accordion.Content>
                                <p className="mb-2 text-gray-500 dark:text-gray-400">
                                    
                                </p>
                                <p className="text-gray-500 dark:text-gray-400">
                                    
                                </p>
                                </Accordion.Content>
                            </Accordion.Panel>
                            
                        </Accordion>
                    </Tabs.Item>   
                )}
                <Tabs.Item title="Submitted Forms" icon={MdDashboard}>
                <h1 className="pt-1 pb-4 text-2xl font-medium"> Forms</h1>
                <div className="flex flex-col">
                    <GetDocsUser />
                </div>


                </Tabs.Item>
                <Tabs.Item title="Reminders" icon={MdDashboard}>
                    <h1 className="pt-4 pb-2 text-2xl font-medium">General Reminders</h1>
                    <Accordion className="mt-4 mb-4">
                        <Accordion.Panel>
                            <Accordion.Title className="text-lg font-medium">What is Flowbite?</Accordion.Title>
                            <Accordion.Content>
                            <p className="mb-2 text-gray-500 dark:text-gray-400">
                                Flowbite is an open-source library of interactive components built on top of Tailwind CSS including buttons,
                                dropdowns, modals, navbars, and more.
                            </p>
                            <p className="text-gray-500 dark:text-gray-400">
                                Check out this guide to learn how to&nbsp;
                                <a
                                href="https://flowbite.com/docs/getting-started/introduction/"
                                className="text-cyan-600 hover:underline dark:text-cyan-500"
                                >
                                get started&nbsp;
                                </a>
                                and start developing websites even faster with components on top of Tailwind CSS.
                            </p>
                            </Accordion.Content>
                        </Accordion.Panel>
                        <Accordion.Panel>
                            <Accordion.Title className="text-lg font-medium">Is there a Figma file available?</Accordion.Title>
                            <Accordion.Content>
                            <p className="mb-2 text-gray-500 dark:text-gray-400">
                                Flowbite is first conceptualized and designed using the Figma software so everything you see in the library
                                has a design equivalent in our Figma file.
                            </p>
                            <p className="text-gray-500 dark:text-gray-400">
                                Check out the
                                <a href="https://flowbite.com/figma/" className="text-cyan-600 hover:underline dark:text-cyan-500">
                                Figma design system
                                </a>
                                based on the utility classes from Tailwind CSS and components from Flowbite.
                            </p>
                            </Accordion.Content>
                        </Accordion.Panel>
                        <Accordion.Panel>
                            <Accordion.Title className="text-lg font-medium">What are the differences between Flowbite and Tailwind UI?</Accordion.Title>
                            <Accordion.Content>
                            <p className="mb-2 text-gray-500 dark:text-gray-400">
                                The main difference is that the core components from Flowbite are open source under the MIT license, whereas
                                Tailwind UI is a paid product. Another difference is that Flowbite relies on smaller and standalone
                                components, whereas Tailwind UI offers sections of pages.
                            </p>
                            <p className="mb-2 text-gray-500 dark:text-gray-400">
                                However, we actually recommend using both Flowbite, Flowbite Pro, and even Tailwind UI as there is no
                                technical reason stopping you from using the best of two worlds.
                            </p>
                            <p className="mb-2 text-gray-500 dark:text-gray-400">Learn more about these technologies:</p>
                            <ul className="list-disc pl-5 text-gray-500 dark:text-gray-400">
                                <li>
                                <a href="https://flowbite.com/pro/" className="text-cyan-600 hover:underline dark:text-cyan-500">
                                    Flowbite Pro
                                </a>
                                </li>
                                <li>
                                <a
                                    href="https://tailwindui.com/"
                                    rel="nofollow"
                                    className="text-cyan-600 hover:underline dark:text-cyan-500"
                                >
                                    Tailwind UI
                                </a>
                                </li>
                            </ul>
                            </Accordion.Content>
                        </Accordion.Panel>
                    </Accordion>
                </Tabs.Item>
                </Tabs>
                
                </div>
                
            </div>
          </div>
      </div>
      {/* Modal for error */}
      <Modal show={showModal} onClose={() => setShowModal(false)}>
        <Modal.Header>Pre-enlistment Error</Modal.Header>
        <Modal.Body>
          <p className="text-gray-700">
            Cannot pre-enlist, pre-enlistment period has elapsed.
          </p>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Status;