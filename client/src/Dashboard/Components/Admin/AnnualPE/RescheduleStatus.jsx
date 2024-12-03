import React, { useState, useEffect } from "react";
import Sidebar from "../../SideBar Section/Sidebar";
import { Select, Button, Modal, Card } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDispatch } from 'react-redux';
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Alert from '@mui/material/Alert';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RescheduleStatus = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = useParams();

  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [scrollTop, setScrollTop] = useState(false);
  const [loading, setLoading] = useState(true);
  const [availableDates, setAvailableDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [user, setUser] = useState(null);

  const startDate = localStorage.getItem('startDate');
  const endDate = localStorage.getItem('endDate');

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
    if (scrollTop) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
      setScrollTop(false);
    }
  }, [scrollTop]);

  useEffect(() => {
    const fetchAvailableDates = async () => {
      try {
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
          console.log("Available datess:", scheduleData.rescheduledDates);
        } else {
          console.error("Error fetching available dates:", scheduleData.message);
        }
      } catch (error) {
        console.error("Error fetching available dates:", error.message);
      }
    };

    fetchAvailableDates();
  }, [startDate, endDate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Format the dates in the desired format
    const formattedDates = availableDates.map(date => {
        const d = new Date(date);
        return d.toISOString(); // Converts the date to the desired format
    });

    // Conditional check to only include rescheduledDate if status is not denied
    const dataToSubmit = {
        ...formData,
        ...(formData.rescheduleStatus !== 'denied' && { rescheduledDate: formattedDates })
    };

    try {
        // First, update the user normally
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

        // If the reschedule status is not denied, send the additional reschedule request
        if (formData.rescheduleStatus !== 'denied') {
            const rescheduleRes = await fetch(`/api/user/updateUserReschedule/${userId}`, {  // Correct route
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ rescheduledDate: formattedDates }),  // Pass rescheduled dates only
            });
            const rescheduleData = await rescheduleRes.json();
            
            if (!rescheduleRes.ok) {
                console.error('Failed to update reschedule:', rescheduleData.message);
                setPublishError('Failed to update reschedule.');
                return;
            }
        }

        toast.success('Rescheduled Dates saved successfully!');
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



  
  
  
  

  

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="dashboard my-flex">
      <div className="dashboardContainer my-flex">
      <ToastContainer className={"z-50"} />
        <Sidebar />
        <div className="mainContent">
          <div className="bg-white rounded-lg border border-gray-200 p-10 w-full" style={{ position: 'relative' }}>
            {publishError && <Alert className="mt-5" color="failure">{publishError}</Alert>}
            {updateSuccess && (
              <Alert variant="filled" severity="success" className="alert-top">
                Update successful!
              </Alert>
            )}{user ? (
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
            </div>) 
            : (
              <div>User not found.</div>
            )}
            <form className="py-10 flex flex-col gap-2" onSubmit={handleSubmit}>
            
            <Card className="max-w-10 p-3 bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600">
            <div className="flex flex-1">
              <h1 className="text-2xl font-light text-white">Current Schedule: </h1>
              <p className="font-medium text-2xl text-white ml-2">
              {(() => {
                              const date = new Date(user.schedule);
                              const weekday = date.toLocaleString('en-US', { weekday: 'short' });
                              const month = date.toLocaleString('en-US', { month: 'short' });
                              const day = date.getDate().toString().padStart(2, '0');
                              const year = date.getFullYear();
                              return `${weekday} ${month} ${day} ${year}`;
                            })()}
                </p> 
              </div>
            </Card>
            
            <Card className="bg-white rounded-lg border border-gray-200 p-10 w-full">  
              <p className="font-medium text-2xl text-teal-500">Approve or Deny the Reschedule Request</p>
              <div className="flex flex-col gap-4 mb-4">
                <div className="flex flex-row gap-2">
                  <p className="text-center text-lg py-3">Select Status:</p>
                  <Select
                    id="status"
                    value={formData.rescheduleStatus || "NO ACTION"}
                    onChange={(e) => setFormData({ ...formData, rescheduleStatus: e.target.value })}
                    className="py-2 px-4 focus:outline-none focus:border-blue-500"
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

              <div className="flex flex-col gap-2">
                <p className="text-start text-2xl font-light py-3">3 Earliest Available Dates for Students to Select:</p>
                <div className="py-2 flex flex-row gap-2">
               
                  {availableDates.map((date, idx) => (
                    <Card href="#" className="max-w-sm p-3 bg-gradient-to-r from-green-500 to-cyan-500 hover:from-green-600 hover:to-cyan-600 m-2"><p key={idx} className="p-1 text-lg text-white">
                      {new Date(date).toDateString()}
                    </p> </Card>
                  ))}
                 
                </div>
              </div>

              

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
