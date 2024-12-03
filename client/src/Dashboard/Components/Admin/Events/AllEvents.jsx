import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Badge, Card } from 'flowbite-react';
import parse from 'html-react-parser';
import Select from 'react-select';
import { HiCheck, HiClock, HiCalendar } from "react-icons/hi";

const AllEvents = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [limit, setLimit] = useState(9);
  const [selectedImage, setSelectedImage] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [filter, setFilter] = useState("");
  const [eventType, setEventType] = useState("upcoming"); // Track event type
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        let url = `/api/events/getevents?limit=${limit}&order=desc`;
        if (categoryFilter && categoryFilter.value) url += `&category=${categoryFilter.value}`;
        if (filter) url += `&searchTerm=${filter}`;

        const res = await fetch(url, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);

        const data = await res.json();
        if (data.events.length < limit) setShowMore(false);

        const updatedEvents = data.events.map(event => {
          const eventDate = new Date(event.date);
          return {
            ...event,
            isUpcoming: eventDate > new Date(),
            isNextMonth: eventDate.getMonth() === new Date().getMonth() + 1,
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
    : eventType === "past"
    ? events.filter(event => !event.isUpcoming)
    : eventType === "nextMonth"
    ? events.filter(event => event.isNextMonth)
    : events;

  const handleLoadMore = () => {
    setLimit((prevLimit) => prevLimit + 9);
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const handleCategoryFilterChange = (selectedOption) => {
    setCategoryFilter(selectedOption);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const categoryOptions = [
    { value: "", label: "All" },
    { value: "general", label: "General" },
    { value: "scheduling", label: "Scheduling Concerns" },
    { value: "emergency", label: "Emergency" },
  ];

  const getBadge = (category) => {
    const baseClasses = "text-sm font-medium py-1.5"; 
    switch (category.toLowerCase()) {
      case 'scheduling':
        return <Badge color="info" className={baseClasses}>Scheduling</Badge>;
      case 'general':
        return <Badge color="success" className={baseClasses}>General</Badge>;
      case 'emergency':
        return <Badge color="failure" className={baseClasses}>Emergency</Badge>;
      default:
        return <Badge color="gray" className={baseClasses}>Unknown</Badge>;
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-2 mb-2">
        <Badge
          className={`p-3 text-sm ${eventType === 'upcoming' ? 'bg-blue-100 text-blue-500' : 'bg-gray-100 text-gray-500'} hover:bg-blue-200 focus:ring-blue-400`}
          icon={HiCheck}
          onClick={() => filterEvents("upcoming")}
        >
          Upcoming ({events.filter(event => event.isUpcoming).length})
        </Badge>
        <Badge
          className={`p-3 text-sm ${eventType === 'past' ? 'bg-blue-100 text-blue-500' : 'bg-gray-100 text-gray-500'} hover:bg-blue-200 focus:ring-blue-400`}
          icon={HiClock}
          onClick={() => filterEvents("past")}
        >
          Past ({events.filter(event => !event.isUpcoming).length})
        </Badge>
        <Badge
          className={`p-3 text-sm ${eventType === 'nextMonth' ? 'bg-blue-100 text-blue-500' : 'bg-gray-100 text-gray-500'} hover:bg-blue-200 focus:ring-blue-400`}
          icon={HiCalendar}
          onClick={() => filterEvents("nextMonth")}
        >
          Next Month ({events.filter(event => event.isNextMonth).length})
        </Badge>
      </div>

      <div className="flex justify-start mb-4">
        <input
          type="text"
          placeholder="Search..."
          value={filter}
          onChange={handleFilterChange}
          className="w-80 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
        />
        <div className="flex items-center ml-4 w-40">
          <Select
            id="category"
            value={categoryFilter}
            onChange={handleCategoryFilterChange}
            options={categoryOptions}
            placeholder={categoryFilter ? categoryFilter.label : "Category"}
            className="w-full"
          />
        </div>
      </div>

      {filteredEvents.length === 0 ? (
        <p className="text-center text-2xl mx-auto p-10 font-light">Nothing Found</p>
      ) : (
        filteredEvents.map((event, index) => (
          <div key={index} className="flex flex-col md:flex-row border border-gray-300 mb-5 rounded-lg shadow bg-gray-50">
            <div className="relative w-full md:w-1/3 overflow-hidden">
              <img 
                src={event.image || "https://via.placeholder.com/150"} 
                alt={event.title} 
                className="w-full object-cover h-full rounded-l-lg transition-transform duration-300 ease-in-out cursor-pointer hover:scale-125"
                onClick={() => handleImageClick(event.image)}
              />
            </div>
            <div className="w-full md:w-2/3 p-4">
              <Link to={`/post/${event.slug}`} target="_blank" rel="noopener noreferrer">
                <Card className="max-w-full p-5">
                  <div className="text-center w-24">
                    {getBadge(event.category)}
                  </div>
                  <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {event.title}
                  </h5>
                  <span className="text-sm text-gray-500">Location: {event.location}</span>
                  <div className="flex-1">
                    <span className="text-sm text-gray-500 mb-2 mr-2">
                      Date: {new Date(event.updatedAt).toLocaleDateString('en-US', {
                        month: 'long', day: 'numeric', year: 'numeric'
                      })}
                    </span>
                    <span className="text-sm text-gray-500 mb-2">| Time: {event.timeSlot}</span>
                  </div>
                </Card>
              </Link>
            </div>
          </div>
        ))
      )}

      {showMore && events.length > 0 && (
        <div className="flex justify-center my-4">
          <Button
            type="button"
            className="bg-cyan-500 text-white hover:bg-cyan-600"
            onClick={handleLoadMore}
          >
            Load More
          </Button>
        </div>
      )}

      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="relative max-w-screen-lg max-h-screen">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white text-2xl font-bold"
            >
              &times;
            </button>
            <img
              src={selectedImage}
              alt="Full size"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default AllEvents;
