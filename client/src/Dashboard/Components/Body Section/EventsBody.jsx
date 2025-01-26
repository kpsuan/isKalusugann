import React from 'react';
import { Badge, Card, Button } from "flowbite-react";
import { HiCalendar, HiLocationMarker, HiCheck, HiClock } from "react-icons/hi";

const EventsSection = ({ events, eventType, filterEvents, currentPage, setCurrentPage, filteredEvents }) => {
  const itemsPerPage = 3;
  const paginatedEvents = filteredEvents.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  return (
    <div className="w-full p-4 bg-white rounded-lg shadow-sm">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Events</h2>
        <div className="flex gap-2">
          <Badge 
            className={`cursor-pointer p-3 ${eventType === 'upcoming' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
            icon={HiCheck}
            onClick={() => filterEvents("upcoming")}
          >
            Upcoming ({events.filter(event => event.isUpcoming).length})
          </Badge>
          <Badge
            className={`cursor-pointer p-3 ${eventType === 'past' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}
            icon={HiClock}
            onClick={() => filterEvents("past")}
          >
            Past ({events.filter(event => !event.isUpcoming).length})
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedEvents.map((event, index) => (
          <div key={index} className="w-full bg-white rounded-xl shadow-lg overflow-hidden  h-86 hover:bg-gray-100 transition-shadow duration-300">
            <div className="relative rounded-xl  shadow-lg w-full p-0">
            <img
              src={event.image}
              alt={event.title}
              className= 'w-full h-40 object-cover'
            />
              <Badge color="warning" className="absolute top-3 right-3">
                {eventType === 'upcoming' ? 'Upcoming' : 'Past'}
              </Badge>
            </div>
            <div className="p-4 flex flex-col justify-between h-36">
              <h5 className="text-xl font-bold tracking-tight text-gray-900 line-clamp-2">
                {event.title}
              </h5>
              <div className="space-y-2">
                <div className="flex items-center text-gray-700">
                  <HiCalendar className="mr-2" />
                  <span className="text-xs">
                    {new Date(event.date).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center text-gray-700">
                  <HiLocationMarker className="mr-2" />
                  <span className="text-xs line-clamp-1">{event.location}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-6 gap-2">
        <Button
          color="gray"
          onClick={() => setCurrentPage(Math.max(currentPage - 1, 0))}
          disabled={currentPage === 0}
        >
          Previous
        </Button>
        <Button
          color="gray" 
          onClick={() => setCurrentPage(Math.min(currentPage + 1, Math.ceil(filteredEvents.length / itemsPerPage) - 1))}
          disabled={(currentPage + 1) * itemsPerPage >= filteredEvents.length}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

export default EventsSection;