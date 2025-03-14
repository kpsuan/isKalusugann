import React, { useState, useEffect } from 'react';
import '../Body Section/body.css';
import Top from './Top Section/Top';
import Features from './Features Section/Features';
import Activity from './Activity Section/Activity';
import Stats from './Activity Section/Stats';
import { Badge, Card, Button } from "flowbite-react";
import { HiCheck, HiClock, HiUser, HiArrowRight } from "react-icons/hi";
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ScheduledForToday from '../Admin/AnnualPE/ScheduledToday';
import Reschedule from '../Admin/AnnualPE/Reschedule';
import RescheduleRequest from '../Admin/AnnualPE/RescheduleRequest';
import ScheduledForToday2 from '../Admin/AnnualPE/ScheduledToday2';
import { Baby } from 'lucide-react';
import EventsSection from './EventsBody';
import { motion, AnimatePresence } from 'framer-motion';
import { updateUserStart, updateUserSuccess, updateUserFailure } from "../../../redux/user/userSlice";


const Body = () => {
  const [events, setEvents] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [filter, setFilter] = useState("");
  const [eventType, setEventType] = useState("upcoming");
  const [currentPage, setCurrentPage] = useState(0);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [isVisible, setIsVisible] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({});

  const itemsPerPage = 4;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        let url = `/api/events/getevents?order=desc`;
        if (categoryFilter && categoryFilter.value) url += `&category=${categoryFilter.value}`;
        if (filter) url += `&searchTerm=${filter}`;

        const res = await fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const data = await res.json();
        const updatedEvents = data.events.map(event => {
          const eventDate = new Date(event.date);
          return { ...event, isUpcoming: eventDate > new Date() };
        });

        setEvents(updatedEvents);
      } catch (error) {
        console.error('Failed to fetch:', error.message);
      }
    };

    fetchEvents();
  }, [categoryFilter, filter]);

  const filterEvents = (type) => {
    setEventType(type);
    setCurrentPage(0); // Reset to first page when changing type
  };

  const filteredEvents = eventType === "upcoming"
    ? events.filter(event => event.isUpcoming)
    : events.filter(event => !event.isUpcoming);

  const paginatedEvents = filteredEvents.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  useEffect(() => {
    if (currentUser?.isNewUser) {
      console.log("User is new! Show onboarding.");
      setShowOnboarding(true);
    }
  }, [currentUser]);



  const completeOnboarding = async () => {
    try {
      dispatch(updateUserStart());
      
      console.log("Sending request to API...");
      const res = await fetch(`/api/user/updateOnboarding/${currentUser._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const data = await res.json();
      console.log("API Response:", data);
  
      if (!res.ok || data.success === false) {
        dispatch(updateUserFailure(data));
        return;
      }
  
      dispatch(updateUserSuccess({ ...currentUser, isNewUser: false }));
  
      console.log("After update:", { ...currentUser, isNewUser: false });
  
      setShowOnboarding(false);
      navigate("/dashboard");
    } catch (error) {
      console.error("Error:", error);
      dispatch(updateUserFailure(error));
    }
  };
  


  const goToProfile = () => {
    setShowOnboarding(false);
    navigate("/profile");
  };
  
  return (
    <motion.div 
      className='mainContent'
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
    <div className='mainContent p-0 m-0'>
      
      <Top/>

      <div className="bottom flex flex-col">
        <div className="flex flex-row w-full">
          <div className="w-full"><Features /></div>
        </div>
        <div className="flex flex-row w-full">
          
          {currentUser?.isAdmin === true && (
            <div className="w-full"><Stats /></div>
          )}
        </div>

        {currentUser && currentUser.isAdmin && (
          <div className="w-full mb-1 flex">
            <div className="w-8/10 pr-4">
              <div className="text-2xl font-bold mb-7">
                Scheduled Today
              </div>
              <ScheduledForToday2 />
            </div>
          </div>
        )}

        <div className="w-full mb-2">
        <EventsSection 
            events={events}
            eventType={eventType}
            filterEvents={filterEvents}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            filteredEvents={filteredEvents}
          />
        </div>

        <div className="w-full mb-2">
          <div className="text-2xl font-bold mb-7">Announcements</div>
          <Activity />
        </div>
      </div>
      <AnimatePresence>
        {showOnboarding && (
          <motion.div 
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9999]" 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
        >
            <motion.div 
              className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden" 
              initial={{ y: 50, opacity: 0 }} 
              animate={{ y: 0, opacity: 1 }} 
              exit={{ y: 50, opacity: 0 }}
            >
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
                <h2 className="text-2xl font-bold">Welcome to Our Platform!</h2>
                <p className="mt-2 opacity-90">We're excited to have you join us</p>
              </div>
              <h3 className="font-semibold text-lg p-4">Next Steps: </h3>
              <div className="p-6 pt-0">
                <div className="flex items-center mb-4 text-gray-700">
                  <div className="bg-blue-100 p-3 rounded-full mr-4">
                    <HiUser className="text-blue-600 text-xl" />
                  </div>
                  
                  <div>
                    <h3 className="font-semibold text-lg">Complete Your Profile</h3>
                    <p className="text-gray-600 text-sm">Update your personal information to get started</p>
                  </div>
                </div>
                
                <div className="border-l-2 border-blue-200 pl-4 ml-6 mb-6">
                  <p className="text-gray-600">Navigate to My Profile and edit your info.</p>
                </div>
                
                <div className="flex space-x-3 mt-6">
                  <button 
                    onClick={completeOnboarding}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition duration-200"
                    disabled={loading}
                  >
                    {loading ? "Processing..." : "Complete Onboarding"}
                  </button>
                 
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </motion.div>
  );
};

export default Body;