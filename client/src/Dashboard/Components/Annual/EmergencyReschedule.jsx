import React, { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';
import Sidebar from '../SideBar Section/Sidebar';
import { toast, ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux';


const EmergencyReschedule = () => {
  const [emergencyDate, setEmergencyDate] = useState("");
  const [reason, setReason] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [affectedAppointments, setAffectedAppointments] = useState([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [error, setError] = useState("");
  const [fetchingAppointments, setFetchingAppointments] = useState(false);

  const { currentUser } = useSelector((state) => state.user);
  

  useEffect(() => {
    fetchDates();
  }, []);

  useEffect(() => {
    if (emergencyDate) {
      fetchAffectedAppointments();
    }
  }, [emergencyDate]);

  const fetchDates = async () => {
    try {
      const res = await fetch('/api/settings/getDates', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      if (res.ok) {
        setStartDate(data.startDate);
        setEndDate(data.endDate);
      } else {
        setError('Failed to fetch date range');
      }
    } catch (error) {
      setError('Network error while fetching dates');
    }
  };

  const fetchAffectedAppointments = async () => {
    setFetchingAppointments(true);
    setError("");
    
    try {
      const res = await fetch(`/api/user/scheduled-for-date/${emergencyDate}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await res.json();
      
      if (res.ok) {
        // Ensure we handle both array and object responses correctly
        const appointments = Array.isArray(data) ? data : data.usersScheduledForDate || [];
        setAffectedAppointments(appointments);
      } else {
        setError(data.error || 'Failed to fetch appointments');
        setAffectedAppointments([]);
      }
    } catch (error) {
      console.error('Error fetching affected appointments:', error);
      setError('Failed to load appointments');
      setAffectedAppointments([]);
    } finally {
      setFetchingAppointments(false);
    }
  };

  const handleEmergencyDateChange = (e) => {
    setEmergencyDate(e.target.value);
    setPreviewMode(true);
    setError("");
  };

  const handleReschedule = async () => {
    if (!emergencyDate) {
      setError("Please select an emergency date");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const response = await fetch("/api/user/emergency-reschedule", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          emergencyDate,
          startDate,
          endDate,
          reason: reason.trim(),
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setPreviewMode(false);
        toast.success('Users have been rescheduled');
        setAffectedAppointments([]);
        setEmergencyDate("");
        setReason("");
      } else {
        setError(data.error || data.message || 'Rescheduling failed');
      }
    } catch (error) {
      toast.error('Network error during rescheduling');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard my-flex">
      <div className="dashboardContainer my-flex">
      <ToastContainer className="z-50" />
        <Sidebar />
        <div className="mainContent m-0 p-0">
          <div className=" bg-gradient-to-r from-blue-700 to-cyan-500 rounded-lg border border-gray-200 p-10 w-full">
            <div className="text-4xl font-bold  text-white mb-4"> Reschedule Users on Selected Date</div>
            <p className="font-light text-lg my-8 text-white"> Make date unavailable, and reschedule users.
            </p>
          </div>
          <div className=" mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-6">
                <Calendar className="w-6 h-6 text-blue-600 mr-2" />
                <h2 className="text-2xl font-bold text-gray-800">Emergency Rescheduling</h2>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                  {error}
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Emergency Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      value={emergencyDate}
                      onChange={handleEmergencyDateChange}
                      min={startDate}
                      max={endDate}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason for Emergency Rescheduling
                  </label>
                  <textarea
                    className="w-full p-3 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24 resize-none"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Please provide a reason for the emergency rescheduling..."
                    maxLength={500}
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    {reason.length}/500 characters
                  </p>
                </div>

                {previewMode && (
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-3">Affected Users</h3>
                    {fetchingAppointments ? (
                      <div className="flex justify-center py-4">
                        <svg className="animate-spin h-6 w-6 text-blue-600" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                      </div>
                    ) : affectedAppointments.length > 0 ? (
                      <div className="space-y-3">
                        {affectedAppointments.map((apt, index) => (
                          <div key={index} className="flex items-center p-3 bg-gray-50 rounded">
                            <Clock className="w-5 h-5 text-gray-500 mr-2" />
                            <div>
                              <div>
                                {`${apt.lastName}, ${apt.middleName || ''} ${apt.firstName}`}
                                <span className="text-sm font-light block">{`${apt.yearLevel} | ${apt.college} | ${apt.degreeProgram}`}</span>
                              </div>
                              <p className="text-sm text-gray-600">{apt.schedule}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        No appointments scheduled for this date
                      </div>
                    )}
                  </div>
                )}

                <div className="flex justify-end space-x-3">
                  <button
                    className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
                    onClick={() => {
                      setPreviewMode(false);
                      setError("");
                      setEmergencyDate("");
                    }}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    onClick={handleReschedule}
                    disabled={loading || !emergencyDate || fetchingAppointments}
                  >
                    {loading ? (
                      <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    ) : null}
                    {loading ? "Processing..." : "Confirm Reschedule"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmergencyReschedule;