import React, { useState, useEffect } from "react";
import Sidebar from "../../SideBar Section/Sidebar";
import { Button, Card, Select, Spinner, Avatar } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDispatch } from 'react-redux';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Calendar, Clock, Users } from 'lucide-react';
import AvailableDates from './AvailableDates'
import Alert from '@mui/material/Alert';
import axios from "axios";
import {
	RESCHEDULE_SCHEDULE_TEMPLATE, RESCHEDULE_DENIED_TEMPLATE
} from "../../../../../../api/utils/emailTemplate";

const RescheduleStatus = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = useParams();

  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingDates, setLoadingDates] = useState(false);
  const [availableDates, setAvailableDates] = useState([]);
  const [remainingSlots, setRemainingSlots] = useState([]);

  const [user, setUser] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [scrollTop, setScrollTop] = useState(false);

  
  // Fetch startDate and endDate from API
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

  useEffect(() => {
    console.log("Received startDate:", startDate);
    console.log("Received endDate:", endDate);
  }, [startDate, endDate]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/user/${userId}`);
        const userData = await res.json();
        if (res.ok) {
          setUser(userData);
          setFormData({
            rescheduleStatus: userData.rescheduleStatus || "",
            rescheduleRemarks: userData.rescheduleRemarks || ""
          });
        } else {
          console.error("Error fetching user data:", userData.message);
        }
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  useEffect(() => {
    const fetchAvailableDates = async () => {
      try {
        setLoadingDates(true);
        const res = await fetch(`/api/user/reschedule/${userId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ startDate, endDate }),
        });
        const scheduleData = await res.json();
        if (res.ok) {
          setAvailableDates(scheduleData.rescheduledDates || []);
          setRemainingSlots(scheduleData.remainingSlots || []); 
          console.log("Available dates:", scheduleData.rescheduledDates);
          console.log("Remaining slots: ", scheduleData.remainingSlots);
        } else {
          console.error("Error fetching available dates:", scheduleData.message);
        }
      } catch (error) {
        console.error("Error fetching available dates:", error.message);
      } finally {
        setLoadingDates(false);
      }
    };
  
    if (startDate && endDate) {
      fetchAvailableDates();
    }
  }, [startDate, endDate, userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedDates = availableDates.map(date => {
        const d = new Date(date);
        if (isNaN(d.getTime())) {
            console.error("Invalid date:", date);
            return null;
        }
        return d.toISOString();
    }).filter(Boolean);

    const dataToSubmit = {
        ...formData,
        ...(formData.rescheduleStatus !== 'denied' && { rescheduledDate: formattedDates })
    };

    try {
        const res = await fetch(`/api/user/update/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSubmit),
        });
        const data = await res.json();

        if (!res.ok) {
            console.error('Failed to update user:', data.message);
            setPublishError('Failed to update user.');
            return;
        }

        let emailContent = '';
        let subject = '';

        if (formData.rescheduleStatus === 'approved') {
          const formattedDates2 = dataToSubmit.rescheduledDate
              .map(date => new Date(date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
              }))
              .join(', ');
      
          emailContent = RESCHEDULE_SCHEDULE_TEMPLATE
              .replace('{firstName}', user.firstName)
              .replace('{schedule}', formattedDates2); // Use formatted dates
      
          subject = 'Reschedule Dates Now Available';
        } else {
            emailContent = RESCHEDULE_DENIED_TEMPLATE
                .replace('{firstName}', user.firstName)
                .replace('{rescheduleRemarks}', formData.rescheduleRemarks);

            subject = 'Reschedule Request Denied';
        }

        await axios.post('/api/email/emailUser', {
            email: user.email,
            subject,
            html: emailContent 
        });

        if (formData.rescheduleStatus === 'approved') {
            const rescheduleRes = await fetch(`/api/user/updateUserReschedule/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rescheduledDate: formattedDates }),
            });
            const rescheduleData = await rescheduleRes.json();
            
            if (!rescheduleRes.ok) {
                console.error('Failed to update reschedule:', rescheduleData.message);
                setPublishError('Failed to update reschedule.');
                return;
            }
        } if (formData.rescheduleStatus === 'denied') {
          const rescheduleRes = await fetch(`/api/user/update/${user._id}`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({reschedule: "" }),
          });
          await handleReleaseSlot(userId); 
          const rescheduleData = await rescheduleRes.json();
          
          if (!rescheduleRes.ok) {
              console.error('Failed to update reschedule:', rescheduleData.message);
              setPublishError('Failed to update reschedule.');
              return;
          }
      } else {
        await handleReleaseSlot(userId); 
      } 

        toast.success('Rescheduled Status saved successfully!');
        setScrollTop(true);
        setTimeout(() => {
            setUpdateSuccess(false);
            navigate(-1);
        }, 3000);

    } catch (error) {
        console.error('Error updating user:', error.message);
        setPublishError('An error occurred while updating.');
    }
};


const handleReleaseSlot = async (userId) => {
  try {
    const response = await axios.delete(`/api/user/releaseSlot/${userId}`);
    console.log('Slots released successfully:', response.data);
  } catch (error) {
    console.error('Error releasing slots:', error.response?.data || error.message);
  }
};


const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: '2-digit',
    year: 'numeric'
  });
};

  return (
    <div className="dashboard my-flex">
      <div className="dashboardContainer my-flex">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick pauseOnFocusLoss draggable pauseOnHover />
      <Sidebar />
        <div className="mainContent">
          <div className="bg-white rounded-lg border border-gray-200 p-10 w-full" style={{ position: 'relative' }}>
            {publishError && <Alert className="mt-5" color="failure">{publishError}</Alert>}
            {updateSuccess && (
              <Alert variant="filled" severity="success" className="alert-top">
                Update successful!
              </Alert>
            )}
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
              </div>
            ) : user ? (
              <div className="rounded-lg border border-gray-200 p-10 w-full gap-3">
                <h1 className="text-2xl font-light mb-4">Student Information</h1>
                <div className="flex items-center">
                  <img src={user.profilePicture} alt="Profile" className="w-40 h-40 rounded-full mr-4" />
                  <div>
                    <h5 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                      {`${user.firstName} ${user.middleName || ""} ${user.lastName}`}
                    </h5>
                    <p className="font-normal text-gray-700 dark:text-gray-400">
                      Student Number: {user.username}
                    </p>
                    <p className="font-normal text-gray-700 dark:text-gray-400">
                      {`${user.college} | ${user.yearLevel} - ${user.degreeProgram} `}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div>User not found.</div>
            )}
            <form className="py-10 flex flex-col gap-2" onSubmit={handleSubmit}>
              <Card className="bg-gradient-to-r from-cyan-500 to-blue-500">
                <div className="text-white">
                  <h2 className="text-lg font-medium">Current Schedule</h2>
                  <p className="text-2xl font-bold mt-1">
                    {user && formatDate(user.schedule)}
                  </p>
                </div>
              </Card>

              <Card className="bg-white rounded-lg border border-gray-200 p-10 w-full">  
                <p className="font-medium text-2xl text-teal-500">Approve or Deny the Reschedule Request</p>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Status
                    </label>
                    <Select
                      id="status"
                      value={formData.rescheduleStatus || "NO ACTION"}
                      onChange={(e) => setFormData({ ...formData, rescheduleStatus: e.target.value })}
                      required
                    >
                      <option value="NO ACTION">NO ACTION</option>
                      <option value="denied">DENIED</option>
                      <option value="approved">APPROVED</option>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <p className="text-start py-3 text-lg">Add Remarks:</p>
                  <ReactQuill
                    theme="snow"
                    id="comment"
                    value={formData.rescheduleRemarks || ""}
                    placeholder="Write something..."
                    className="h-32 mb-12"
                    onChange={(value) => setFormData({ ...formData, rescheduleRemarks: value })}
                  />
                </div>

                {loadingDates ? (
                  <div className="flex justify-center items-center py-8">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-blue-500"></div>
                  </div>
                ) : (
                  <AvailableDates
                    availableDates={availableDates}      
                    remainingSlots={remainingSlots}         
                  />
                )}

                <Button type="submit" onClick={handleSubmit} className="w-full text-3xl bg-green-500 text-white hover:bg-green-600 py-2 rounded-md">
                  SAVE 
                </Button>
              </Card>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RescheduleStatus;