import React from "react";
import Sidebar from "../SideBar Section/Sidebar";
import "./annual.css";
import { toast, ToastContainer } from 'react-toastify';
import { useInView } from "react-intersection-observer";
import { Card, Timeline, Accordion, Tabs, Alert, Button, Modal, ModalBody, TextInput, Table, TableCell } from 'flowbite-react';
import { motion } from "framer-motion";
import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { updateUserStart, updateUserSuccess, updateUserFailure } from '../../../redux/user/userSlice';
import AvailableDate2 from "../Admin/AnnualPE/AvailableDates2";
import AvailableDates2 from "../Admin/AnnualPE/AvailableDates2";

const AvailableSchedules = () => {
    const { userId } = useParams();
    const [loading, setLoading] = useState(true);

     const [mode, setMode] = useState(""); // State to track user's choice
     const navigate = useNavigate();
     const dispatch = useDispatch();
     const [formData, setFormData] = useState({});
     const [updateSuccess, setUpdateSuccess] = useState(false);
     const { currentUser } = useSelector((state) => state.user);
     const [startDate, setStartDate] = useState('');
     const [endDate, setEndDate] = useState('');
     const [selectedDate, setSelectedDate] = useState(null);

    
    const [availableDates, setAvailableDates] = useState([]);
    const [remainingSlots, setRemainingSlots] = useState([]);
    
    
    const { ref, inView } = useInView({
        threshold: 0.2, // Trigger animation when 20% of the element is visible
        triggerOnce: true, // Animate only once when it comes into view
    });

     // Fetch startDate and endDate from API
    useEffect(() => {
        const fetchDates = async () => {
          try {
            const res = await fetch('/api/settings/getDates', {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include token if needed
              },
            });
    
            const data = await res.json();
            if (res.ok) {
              setStartDate(data.startDate);
              setEndDate(data.endDate);
            } else {
              console.error('Error fetching dates:', data.message);
            }
          } catch (error) {
            console.error('Error fetching dates:', error.message);
          }
        };
    
        fetchDates();
      }, []);

      useEffect(() => {
        const fetchAvailableDates = async () => {
          if (!userId) {
            console.error("Missing userId in route parameters.");
            return;
          }
      
          try {
            setLoading(true);
            const res = await fetch(`/api/user/reschedule/${userId}`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ startDate, endDate }),
            });
            const scheduleData = await res.json();
            if (res.ok) {
              setAvailableDates(scheduleData.rescheduledDates || []);
              setRemainingSlots(scheduleData.remainingSlots || []);
            } else {
              console.error("Error fetching available dates:", scheduleData.message);
            }
          } catch (error) {
            console.error("Error fetching available dates:", error.message);
          } finally {
            setLoading(false);
          }
        };
      
        if (startDate && endDate) {
          fetchAvailableDates();
        }
      }, [startDate, endDate, userId]);
      
      const handleDateSelection = (date) => {
        setSelectedDate(date);
      };
      const handleSubmit = async (e) => {
        e.preventDefault();
      
        if (!selectedDate) {
          alert("Please select a date before submitting.");
          return;
        }
      
        try {
          dispatch(updateUserStart());
      
          // Release the previously reserved slots
          const releaseRes = await fetch(`/api/user/releaseSlot/${userId}`, {
            method: "DELETE",
          });
      
          if (!releaseRes.ok) {
            const errorData = await releaseRes.json();
            console.error("Error releasing slots:", errorData.message);
            alert("Failed to release reserved slots.");
            return;
          }
      
          // Update the user's schedule with the selected date
          const updateRes = await fetch(`/api/user/update/${userId}`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              schedule: selectedDate,
              rescheduleDates: [], // Clear rescheduled dates
            }),
          });
      
          const data = await updateRes.json();
          if (!updateRes.ok) {
            dispatch(updateUserFailure(data));
            toast("Failed to update user schedule.");
            return;
          }
      
          dispatch(updateUserSuccess(data));
          toast("Schedule saved successfully!");
          navigate('/status'); // Navigate back to the previous page
        } catch (error) {
          console.error("Error saving schedule:", error.message);
          dispatch(updateUserFailure(error));
        }
      };
      
      

      return (
        <div className="dashboard my-flex">
            <div className="dashboardContainer my-flex">
                <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover /> 
                <Sidebar />
                <div className="mainContent"> 
                    <Card href="#" className="w-full h-full p-10 justify-center items-center bg-gradient-to-r from-green-600 to-green-500">
                        <span className="text-white text-3xl">Hello, <span className=" text-white font-semibold">{currentUser.firstName}</span></span>
                        <p className="text-lg text-white ">Here are available dates you can pick for your Annual Pe Schedule. </p>
                        {loading ? (
                        <div className="flex justify-center items-center py-8">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
                        </div>
                        ) : (
                        <><AvailableDates2
                                      availableDates={availableDates}
                                      remainingSlots={remainingSlots}
                                      selectedDate={selectedDate} // Pass the selected date
                                      onDateSelect={handleDateSelection} // Pass the selection handler
                                  /><motion.button
                                      onClick={handleSubmit}
                                      disabled={!selectedDate}
                                      whileHover={{ scale: 1.05 }}
                                      whileTap={{ scale: 0.95 }}
                                      className={`w-full py-3 bg-blue-500 rounded-lg transition-all duration-300 ${selectedDate
                                              ? 'bg-bue-500 text-white hover:bg-blue-700'
                                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                                  >
                                          {selectedDate ? `Save Schedule ` : 'Select a Date'}
                                      </motion.button></>
                        )}
                    </Card>
                 </div>
            </div>
        </div>
    );
};

export default AvailableSchedules;
