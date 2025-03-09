import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { Calendar, X, AlertTriangle, Check, Clock, Trash, Plus, CalendarRange, AlertCircle } from 'lucide-react';

const UnavailableDatesManager = () => {
  // State
  const [standardHolidays, setStandardHolidays] = useState([]);
  const [customUnavailableDates, setCustomUnavailableDates] = useState([]);
  const [newDate, setNewDate] = useState(null);
  const [selectedDates, setSelectedDates] = useState([]);
  const [isDateRangeMode, setIsDateRangeMode] = useState(false);
  const [dateRange, setDateRange] = useState([null, null]);
  const [startDate, endDate] = dateRange;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isRemovingAll, setIsRemovingAll] = useState(false);
  const [showRemoveAllConfirm, setShowRemoveAllConfirm] = useState(false);

  // Fetch unavailable dates on component mount
  useEffect(() => {
    fetchUnavailableDates();
  }, []);

  // Animation effect for new dates
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Fetch unavailable dates from API
  const fetchUnavailableDates = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/settings/get-unavailable-dates');
      setStandardHolidays(response.data.standardHolidays.map(date => new Date(date)));
      setCustomUnavailableDates(response.data.customUnavailableDates.map(date => new Date(date)));
      setError(null);
    } catch (err) {
      setError('Failed to load unavailable dates: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  // Add new unavailable date(s)
  const addUnavailableDates = async () => {
    if (isDateRangeMode) {
      if (!startDate || !endDate) return;
      addDateRange();
    } else {
      if (selectedDates.length === 0 && !newDate) return;
      if (selectedDates.length > 0) {
      
      } else {
        addSingleDate();
      }
    }
  };

  // Add a single unavailable date
  const addSingleDate = async () => {
    if (!newDate) return;
    
    const formattedDate = newDate.toISOString().split('T')[0];
    
    if (isDateDisabled(newDate)) {
      setError('This date is already set as unavailable');
      return;
    }
    
    try {
      setIsAdding(true);
      await axios.post('/api/settings/update-unavailable-dates', {
        datesToAdd: [formattedDate]
      });
      
      setCustomUnavailableDates(prev => [...prev, newDate]);
      setNewDate(null);
      setSuccess('Date added successfully');
      setError(null);
    } catch (err) {
      setError('Failed to add date: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsAdding(false);
    }
  };

  

  // Add a date range
  const addDateRange = async () => {
    if (!startDate || !endDate) return;
    
    // Generate all dates in the range
    const allDates = getDatesInRange(startDate, endDate);
    
    // Format dates to YYYY-MM-DD
    const formattedDates = allDates.map(date => date.toISOString().split('T')[0]);
    
    // Filter out dates that are already unavailable
    const newDates = allDates.filter(date => !isDateDisabled(date));
    const newFormattedDates = newDates.map(date => date.toISOString().split('T')[0]);
    
    if (newFormattedDates.length === 0) {
      setError('All dates in the selected range are already set as unavailable');
      return;
    }
    
    try {
      setIsAdding(true);
      await axios.post('/api/settings/update-unavailable-dates', {
        datesToAdd: newFormattedDates
      });
      
      // Add to local state
      setCustomUnavailableDates(prev => [...prev, ...newDates]);
      setDateRange([null, null]);
      setSuccess(`${newFormattedDates.length} dates added successfully`);
      setError(null);
    } catch (err) {
      setError('Failed to add date range: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsAdding(false);
    }
  };

  // Helper function to get all dates in a range
  const getDatesInRange = (start, end) => {
    const dates = [];
    const currentDate = new Date(start);
    const lastDate = new Date(end);
    
    while (currentDate <= lastDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  };

  // Handle date selection in multi-select mode
  const handleDateSelect = (date) => {
    if (isDateDisabled(date)) return;
    
    setSelectedDates(prev => {
      const dateStr = date.toISOString();
      if (prev.some(d => d.toISOString() === dateStr)) {
        return prev.filter(d => d.toISOString() !== dateStr);
      } else {
        return [...prev, date];
      }
    });
  };

  // Remove unavailable date
  const removeUnavailableDate = async (dateToRemove) => {
    // Format date to YYYY-MM-DD
    const formattedDate = dateToRemove.toISOString().split('T')[0];
    
    try {
      setIsLoading(true);
      await axios.post('/api/settings/update-unavailable-dates', {
        datesToRemove: [formattedDate]
      });
      
      // Remove from local state
      setCustomUnavailableDates(customUnavailableDates.filter(
        date => date.toISOString().split('T')[0] !== formattedDate
      ));
      setSuccess('Date removed successfully');
      setError(null);
      setDeleteConfirm(null);
    } catch (err) {
      setError('Failed to remove date: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  // Remove all unavailable dates
  const removeAllUnavailableDates = async () => {
    if (customUnavailableDates.length === 0) {
      setShowRemoveAllConfirm(false);
      return;
    }
    
    try {
      setIsRemovingAll(true);
      
      // Format all dates to YYYY-MM-DD
      const allFormattedDates = customUnavailableDates.map(date => 
        date.toISOString().split('T')[0]
      );
      
      await axios.post('/api/settings/update-unavailable-dates', {
        datesToRemove: allFormattedDates
      });
      
      // Clear the local state
      setCustomUnavailableDates([]);
      setSuccess('All custom dates removed successfully');
      setError(null);
      setShowRemoveAllConfirm(false);
    } catch (err) {
      setError('Failed to remove all dates: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsRemovingAll(false);
    }
  };

  // Format date for display
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Check if a date should be disabled in the date picker
  const isDateDisabled = (date) => {
    if (!date) return false;
    const formattedDate = date.toISOString().split('T')[0];
    return standardHolidays.some(holiday => holiday.toISOString().split('T')[0] === formattedDate) ||
           customUnavailableDates.some(unavailable => unavailable.toISOString().split('T')[0] === formattedDate);
  };

  // Toggle between single date and range selection modes
  const toggleDateSelectionMode = () => {
    setIsDateRangeMode(!isDateRangeMode);
    setNewDate(null);
    setSelectedDates([]);
    setDateRange([null, null]);
  };

  return (
    <div className="max-w mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200">
     
      
      {/* Error and Success Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-start animate-fade-in">
          <AlertTriangle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Error</p>
            <p>{error}</p>
          </div>
          <button 
            className="ml-auto text-red-500 hover:text-red-700"
            onClick={() => setError(null)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 flex items-start animate-fade-in">
          <Check className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">Success</p>
            <p>{success}</p>
          </div>
        </div>
      )}
      
      {/* Date Picker Section */}
      <div className="mb-8 p-5 border rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 shadow-sm transition-all hover:shadow">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <Plus className="w-5 h-5 mr-2 text-blue-600" />
            Add New Unavailable Dates
          </h2>
          
          {/* Toggle between single, multi, and range selection */}
          <div className="flex space-x-2 mt-2 sm:mt-0">
            <button
              onClick={() => {
                setIsDateRangeMode(false);
                setSelectedDates([]);
              }}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                !isDateRangeMode && selectedDates.length === 0
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Single Date
            </button>
            
            <button
              onClick={() => {
                setIsDateRangeMode(true);
                setNewDate(null);
                setSelectedDates([]);
              }}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                isDateRangeMode
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Date Range
            </button>
          </div>
        </div>
        
        <div className="flex flex-col gap-4">
          {/* Single Date Selection */}
          {!isDateRangeMode && selectedDates.length === 0 && (
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
              <div className="relative w-full sm:w-64">
                <DatePicker
                  selected={newDate}
                  onChange={date => setNewDate(date)}
                  filterDate={date => !isDateDisabled(date)}
                  dateFormat="MMMM d, yyyy"
                  placeholderText="Select a date"
                  className="p-3 border rounded-md w-full focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all"
                />
                <Calendar className="absolute right-3 top-3 w-5 h-5 text-gray-400 pointer-events-none" />
              </div>
              <button
                onClick={addUnavailableDates}
                disabled={!newDate || isAdding}
                className="px-4 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors duration-200 w-full sm:w-auto flex items-center justify-center"
              >
                {isAdding ? (
                  <>
                    <Clock className="animate-spin w-4 h-4 mr-2" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Date
                  </>
                )}
              </button>
            </div>
          )}
        
          
          {/* Date Range Selection */}
          {isDateRangeMode && (
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="relative w-full sm:w-64">
                <DatePicker
                  selectsRange={true}
                  startDate={startDate}
                  endDate={endDate}
                  onChange={(update) => setDateRange(update)}
                  monthsShown={1}
                  inline
                  filterDate={date => !isDateDisabled(date)}
                  calendarClassName="border rounded-lg shadow-md bg-white"
                />
              </div>
              <div className="w-full sm:w-auto space-y-3">
                <div className="bg-blue-50 p-3 rounded-md border border-blue-100">
                  <div className="flex items-center mb-2">
                    <CalendarRange className="w-5 h-5 text-blue-600 mr-2" />
                    <p className="text-blue-800 font-medium">Selected Range</p>
                  </div>
                  {startDate && endDate ? (
                    <>
                      <p className="text-gray-700">
                        From: <span className="font-medium">{startDate.toLocaleDateString()}</span>
                      </p>
                      <p className="text-gray-700">
                        To: <span className="font-medium">{endDate.toLocaleDateString()}</span>
                      </p>
                      <p className="text-gray-700 mt-1">
                        Total: <span className="font-medium">{
                          Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1
                        } days</span>
                      </p>
                    </>
                  ) : (
                    <p className="text-gray-500 italic">Please select start and end dates</p>
                  )}
                </div>
                <button
                  onClick={addUnavailableDates}
                  disabled={!startDate || !endDate || isAdding}
                  className="px-4 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300 disabled:cursor-not-allowed transition-colors duration-200 w-full flex items-center justify-center"
                >
                  {isAdding ? (
                    <>
                      <Clock className="animate-spin w-4 h-4 mr-2" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" />
                      Add Date Range
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Standard Holidays Section */}
      <div className="mb-8">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-red-500" />
          Standard Holidays (Cannot be removed)
        </h2>
        {isLoading && standardHolidays.length === 0 ? (
          <div className="flex justify-center p-8">
            <Clock className="w-6 h-6 text-blue-500 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {standardHolidays.map((date, index) => (
              <div key={index} className="p-4 border rounded-md bg-slate-100 flex justify-between items-center transition-all hover:shadow-md">
                <span className="font-medium">{formatDate(date)}</span>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">Official Holiday</span>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Custom Unavailable Dates Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-indigo-500" />
            Custom Unavailable Dates
          </h2>
          
          {/* Remove All Button */}
          {customUnavailableDates.length > 0 && (
            <button
              onClick={() => setShowRemoveAllConfirm(true)}
              disabled={isRemovingAll || isLoading}
              className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors"
            >
              <Trash className="w-4 h-4" />
              Remove All
            </button>
          )}
        </div>
        
        {/* Remove All Confirmation Dialog */}
        {showRemoveAllConfirm && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg animate-fade-in">
            <div className="flex items-start mb-3">
              <AlertCircle className="w-5 h-5 text-red-600 mr-2 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-800">Confirm Removal</h3>
                <p className="text-red-700">Are you sure you want to remove all {customUnavailableDates.length} custom unavailable dates?</p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowRemoveAllConfirm(false)}
                className="px-3 py-1.5 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={removeAllUnavailableDates}
                disabled={isRemovingAll}
                className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors flex items-center"
              >
                {isRemovingAll ? (
                  <>
                    <Clock className="animate-spin w-4 h-4 mr-2" />
                    Removing...
                  </>
                ) : (
                  <>
                    <Trash className="w-4 h-4 mr-2" />
                    Remove All
                  </>
                )}
              </button>
            </div>
          </div>
        )}
        
        {isLoading && customUnavailableDates.length === 0 ? (
          <div className="flex justify-center p-8">
            <Clock className="w-6 h-6 text-blue-500 animate-spin" />
          </div>
        ) : customUnavailableDates.length === 0 ? (
          <div className="text-center p-8 border border-dashed rounded-lg bg-gray-50">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-2" />
            <p className="text-gray-500">No custom unavailable dates set</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {customUnavailableDates.map((date, index) => (
              <div key={index} 
                className={`p-4 border rounded-md bg-indigo-50 flex justify-between items-center transition-all hover:shadow-md ${
                  deleteConfirm === date.toISOString() ? 'bg-red-100 border-red-300' : ''
                }`}
              >
                <span className="font-medium">{formatDate(date)}</span>
                
                {deleteConfirm === date.toISOString() ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => removeUnavailableDate(date)}
                      disabled={isLoading}
                      className="text-white bg-red-600 hover:bg-red-700 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="text-gray-700 bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded-md text-sm font-medium transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(date.toISOString())}
                    disabled={isLoading}
                    className="text-red-600 hover:text-red-800 flex items-center gap-1 text-sm font-medium p-1 hover:bg-red-100 rounded transition-colors"
                  >
                    <Trash className="w-4 h-4" />
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Add global CSS */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        /* Style for highlighted dates in multi-select mode */
        .react-datepicker__day--highlighted {
          background-color: #3b82f6 !important;
          color: white !important;
        }
        
        /* Style for the date range selection */
        .react-datepicker__day--in-range {
          background-color: #bfdbfe !important;
        }
        
        .react-datepicker__day--range-start,
        .react-datepicker__day--range-end {
          background-color: #3b82f6 !important;
          color: white !important;
        }
      `}</style>
    </div>
  );
};

export default UnavailableDatesManager;