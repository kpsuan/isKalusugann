import React, { useState, useEffect } from "react";
import axios from 'axios';
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { generateDate, months } from "./util/calendar2";
import cn from "./util/cn2";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function Datepicker({ onDateChange, selectedDate }) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const currentDate = dayjs().tz('Asia/Manila').startOf('day');
  const [today, setToday] = useState(currentDate);
  const [selectDate, setSelectDate] = useState(dayjs(selectedDate).startOf('day') || currentDate);
  const [slotsStatus, setSlotsStatus] = useState({});
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState('');

  useEffect(() => {
    if (selectedDate) {
      setSelectDate(dayjs(selectedDate).startOf('day'));
    }
  }, [selectedDate]);

  useEffect(() => {
    if (selectDate) {
      const dateString = selectDate.startOf('day').format('YYYY-MM-DD');
      fetchAvailabilityStatus(today.month() + 1, today.year());
      fetchAvailableTimeSlots(dateString);
    }
  }, [selectDate, today]);

  const handleDateClick = (date) => {
    const cleanDate = dayjs(date).startOf('day');
    const formattedDate = cleanDate.format('YYYY-MM-DD');
    if (!today || !slotsStatus) return;
    if (cleanDate.isBefore(today, 'day') || slotsStatus[formattedDate] === 'full') {
      return;
    }
    setSelectDate(cleanDate);
    onDateChange(cleanDate);
    fetchAvailableTimeSlots(formattedDate); // Fetch available slots for the clicked date
  };

  const fetchAvailabilityStatus = async (month, year) => {
    const formattedMonth = month.toString().padStart(2, '0'); // Add leading zero
    try {
      const response = await axios.get(`/api/appointments/monthly-availability/${year}-${formattedMonth}`);
      setSlotsStatus(response.data);
    } catch (error) {
      console.error('Error fetching monthly availability:', error);
    }
  };

  const fetchAvailableTimeSlots = async (dateString) => {
    if (!dateString) return;
    setLoading(true);
    try {
      // Ensure that the date format matches the expected format for the backend
      const formattedDate = dayjs(dateString).tz('Asia/Manila').format('YYYY-MM-DD');
      const response = await axios.get(`/api/appointments/available-slots/${formattedDate}`);
      setAvailableSlots(response.data.availableTimeSlots);
    } catch (error) {
      console.error('Error fetching available slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSlotChange = (slot) => {
    setSelectedSlot(slot);
    // Pass the selected date and slot back to the parent component
    onDateChange(selectDate, slot);
  };

  const handleMonthChange = (delta) => {
    const newDate = today.add(delta, 'month');
    setToday(newDate);
    fetchAvailabilityStatus(newDate.month() + 1, newDate.year()); // Update availability status for the new month
  };

  return (
    <div className="flex gap-8 sm:divide-x divide-gray-200 my-4 w-full items-start sm:flex-row flex-col">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl font-semibold text-gray-800">
            {months[today.month()]}, {today.year()}
          </h1>
          <div className="flex items-center gap-4">
            <button 
              className="p-2 hover:bg-gray-100 rounded-full transition-all"
              onClick={() => handleMonthChange(-1)} // Move to the previous month
            >
              <GrFormPrevious className="w-5 h-5" />
            </button>
            <button 
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-full transition-all"
              onClick={() => setToday(currentDate)}
            >
              Today
            </button>
            <button 
              className="p-2 hover:bg-gray-100 rounded-full transition-all"
              onClick={() => handleMonthChange(1)} // Move to the next month
            >
              <GrFormNext className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 mb-2">
          {days.map((day, index) => (
            <div key={index} className="text-sm font-medium text-gray-500 text-center py-2">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-2">
          {generateDate(today.month(), today.year()).map(
            ({ date, currentMonth, today }, index) => {
              const formattedDate = dayjs(date).format('YYYY-MM-DD');
              const isPastDate = dayjs(date).isBefore(currentDate, 'day');
              
              // Ensure that the 'slotsStatus' object contains the availability for all days.
              // If the status for the date isn't found, you can assume the date is available.
              const isAvailableDate = !isPastDate && (slotsStatus[formattedDate] !== 'full' || !slotsStatus[formattedDate]);
          
              // Check if the selected date matches the button date
              const isSelected = selectDate.isSame(dayjs(date).startOf('day'), 'day');

              return (
                <button
                  key={index}
                  disabled={isPastDate || !isAvailableDate}
                  onClick={() => handleDateClick(date)}
                  className={cn(
                 "aspect-square p-2 relative rounded-lg transition-all",
                  !currentMonth && "text-gray-400",
                  isPastDate && "bg-gray-100 cursor-not-allowed",
                  !isPastDate && !isAvailableDate && "bg-red-100 text-red-600 cursor-not-allowed", // Red color for unavailable dates
                  isAvailableDate && !isSelected && "hover:bg-blue-50",
                  isSelected && "bg-blue-500 text-white hover:bg-blue-600",
                  !isPastDate && !isSelected && isAvailableDate && "bg-green-200"
                  )}
                >
                  <time 
                    dateTime={formattedDate}
                    className={cn(
                      "text-sm font-medium",
                      isSelected && "text-white"
                    )}
                  >
                    {dayjs(date).date()}
                  </time>
                </button>
              );
            }
          )}
        </div>
      </div>

      <div className="w-full max-w-lg sm:pl-8">
        <div className="bg-white rounded-2xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">
            Available Slots - {selectDate.format('MMMM D, YYYY')}
          </h2>
          
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="space-y-3">
              {availableSlots.length > 0 ? (
                availableSlots.map((slot, index) => (
                  <label
                    key={index}
                    className={cn(
                      "flex items-center p-4 rounded-lg border transition-all cursor-pointer",
                      selectedSlot === slot 
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-200 hover:bg-gray-50"
                    )}
                  >
                    <input
                      type="radio"
                      name="timeSlot"
                      value={slot}
                      checked={selectedSlot === slot}
                      onChange={(e) => handleSlotChange(e.target.value)}
                      className="w-4 h-4 text-blue-500 border-gray-300 focus:ring-blue-500"
                    />

                    <span className="ml-3 text-gray-700 font-medium">{slot}</span>
                  </label>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No available slots for this date.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
