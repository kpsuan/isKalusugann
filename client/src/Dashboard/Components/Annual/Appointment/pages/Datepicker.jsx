import React, { useState, useEffect } from "react";
import axios from 'axios';
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { generateDate, months } from "./util/calendar2";
import cn from "./util/cn2";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";

// Extend dayjs with timezone and utc plugins
dayjs.extend(utc);
dayjs.extend(timezone);

export default function Datepicker({ onDateChange, selectedDate }) {
  const days = ["S", "M", "T", "W", "T", "F", "S"];
  const currentDate = dayjs().tz('Asia/Manila').startOf('day'); // Set timezone here and start of day
  const [today, setToday] = useState(currentDate);
  const [selectDate, setSelectDate] = useState(dayjs(selectedDate).startOf('day') || currentDate);
  const [slotsStatus, setSlotsStatus] = useState({});
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(''); // Added state for selected slot

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
    if (!today || !slotsStatus) return; // Check if today and slotsStatus are defined
    if (cleanDate.isBefore(today, 'day') || slotsStatus[formattedDate] === 'full') {
      return; // Prevent clicking on past dates or fully booked dates
    }
    setSelectDate(cleanDate);
    onDateChange(cleanDate);
  };

  const fetchAvailabilityStatus = async (month, year) => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/appointments/monthly-availability/${year}-${month}`);
      setSlotsStatus(response.data);
    } catch (error) {
      console.error('Error fetching monthly availability:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableTimeSlots = async (dateString) => {
    if (!dateString) return;

    console.log('Fetching available slots for date:', dateString);

    setLoading(true);
    try {
      const response = await axios.get(`/api/appointments/available-slots/${dateString}`);
      console.log('Response data:', response.data);
      setAvailableSlots(response.data.availableTimeSlots);
    } catch (error) {
      console.error('Error fetching available slots for the date:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSlotChange = (event) => {
    setSelectedSlot(event.target.value);
  };

  return (
    <div className="flex gap-5 sm:divide-x my-4 w-full items-center sm:flex-row flex-col">
      <div className="w-full max-w-lg h-[500px]">
        <div className="flex justify-between items-center">
          <h1 className="select-none font-semibold">
            {months[today.month()]}, {today.year()}
          </h1>
          <div className="flex gap-10 items-center">
            <GrFormPrevious
              className="w-5 h-5 cursor-pointer hover:scale-105 transition-all"
              onClick={() => setToday(today.month(today.month() - 1))}
            />
            <h1
              className="cursor-pointer hover:scale-105 transition-all"
              onClick={() => setToday(currentDate)}
            >
              Today
            </h1>
            <GrFormNext
              className="w-5 h-5 cursor-pointer hover:scale-105 transition-all"
              onClick={() => setToday(today.month(today.month() + 1))}
            />
          </div>
        </div>
        <div className="grid grid-cols-7">
          {days.map((day, index) => (
            <h1
              key={index}
              className="text-sm text-center h-14 w-14 grid place-content-center text-gray-500 select-none"
            >
              {day}
            </h1>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {generateDate(today.month(), today.year()).map(
            ({ date, currentMonth, today }, index) => {
              const formattedDate = dayjs(date).format('YYYY-MM-DD');
              const isPastDate = dayjs(date).isBefore(today, 'day');
              const isAvailableDate = !isPastDate && slotsStatus[formattedDate] !== 'full';

              // Default to gray background for past dates
              let bgColor = 'bg-gray-300';
              if (!isPastDate) {
                // Override gray background if the date is in the future and available
                bgColor = isAvailableDate ? 'bg-green-300 rounded-full' : 'bg-red-300';
              }

              return (
                <div
                  key={index}
                  className={`p-2 text-center h-14 grid place-content-center text-sm border-t ${bgColor} rounded-full`}
                >
                  <h1
                    className={cn(
                      currentMonth ? "" : "text-gray-400",
                      selectDate && today && selectDate.isSame(dayjs(date).startOf('day'), 'day') ? "bg-black text-white" : "",
                      "h-10 w-10 rounded-full grid place-content-center hover:bg-black hover:text-white transition-all cursor-pointer select-none",
                    )}
                    onClick={() => handleDateClick(date)}
                  >
                    {dayjs(date).date()}
                  </h1>
                </div>
              );
            }
          )}
        </div>
      </div>

      <div className="w-full max-w-lg h-[500px] sm:px-5">
        <h1 className="font-semibold mb-4">
          Available slots for: {selectDate.startOf('day').toDate().toDateString()}
        </h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div>
            {availableSlots.length > 0 ? (
              <div className="flex max-w-md flex-col gap-4">
                {availableSlots.map((slot, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="radio"
                      id={`slot${index}`}
                      name="timeSlot"
                      value={slot}
                      checked={selectedSlot === slot}
                      onChange={handleSlotChange}
                    />
                    <label htmlFor={`slot${index}`} className="flex">
                      {slot}
                    </label>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No slots available.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
