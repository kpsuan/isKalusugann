import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, Clock, ChevronRight } from 'lucide-react';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`/api/events/getevents?limit=10&order=asc`);
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data.events);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) {
      return { date: 'TBA', time: 'TBA' };
    }
  
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
  
    return {
      date: date.toLocaleDateString(undefined, options),
      time: date.toLocaleTimeString(undefined, timeOptions),
    };
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        delayChildren: 0.3,
        staggerChildren: 0.2 
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    },
    hover: { 
      scale: 1.02,
      transition: { duration: 0.3 }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-blue-700">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ 
            repeat: Infinity, 
            duration: 1, 
            ease: "linear" 
          }}
          className="w-16 h-16 border-4 border-t-white border-white/30 rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center text-red-500 bg-blue-700 h-screen flex items-center justify-center text-2xl"
      >
        Error: {error}
      </motion.div>
    );
  }

  return (
    <motion.section 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className=" bg-gradient-to-b from-black to-teal-700 text-white min-h-screen py-16"
    >
      <div className="max-w-4xl mx-auto px-4">
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-5xl font-bold mb-4 text-white">
            Upcoming Events
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Discover exciting events happening in our community
          </p>
        </motion.div>

        <AnimatePresence>
          {events.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-blue-200 text-xl"
            >
              No upcoming events at the moment
            </motion.div>
          ) : (
            <motion.div className="space-y-6">
              {events.map((event, index) => {
                const { date, time } = formatDateTime(event.date);
                return (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    whileHover="hover"
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-6 flex items-center justify-between transition-all duration-300 hover:bg-white/20"
                  >
                    <div className="flex-grow">
                      <div className="flex items-center mb-2">
                        <Calendar className="mr-2 text-blue-300" size={20} />
                        <span className="font-semibold text-lg">{date}</span>
                      </div>
                      <div className="flex items-center mb-2">
                        <Clock className="mr-2 text-blue-300" size={20} />
                        <span>{time}</span>
                      </div>
                      <h3 className="text-2xl font-bold text-white mt-2">
                        {event.title}
                      </h3>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="ml-4 bg-teal-500 text-white rounded-full p-3 hover:bg-blue-600 transition-colors"
                    >
                      <ChevronRight />
                    </motion.button>
                  </motion.div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
};

export default Events;