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


const Body = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [filter, setFilter] = useState("");
  const [showMore, setShowMore] = useState(true);
  const [limit, setLimit] = useState(9);
  const [eventType, setEventType] = useState("upcoming");
  const { currentUser } = useSelector((state) => state.user);

 

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        let url = `/api/events/getevents?limit=${limit}&order=desc`;
        if (categoryFilter && categoryFilter.value) url += `&category=${categoryFilter.value}`;
        if (filter) url += `&searchTerm=${filter}`;

        const res = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const data = await res.json();

        if (data.events.length < limit) setShowMore(false);

        const updatedEvents = data.events.map(event => {
          const eventDate = new Date(event.date);
          return {
            ...event,
            isUpcoming: eventDate > new Date(),
          };
        });

        setEvents(updatedEvents);
      } catch (error) {
        console.error('Failed to fetch:', error.message);
      }
    };

    fetchEvents();
  }, [limit, categoryFilter, filter]);

  const filterEvents = (type) => {
    setEventType(type);
  };

  const filteredEvents = eventType === "upcoming" 
    ? events.filter(event => event.isUpcoming)
    : events.filter(event => !event.isUpcoming);

  return (
    <div className='mainContent'>
      <Top />

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
          <div className="text-2xl font-bold mb-7">
            Events
            <div className="flex flex-wrap gap-2 mt-3">
              <Badge
                className={`p-3 text-sm ${eventType === 'upcoming' ? 'bg-blue-100 text-blue-500' : 'bg-gray-100 text-gray-500'} hover:bg-blue-200 focus:ring-blue-400 dark:bg-blue-200 dark:text-blue-600 dark:hover:bg-blue-300`}
                icon={HiCheck}
                onClick={() => filterEvents("upcoming")}
              >
                Upcoming ({events.filter(event => event.isUpcoming).length})
              </Badge>
              <Badge
                className={`p-3 text-sm ${eventType === 'past' ? 'bg-blue-100 text-blue-500' : 'bg-gray-100 text-gray-500'} hover:bg-blue-200 focus:ring-blue-400 dark:bg-blue-200 dark:text-blue-600 dark:hover:bg-blue-300`}
                icon={HiClock}
                onClick={() => filterEvents("past")}
              >
                Past ({events.filter(event => !event.isUpcoming).length})
              </Badge>
            </div>
            <div className="grid grid-cols-4 gap-4 mt-5 mr-3">
              {filteredEvents.map((event, index) => (
                <Card key={index} className="h-80 w-full flex flex-col justify-between max-w-sm shadow-gray-300 hover:border hover:border-gray-300 transition duration-200">
                  <img className="w-full h-40 object-cover" src={event.image || "https://via.placeholder.com/150"} alt={`${event.title} image`} />
                  <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white pl-3 pt-3">
                    {event.title}
                  </h5>
                  <p className="font-semibold text-lg text-yellow-600 dark:text-gray-400 pl-3 m-0 leading-tight">
                    {new Date(event.date).toLocaleString()}
                  </p>
                  <p className="font-light text-sm text-gray-700 dark:text-gray-400 pl-3 mt-1 mb-5">
                    {event.location}
                  </p>
                </Card>
              ))}
            </div>

            {showMore && (
              <Button
                className='text-2xl bg-blue-500 p-2 mt-4'
                onClick={() => setLimit(limit + 9)}
              >
                Load More
              </Button>
            )}
          </div>
        </div>

        <div className="w-full mb-2">
          <div className="text-2xl font-bold mb-7">Announcements</div>
          <Activity />
        </div>
      </div>
    </div>
  );
};

export default Body;
