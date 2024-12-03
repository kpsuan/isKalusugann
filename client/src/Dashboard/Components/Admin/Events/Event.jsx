import React, { useState, useEffect } from 'react';
import Sidebar from "../../SideBar Section/Sidebar";
import Top from "../../Profile/Components/Header";
import AllEvents from './AllEvents.jsx' 
import "../../Annual/annual.css";
import { useSelector } from 'react-redux';
import { Card, Button, Badge} from 'flowbite-react';
import { Link } from 'react-router-dom';
import { HiCheck, HiClock } from "react-icons/hi";

import { HiUserCircle } from "react-icons/hi";
import { Tabs } from "flowbite-react";
import { HiHome } from "react-icons/hi";
import Breadcrumb from "../../../Breadcrumb.jsx";

const Event = () => {
    const { currentUser } = useSelector((state) => state.user);
    const [events, setEvents] = useState([]);
    const [categoryFilter, setCategoryFilter] = useState(null);
    const [filter, setFilter] = useState("");
    const [showMore, setShowMore] = useState(true);
    const [limit, setLimit] = useState(9);
    const [eventType, setEventType] = useState("upcoming"); // state to track event type (upcoming or past)
  
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
        <div className="dashboard my-flex">
        <div className="dashboardContainer my-flex">
            <Sidebar />
            <div className="mainContent p-0 m-0">
                <Card href="#" className="w-full h-1/4 p-10 bg-gradient-to-r from-red-700 to-red-900">
                    <div className="text-4xl font-light tracking-tight text-white dark:text-white">Event Calendar</div>     
                    <Breadcrumb/>

                </Card>
                <div className="bg-white rounded-lg border border-gray-200 p-10 w-full">
                    <div className="grid grid-cols-3 gap-2">
                        <div className="flex flex-col col-span-2 w-full mt-3">
                            <p className="text-3xl font-semibold text-red-600">Upcoming Events: This Month</p>
                            <Tabs aria-label="Default tabs" style="default" className="my-4 justify-right">
                                <Tabs.Item active title="University Calendar" icon={HiUserCircle}>
                                    <AllEvents/>
                                </Tabs.Item>
                                
                            </Tabs>
                        </div>
                        <div className="flex flex-col col-span-1 w-full self-start mt-3">
                        
                                   
                            <Card
                                className=" ml-5 max-w-sm p-5"
                                imgAlt="Meaningful alt text for an image that is not purely decorative"
                                imgSrc="https://scontent.fceb2-1.fna.fbcdn.net/v/t39.30808-6/261747250_446919153596661_2018333125776636450_n.jpg?_nc_cat=106&ccb=1-7&_nc_sid=cc71e4&_nc_ohc=nlCBkf6B_i4Q7kNvgHaQ2hO&_nc_zt=23&_nc_ht=scontent.fceb2-1.fna&_nc_gid=APtdFVej28ngLmOQl0hHx2k&oh=00_AYBWdvt5WS4Hh8yIm0gWg9nknm1z1H66dCwi07vlCI79oQ&oe=67432851"
                                >
                                <h5 className="text-lg text-center mt-5 font-bold tracking-tight text-gray-900 dark:text-white">
                                   Add or create an event
                                </h5>
                                
                                <Link to="/create-event">
                                    <Button
                                        type="button"
                                        className="w-full text-lg bg-gradient-to-r from-green-500 to-green-600 text-white px-10 py-4 rounded-md"
                                    >
                                        Create an Event
                                    </Button>
                                </Link>
                                </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    
    );
}

export default Event;
