import React from 'react';

const Services = () => {
  return (
    <section className="px-8 bg-gradient-to-b from-teal-500 to-black py-12 text-white dark:bg-gray-900 md:py-16">
      <div className="container mx-auto max-w-screen-xl">
        {/* Heading */}
        <div className="mb-10 text-center">
          <h2 className="text-4xl font-extrabold tracking-tight dark:text-white md:text-5xl">
            Our Services
          </h2>
          <p className="mt-3 text-lg text-gray-200 dark:text-gray-400">
            Explore a variety of services designed to meet your healthcare needs.
          </p>
        </div>

        {/* Service Cards */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Service Item */}
          <a
            href="#"
            className="flex flex-col items-center justify-center rounded-lg border border-transparent bg-white p-8 shadow-lg transition-all transform hover:-translate-y-2 hover:shadow-2xl dark:bg-gray-800"
          >
            <svg
              className="mb-4 h-12 w-12 text-green-700 dark:text-green-400"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 15v5m-3 0h6M4 11h16M5 15h14a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1Z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              Annual PE Examinations
            </h3>
          </a>

          <a
            href="#"
            className="flex flex-col items-center justify-center rounded-lg border border-transparent bg-white p-8 shadow-lg transition-all transform hover:-translate-y-2 hover:shadow-2xl dark:bg-gray-800"
          >
            <svg
              className="mb-4 h-12 w-12 text-green-700 dark:text-green-400"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16.872 9.687 20 6.56 17.44 4 4 17.44 6.56 20 16.873 9.687Zm0 0-2.56-2.56M6 7v2m0 0v2m0-2H4m2 0h2m7 7v2m0 0v2m0-2h-2m2 0h2M8 4h.01v.01H8V4Zm2 2h.01v.01H10V6Zm2-2h.01v.01H12V4Zm8 8h.01v.01H20V12Zm-2 2h.01v.01H18V14Zm2 2h.01v.01H20V16Z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              Medical Consultations
            </h3>
          </a>

          <a
            href="#"
            className="flex flex-col items-center justify-center rounded-lg border border-transparent bg-white p-8 shadow-lg transition-all transform hover:-translate-y-2 hover:shadow-2xl dark:bg-gray-800"
          >
            <svg
              className="mb-4 h-12 w-12 text-green-700 dark:text-green-400"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              Dental Services
            </h3>
          </a>

          <a
            href="#"
            className="flex flex-col items-center justify-center rounded-lg border border-transparent bg-white p-8 shadow-lg transition-all transform hover:-translate-y-2 hover:shadow-2xl dark:bg-gray-800"
          >
            <svg
              className="mb-4 h-12 w-12 text-green-700 dark:text-green-400"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 10V6a3 3 0 0 1 3-3v0a3 3 0 0 1 3 3v4m3-2 .917 11.923A1 1 0 0 1 17.92 21H6.08a1 1 0 0 1-.997-1.077L6 8h12Z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
              Laboratory Examinations
            </h3>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Services;
