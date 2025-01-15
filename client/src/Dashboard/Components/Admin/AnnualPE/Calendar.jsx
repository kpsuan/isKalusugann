import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import React, { useState, useEffect } from "react";
import { generateDate, months } from "./util/calendar";
import cn from "./util/cn";
import { Link } from 'react-router-dom';
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import axios from 'axios';

// Extend dayjs with timezone and utc plugins
dayjs.extend(utc);
dayjs.extend(timezone);

export default function Calendar({ onDateChange, selectedDate }) {
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const currentDate = dayjs().tz('Asia/Manila'); // Set timezone here
  const [today, setToday] = useState(currentDate);
  const [selectDate, setSelectDate] = useState(dayjs(selectedDate).startOf('day') || currentDate);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedDate) {
      setSelectDate(dayjs(selectedDate).startOf('day'));
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectDate) {
      const dateString = selectDate.startOf('day').format('YYYY-MM-DD');
      console.log('Fetched date:', dateString);
      handleFetchUsers(dateString);
    }
  }, [selectDate]);

  const handleDateClick = (date) => {
    const cleanDate = dayjs(date).startOf('day');
    setSelectDate(cleanDate);
    onDateChange(cleanDate);
    console.log('Date clicked:', cleanDate.format('YYYY-MM-DD'));
  };

  const handleFetchUsers = async (dateString) => {
    if (!dateString) return;

    console.log('Fetching users for date:', dateString);

    setLoading(true);
    try {
      const response = await axios.get(`/api/user/scheduled-for-date/${dateString}`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users scheduled for the date:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-10 sm:divide-x justify-center w-full items-center sm:flex-row flex-col">
      <div className="w-full max-w-lg h-[450px] bg-white rounded-lg shadow-lg p-5">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-lg font-semibold text-gray-700">
            {months[today.month()]}, {today.year()}
          </h1>
          <div className="flex gap-5 items-center">
            <GrFormPrevious
              className="w-6 h-6 text-gray-600 hover:text-black cursor-pointer transition-transform transform hover:scale-110"
              onClick={() => setToday(today.month(today.month() - 1))}
            />
            <h1
              className="text-gray-600 cursor-pointer hover:text-black transition-all"
              onClick={() => setToday(currentDate)}
            >
              Today
            </h1>
            <GrFormNext
              className="w-6 h-6 text-gray-600 hover:text-black cursor-pointer transition-transform transform hover:scale-110"
              onClick={() => setToday(today.month(today.month() + 1))}
            />
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 mb-4">
          {days.map((day, index) => (
            <h1
              key={index}
              className="text-sm text-center text-gray-500 font-medium select-none"
            >
              {day}
            </h1>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {generateDate(today.month(), today.year()).map(
            ({ date, currentMonth, today }, index) => (
              <div
                key={index}
                className="h-14 w-14 grid place-content-center text-sm"
              >
                <h1
                  className={cn(
                    currentMonth ? "text-gray-800" : "text-gray-400",
                    today ? "bg-red-600 text-white" : "",
                    selectDate.isSame(dayjs(date).startOf('day'), 'day') ? "bg-black text-white" : "",
                    "h-10 w-10 rounded-full flex items-center justify-center cursor-pointer hover:bg-black hover:text-white transition-all"
                  )}
                  onClick={() => handleDateClick(date)}
                >
                  {dayjs(date).date()}
                </h1>
              </div>
            )
          )}
        </div>
      </div>

      <div className="w-full max-w-lg h-[450px] bg-white rounded-lg shadow-lg p-5 sm:px-5">
        <h1 className="text-lg font-semibold mb-4 text-gray-700">
          Schedule for {selectDate.startOf('day').toDate().toDateString()}
        </h1>
        {loading ? (
          <p className="text-gray-500">Loading...</p>
        ) : (
          <div className="h-96 overflow-y-auto">
            {users.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {users.map(user => (
                  <div key={user._id} className="flex items-center space-x-4 p-2 border-b">
                    <img
                      src={user.profilePicture || 'default-profile.png'}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <Link
                        to={`/users/${user.slug}`}
                        className="text-black hover:text-blue-500 hover:underline"
                      >
                        {`${user.firstName} ${user.middleName || ''} ${user.lastName}`}
                      </Link>
                      <p className="text-gray-400 text-sm">{user.degreeProgram}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No users scheduled for this date.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
