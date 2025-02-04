// EmergencyReschedule.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import dayjs from 'dayjs'; // Make sure to import dayjs if not already imported

const EmergencyReschedule = () => {
  const [emergencyDate, setEmergencyDate] = useState("");
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDates = async () => {
      try {
        const res = await fetch('/api/settings/getDates', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          setStartDate(data.startDate);
          setEndDate(data.endDate);
        } else {
          console.error('Error fetching dates:', data.message);
        }
      } catch (error) {
        console.error('Error fetching dates:', error.message);
      }
    };

    fetchDates();
  }, []);

  const handleEmergencyDateChange = (e) => {
    const selectedDate = dayjs(e.target.value).startOf('day');
    setEmergencyDate(selectedDate.format('YYYY-MM-DD'));
  };

  const handleReschedule = async () => {
    if (!emergencyDate || !startDate || !endDate) {
      toast.error("Please select all required dates.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(
        "/api/user/emergency-reschedule",
        { 
          emergencyDate: dayjs(emergencyDate).format('YYYY-MM-DD'),
          startDate,
          endDate 
        },
      );
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Rescheduling failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Emergency Rescheduling</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Emergency Date</label>
          <input
            type="date"
            className="border rounded p-2 w-full"
            value={emergencyDate}
            onChange={handleEmergencyDateChange}
          />
        </div>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
          onClick={handleReschedule}
          disabled={loading}
        >
          {loading ? "Processing..." : "Reschedule"}
        </button>
      </div>
    </div>
  );
};

export default EmergencyReschedule;