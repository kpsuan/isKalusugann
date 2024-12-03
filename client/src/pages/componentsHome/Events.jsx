import React, { useEffect, useState } from 'react';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch(`/api/events/getevents?limit=10&order=asc`); // Adjust the API endpoint as needed
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

  if (loading) {
    return <div className="text-center text-white">Loading events...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    if (isNaN(date.getTime())) {
      return { date: 'TBA', time: 'TBA' }; // Handling invalid dates
    }
  
    const options = { month: 'short', day: 'numeric', year: 'numeric' }; // Month Day Year format
    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
  
    return {
      date: date.toLocaleDateString(undefined, options), // This will display "Nov 6, 2024"
      time: date.toLocaleTimeString(undefined, timeOptions),
    };
  };

  
  return (
    <section className="bg-blue-700 text-white dark:bg-gray-900 antialiased">
      <div className="max-w-screen-xl px-4 py-8 mx-auto lg:px-6 sm:py-16 lg:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-extrabold leading-tight tracking-tight text-white dark:text-white">
            Events
          </h2>
          <div className="mt-4">
            <a
              href="#"
              title=""
              className="inline-flex items-center text-lg font-medium text-primary-600 hover:underline dark:text-primary-500"
            >
              Learn more about our agenda
              <svg
                aria-hidden="true"
                className="w-5 h-5 ml-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>

        <div className="flow-root max-w-3xl mx-auto mt-8 sm:mt-12 lg:mt-16">
          <div className="-my-4 divide-y divide-white dark:divide-gray-700">
            {events.map((event, index) => (
              <div
                key={index}
                className="flex flex-col gap-2 py-4 sm:gap-6 sm:flex-row sm:items-center"
              >
                <p className="w-32 text-lg font-normal text-white sm:text-right dark:text-gray-400 shrink-0">
                  {event.date || 'TBA'}
                </p>
                <h3 className="text-lg font-semibold text-white dark:text-white">
                  <a href="#" className="hover:underline">
                    {event.title}
                  </a>
                </h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Events;
