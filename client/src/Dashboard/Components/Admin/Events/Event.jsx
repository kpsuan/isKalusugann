import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import Sidebar from "../../SideBar Section/Sidebar";
import "../../Annual/annual.css";
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HiSearch, 
  HiFilter,
  HiPlus,
  HiChevronRight,
  HiHome,
  HiClock,
  HiLocationMarker,
  HiCalendar,
  HiClock as HiClockOutline
} from "react-icons/hi";

const Event = () => {
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [timeFilter, setTimeFilter] = useState('all'); // 'all', 'past', or 'upcoming'
    const [searchTerm, setSearchTerm] = useState('');
    const [viewType, setViewType] = useState('grid');
    const [showFilters, setShowFilters] = useState(false);
    const [limit, setLimit] = useState(9);
      const { currentUser } = useSelector((state) => state.user);
    

    useEffect(() => {
        fetchEvents();
    }, [limit, categoryFilter, searchTerm, timeFilter]);

    const fetchEvents = async () => {
        setLoading(true);
        try {
            let url = `/api/events/getevents?limit=${limit}&order=desc`;
            if (categoryFilter !== 'all') url += `&category=${categoryFilter}`;
            if (searchTerm) url += `&searchTerm=${searchTerm}`;

            const res = await fetch(url);
            const data = await res.json();

            const currentDate = new Date();
            let filteredEvents = data.events.map(event => ({
                ...event,
                isUpcoming: new Date(event.date) > currentDate
            }));

            // Apply time filter
            if (timeFilter === 'upcoming') {
                filteredEvents = filteredEvents.filter(event => event.isUpcoming);
            } else if (timeFilter === 'past') {
                filteredEvents = filteredEvents.filter(event => !event.isUpcoming);
            }

            setEvents(filteredEvents);
        } catch (error) {
            console.error('Failed to fetch events:', error);
        } finally {
            setLoading(false);
        }
    };

    const categories = [
        { id: 'all', label: 'All Events' },
        { id: 'general', label: 'General' },
        { id: 'scheduling', label: 'Scheduling' },
        { id: 'emergency', label: 'Emergency' }
    ];

    const timeFilters = [
        { id: 'all', label: 'All Events' },
        { id: 'upcoming', label: 'Upcoming Events' },
        { id: 'past', label: 'Past Events' }
    ];

    return (
        <div className="dashboard my-flex">
            <div className="dashboardContainer my-flex">
                <Sidebar />
                <div className="mainContent m-0 p-0">
                    {/* Header Section */}
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-red-700 to-red-900 text-white p-8"
                    >
                        <div className="max-w-7xl mx-auto">
                            <div className="flex items-center gap-2 text-red-200 mb-4">
                                <HiHome className="w-4 h-4" />
                                <HiChevronRight className="w-3 h-3" />
                                <span>Events</span>
                            </div>
                            <h1 className="text-4xl font-bold mb-4">University Events</h1>
                            <p className="text-red-100 mb-6">Discover and manage upcoming university events</p>
                        </div>
                    </motion.div>

                    {/* Main Content */}
                    <div className="max-w-7xl mx-auto px-4 py-8">
                        {/* Controls Section */}
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white rounded-xl shadow-lg p-6 mb-8"
                        >
                            <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
                                {/* Search */}
                                <div className="relative flex-1 min-w-[300px]">
                                    <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search events..."
                                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>

                                {/* Time Filter Buttons */}
                                <div className="flex gap-2">
                                    {timeFilters.map(filter => (
                                        <motion.button
                                            key={filter.id}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setTimeFilter(filter.id)}
                                            className={`px-4 py-2 rounded-lg transition-colors ${
                                                timeFilter === filter.id
                                                    ? 'bg-red-600 text-white'
                                                    : 'bg-gray-100 hover:bg-gray-200'
                                            }`}
                                        >
                                            {filter.id === 'upcoming' && <HiClockOutline className="inline-block mr-2" />}
                                            {filter.id === 'past' && <HiCalendar className="inline-block mr-2" />}
                                            {filter.label}
                                        </motion.button>
                                    ))}
                                </div>

                                {/* Filter Toggle */}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setShowFilters(!showFilters)}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                >
                                    <HiFilter className="w-5 h-5" />
                                    Filters
                                </motion.button>

                                {/* View Toggle */}
                                <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
                                    <button
                                        onClick={() => setViewType('grid')}
                                        className={`px-4 py-2 rounded-md transition-colors ${
                                            viewType === 'grid' ? 'bg-white shadow' : 'hover:bg-gray-200'
                                        }`}
                                    >
                                        Grid
                                    </button>
                                    <button
                                        onClick={() => setViewType('list')}
                                        className={`px-4 py-2 rounded-md transition-colors ${
                                            viewType === 'list' ? 'bg-white shadow' : 'hover:bg-gray-200'
                                        }`}
                                    >
                                        List
                                    </button>
                                </div>
                            </div>

                            {/* Expanded Filters */}
                            {showFilters && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    className="pt-4 border-t"
                                >
                                    <div className="flex flex-wrap gap-4">
                                        {categories.map(category => (
                                            <button
                                                key={category.id}
                                                onClick={() => setCategoryFilter(category.id)}
                                                className={`px-4 py-2 rounded-full transition-colors ${
                                                    categoryFilter === category.id
                                                        ? 'bg-red-600 text-white'
                                                        : 'bg-gray-100 hover:bg-gray-200'
                                                }`}
                                            >
                                                {category.label}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>

                        {/* Events Grid/List */}
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="animate-pulse bg-white rounded-xl p-6">
                                        <div className="h-48 bg-gray-200 rounded-lg mb-4" />
                                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                                        <div className="h-4 bg-gray-200 rounded w-1/2" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <motion.div 
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className={viewType === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}
                            >
                                {events.map(event => (
                                    <motion.div
                                        key={event._id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        whileHover={{ scale: 1.02 }}
                                        className={`bg-white rounded-xl shadow-lg overflow-hidden ${
                                            viewType === 'list' ? 'flex items-center' : ''
                                        }`}
                                    >
                                        <img
                                            src={event.image}
                                            alt={event.title}
                                            className={viewType === 'list' ? 'w-48 h-32 object-cover' : 'w-full h-48 object-cover'}
                                        />
                                        <div className="p-6">
                                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                                <HiCalendar className="w-4 h-4" />
                                                {new Date(event.date).toLocaleDateString()}
                                                <HiClock className="w-4 h-4 ml-2" />
                                                {event.timeSlot}
                                            </div>
                                            <h3 className="text-xl font-bold mb-2">{event.title}</h3>
                                            <div className="flex items-center gap-2 text-gray-600 mb-4">
                                                <HiLocationMarker className="w-4 h-4" />
                                                {event.location}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className={`px-3 py-1 rounded-full text-sm ${
                                                    event.isUpcoming
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                    {event.isUpcoming ? 'Upcoming' : 'Past'}
                                                </span>
                                                <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                                                    {event.category}
                                                </span>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </motion.div>
                        )}


                        {currentUser.isAdmin ? (
                            <>
                        {/* Create Event Button */}
                        <Link to="/create-event">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="fixed bottom-8 right-8 bg-red-600 text-white p-4 rounded-full shadow-lg flex items-center gap-2"
                            >
                                <HiPlus className="w-6 h-6" />
                                <span>Create Event</span>
                            </motion.button>
                        </Link>
                        </>
                         ) : (
                            <>
                            <div className="div"></div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Event;