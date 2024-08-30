import React, { useState, useEffect } from 'react';
import { Alert } from 'flowbite-react';
const Timer = ({ endTime }) => {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, [endTime]);

  function getTimeLeft() {
    const now = new Date();
    const end = new Date(endTime);
    const difference = end - now;
    if (difference <= 0) {
      return { minutes: 0, seconds: 0 };
    }
    const minutes = Math.floor(difference / 60000);
    const seconds = Math.floor((difference % 60000) / 1000);
    return { minutes, seconds };
  }

  return (
    <div>
      <Alert color="warning" rounded className="text-sm mt-4 w-full bg-yellow-100 text-yellow-500  focus:ring-yellow-400 dark:bg-yellow-200 dark:text-yellow-600 dark:hover:bg-yellow-300">
                Please be advised that your selected date is reserved for  <span className="font-semibold ">{`${timeLeft.minutes}m ${timeLeft.seconds}s`}</span> 
              </Alert>

    </div>
  );
};

export default Timer;
