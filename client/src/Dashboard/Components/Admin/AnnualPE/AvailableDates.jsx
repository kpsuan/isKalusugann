import React, { useState, useEffect } from 'react';
import { Card } from 'flowbite-react';
import { Calendar, Clock, Users } from 'lucide-react';

const RescheduleDateCard = ({ date, remainingSlots,  onClick }) => (
  <Card 
    className={`transform transition-all duration-200 hover:scale-105 cursor-pointer `}
    onClick={onClick}
  >
    <div className="bg-gradient-to-r from-green-500 to-teal-500 -mt-4 -mx-4 p-4 rounded-t-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Calendar className="text-white" size={20} />
          <p className="text-white font-medium">Available Date</p>
        </div>
        <div className="flex items-center space-x-1 bg-white/20 rounded-full px-3 py-1">
          <Users size={16} className="text-white" />
          <span className="text-white text-sm">{remainingSlots} left </span>
        </div>
      </div>
    </div>
    
    <div className="mt-3">
      <div className="flex items-center space-x-2">
        <Clock size={16} className="text-gray-600" />
        <p className="text-lg font-semibold text-gray-800">
          {new Date(date).toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: '2-digit'
          })}
        </p>
      </div>
      
    </div>

    <div className="mt-3 pt-3 border-t">
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-600">Status</span>
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">
          Available
        </span>
      </div>
    </div>
  </Card>
);

const AvailableDates = ({ remainingSlots }) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h4 className="text-xl font-semibold text-gray-900">
          Available Dates for Rescheduling
        </h4>
        <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
          {remainingSlots.length} dates available
        </span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"> 
        {remainingSlots.map(({ date, remainingSlots }, idx) => (
          <RescheduleDateCard
            key={idx}
            date={date}
            remainingSlots={remainingSlots} // Pass remaining slots properly
          />
        ))}
      </div>

      
      {remainingSlots.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No available dates found</p>
        </div>
      )}
    </div>
  );
};

export default AvailableDates;