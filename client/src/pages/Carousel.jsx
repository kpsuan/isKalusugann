import React, { useState } from 'react';

export default function Carousel({ items }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + items.length) % items.length);
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  return (
    <div className="relative h-full w-full">
      {/* Scroll Container */}
      <div className="flex h-full snap-mandatory overflow-y-hidden overflow-x-scroll scroll-smooth rounded-lg snap-x">
        {items.map((item, index) => (
          <div
            key={index}
            className={`w-full flex-shrink-0 snap-center transform cursor-default transition-opacity duration-500 ${
              index === activeIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={item.src}
              alt={item.alt}
              className="absolute left-1/2 top-1/2 block w-full -translate-x-1/2 -translate-y-1/2"
            />
          </div>
        ))}
      </div>

      {/* Indicators */}
      <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 space-x-3">
        {items.map((_, index) => (
          <span
            key={index}
            onClick={() => setActiveIndex(index)}
            className={`h-3 w-3 rounded-full cursor-pointer ${
              index === activeIndex
                ? 'bg-white dark:bg-gray-800'
                : 'bg-white/50 hover:bg-white dark:bg-gray-800/50 dark:hover:bg-gray-800'
            }`}
          ></span>
        ))}
      </div>

      {/* Left Control */}
      <button
        onClick={handlePrev}
        className="absolute left-0 top-0 flex h-full items-center justify-center px-4 focus:outline-none"
      >
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/30 hover:bg-white/50 dark:bg-gray-800/30 dark:hover:bg-gray-800/60">
          {/* Left Arrow Icon */}
          <svg
            className="h-5 w-5 text-white dark:text-gray-800"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </span>
      </button>

      {/* Right Control */}
      <button
        onClick={handleNext}
        className="absolute right-0 top-0 flex h-full items-center justify-center px-4 focus:outline-none"
      >
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/30 hover:bg-white/50 dark:bg-gray-800/30 dark:hover:bg-gray-800/60">
          {/* Right Arrow Icon */}
          <svg
            className="h-5 w-5 text-white dark:text-gray-800"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </span>
      </button>
    </div>
  );
}
