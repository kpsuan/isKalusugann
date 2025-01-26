import React, { useState, useEffect } from "react";
import { generateDate, months } from "./util/calendar";
import cn from "./util/cn";
import { Link } from 'react-router-dom';
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import axios from 'axios';

dayjs.extend(utc);
dayjs.extend(timezone);

export default function Calendar({ onDateChange, selectedDate }) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const currentDate = dayjs().tz('Asia/Manila');
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
      handleFetchUsers(dateString);
    }
  }, [selectDate]);

  const handleDateClick = (date) => {
    const cleanDate = dayjs(date).startOf('day');
    setSelectDate(cleanDate);
    onDateChange(cleanDate);
  };

  const handleFetchUsers = async (dateString) => {
    if (!dateString) return;
    setLoading(true);
    try {
      const response = await axios.get(`/api/user/scheduled-for-date/${dateString}`);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const statusColors = [
    'bg-green-100 text-green-800',
  ];

  return (
    <div className="flex gap-8 justify-center w-full items-start sm:flex-row flex-col p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-6 animate-fadeIn">
        {/* Calendar Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-gray-800 animate-slideIn">
              {months[today.month()]}
            </h1>
            <p className="text-gray-500 text-sm">{today.year()}</p>
          </div>
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setToday(today.month(today.month() - 1))}
              className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300 hover:scale-110"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button 
              onClick={() => setToday(currentDate)}
              className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 rounded-full transition-all duration-300 hover:scale-105 shadow-md"
            >
              Today
            </button>
            <button 
              onClick={() => setToday(today.month(today.month() + 1))}
              className="p-2 hover:bg-gray-100 rounded-full transition-all duration-300 hover:scale-110"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {/* Days Header */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {days.map((day, index) => (
            <h1
              key={index}
              className="text-sm font-medium text-center text-gray-500"
            >
              {day}
            </h1>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {generateDate(today.month(), today.year()).map(
            ({ date, currentMonth, today: isToday }, index) => {
              const isSelected = selectDate.isSame(dayjs(date).startOf('day'), 'day');
              return (
                <div
                  key={index}
                  className="aspect-square flex items-center justify-center p-1"
                >
                  <button
                    onClick={() => handleDateClick(date)}
                    className={cn(
                      "w-full h-full flex items-center justify-center rounded-lg transition-all duration-300",
                      "hover:scale-110 hover:shadow-md",
                      currentMonth ? "text-gray-800" : "text-gray-400",
                      isToday ? "bg-gradient-to-r from-blue-300 to-blue-200 text-blue-800 font-semibold" : "",
                      isSelected ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg scale-110" : "",
                      "text-sm font-medium"
                    )}
                  >
                    {dayjs(date).date()}
                  </button>
                </div>
              );
            }
          )}
        </div>
      </div>

      {/* Schedule Panel */}
      <div className="w-full max-w-lg bg-white rounded-xl shadow-lg p-6 animate-slideIn">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Students
          </h1>
          <p className="text-sm text-gray-500">
            {selectDate.format('MMMM D, YYYY')}
          </p>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="h-[400px] overflow-y-auto pr-4 schedule-scroll">
            <style>{`
              .schedule-scroll::-webkit-scrollbar {
                width: 8px;
              }
              .schedule-scroll::-webkit-scrollbar-track {
                background: #f1f1f1;
                border-radius: 4px;
              }
              .schedule-scroll::-webkit-scrollbar-thumb {
                background: #c7d2fe;
                border-radius: 4px;
              }
              .schedule-scroll::-webkit-scrollbar-thumb:hover {
                background: #818cf8;
              }
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
              @keyframes slideIn {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
              }
              .animate-fadeIn {
                animation: fadeIn 0.5s ease-out;
              }
              .animate-slideIn {
                animation: slideIn 0.5s ease-out;
              }
            `}</style>
            {users.length > 0 ? (
              <div className="space-y-3">
                {users.map((user, index) => (
                  <div 
                    key={user._id} 
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-100 transition-all duration-300 hover:shadow-md animate-slideIn"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative">
                      <img
                        src={user.profilePicture || 'default-profile.png'}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm transition-transform duration-300 hover:scale-110"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        to={`/users/${user.slug}`}
                        className="text-gray-900 font-medium hover:text-blue-600 transition-colors truncate block"
                      >
                        {`${user.firstName} ${user.middleName || ''} ${user.lastName}`}
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-2 py-1 rounded-full text-xs ${statusColors[index % statusColors.length]}`}>
                          {user.yearLevel} year
                        </span>
                        <span className="text-gray-500 text-sm"></span>
                        <span className="text-gray-500 text-sm truncate">
                          {user.college}
                        </span>
                        <span className="text-gray-500 text-sm"></span>

                        <span className="text-gray-500 text-sm truncate">
                          {user.degreeProgram}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500 animate-fadeIn">
                <svg className="w-12 h-12 mb-3 text-indigo-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="text-sm">No students scheduled for this date</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}