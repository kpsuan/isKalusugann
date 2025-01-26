import React, { useState, useEffect } from 'react';
import '../Body Section/body.css';
import Top from './Top Section/Top';
import Features from './Features Section/Features';
import Activity from './Activity Section/Activity';
import Stats from './Activity Section/Stats';
import { Badge, Card, Button } from "flowbite-react";
import { HiCheck, HiClock } from "react-icons/hi";
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ScheduledForToday from '../Admin/AnnualPE/ScheduledToday';
import Reschedule from '../Admin/AnnualPE/Reschedule';
import RescheduleRequest from '../Admin/AnnualPE/RescheduleRequest';
import ScheduledForToday2 from '../Admin/AnnualPE/ScheduledToday2';
import { Baby } from 'lucide-react';
import EventsSection from './EventsBody';
import { motion, AnimatePresence } from 'framer-motion';


const Body = () => {
  const [events, setEvents] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [filter, setFilter] = useState("");
  const [eventType, setEventType] = useState("upcoming");
  const [currentPage, setCurrentPage] = useState(0);
  const { currentUser } = useSelector((state) => state.user);
  const [isVisible, setIsVisible] = useState(false);

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
   
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    
  };


  
  return (
    <motion.div 
      className='mainContent'
      initial="hidden"
      animate
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
    </div>
    </motion.div>
  );
};

export default Body;
