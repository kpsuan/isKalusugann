import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../../../SideBar Section/Sidebar";
import Top from "../../../Profile/Components/Header";
import { Card, Alert, Label, Select } from "flowbite-react";
import ProgressBar from "./ProgressBar";
import Datepicker from "./Datepicker";
import "./schedApp.css";
import { useSelector } from 'react-redux';
import axios from "axios";

const AppointmentScheduler = () => {
  const [date, setDate] = useState("");
  
  const [step, setStep] = useState(1);
  const { currentUser } = useSelector((state) => state.user);
  
  const [selectedSlot, setSelectedSlot] = useState("");
  const [userDetails, setUserDetails] = useState({
    service: "",
    date: "",
    name: "",
    phone: "",
    formattedDate: "", // Add this to store formatted date string
    category: "uncategorized" // You can modify this based on user input
  });
  

  // Pre-fill form fields if currentUser exists
  useEffect(() => {
    if (currentUser) {
      setUserDetails((prevDetails) => ({
        ...prevDetails,
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
      }));
    }
  }, [currentUser]);

  const navigate = useNavigate();

  const handleDateChange = (selectedDate, selectedSlot) => {
    setDate(selectedDate);
    setSelectedSlot(selectedSlot);
    const formattedDate = selectedDate
      ? selectedDate.format('MMMM D, YYYY')
      : '';
    const formattedSlot = selectedSlot ? selectedSlot : '';
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      date: selectedDate,
      slot: selectedSlot,
      formattedDate: `${formattedDate} ${formattedSlot}`, // Combine date and slot for display
    }));
  };
  
  const handleServiceChange = (event) => {
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      service: event.target.value,
    }));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleNext = async () => {
    if (step === 1) {
      if (!userDetails.service || !userDetails.date) {
        alert("Please select a service and date to continue.");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!userDetails.firstName || !userDetails.lastName || !userDetails.phone) {
        alert("Please fill in your name and contact number.");
        return;
      }
  
      // Call handleSubmit when confirming the booking
      try {
        await handleSubmit();
        alert("Appointment successfully booked!");
        navigate("/confirmation"); // Navigate to a confirmation page
      } catch (error) {
        console.error("Error during booking:", error);
        alert("Failed to book appointment. Please try again.");
      }
    }
  };
  
  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axios.post('/api/appointments/create', {
        userId: currentUser?.id, // Ensure user ID is available
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        date: userDetails.date,
        timeSlot: selectedSlot,
        service: userDetails.service,
        category: userDetails.category,
        phoneNumber: userDetails.phone

      });
  
      if (response.status === 201) {
        console.log("Appointment created:", response.data);
        return response.data; // Return data for further use if needed
      } else {
        throw new Error("Unexpected response from server.");
      }
    } catch (error) {
      console.error("Error creating appointment:", error);
      if (error.response) {
        console.error("Error details:", error.response.data); // This will give you more details on the error
      }
      throw error; 
    }
  };
  
  return (
    <div className="dashboard my-flex">
      <div className="dashboardContainer my-flex">
        <Sidebar />
        <div className="mainContent">
          <div className="rounded-lg overflow-hidden bg-gradient-to-r from-blue-500 to-teal-400 p-8 mb-6">
            <h1 className="text-4xl font-light text-white mb-2">
              Book a Dental Appointment
            </h1>
            <p className="text-white/90">
              Schedule dental appointments with ease
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= s ? "bg-blue-500 text-white" : "bg-gray-200"}`}
                >
                  {s}
                </div>
                {s < 3 && (
                  <div
                    className={`w-24 h-1 mx-2 ${step >= s + 1 ? "bg-blue-500" : "bg-gray-200"}`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Alert */}
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-8 rounded">
            <p className="text-amber-700">
              Please be advised that your chosen time slot is reserved for
              <span className="font-medium"> 30 minutes</span>.
            </p>
          </div>

          {/* Step 1: Service and Date Selection */}
          {step === 1 && (
            <div className="">
              <div className="mb-8 w-3/4">
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Select service:
                </label>
                <select
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                  onChange={handleServiceChange}
                >
                  <option value="">Select a service</option>
                  <option value="Dental Consultation/Check-up">
                    Dental Consultation/Check-up
                  </option>
                  <option value="Cleaning">Cleaning</option>
                  <option value="Dental Fillings (Pasta ng ngipin)">
                    Dental Fillings (Pasta ng ngipin)
                  </option>
                  <option value="Tooth Extraction">Tooth Extraction</option>
                </select>
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2">
                  Pick date and time:
                </label>
                <p className="text-sm text-emerald-600 mb-4">
                  Earliest available appointment:
                  <span className="font-semibold"> 20 August 2024</span>
                </p>

                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                  <Datepicker
                    onDateChange={handleDateChange}
                    selectedDate={date}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Contact Details and Booking Summary */}
          {step === 2 && (
            <div className="grid grid-cols-2 gap-8">
              {/* Left Column - Contact Details */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h2 className="text-xl font-semibold mb-6">Contact Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={userDetails.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={userDetails.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Contact Number
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={userDetails.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your contact number"
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Booking Summary */}
              <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                <h2 className="text-xl font-semibold mb-6">Booking Summary</h2>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600">Selected Service</p>
                    <p className="font-medium">{userDetails.service}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Appointment Date & Time</p>
                    <p className="font-medium"> {userDetails.formattedDate || "No date and slot selected yet"}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-medium">60 minutes</p>
                  </div>
                  <div className="pt-4 border-t border-gray-200">
                    <p className="text-sm text-gray-600">Note</p>
                    <p className="text-sm text-gray-500">
                      Please arrive 10 minutes before your scheduled appointment time.
                      Bring any relevant medical records or x-rays if available.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-8 flex space-x-4">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="px-6 py-2 bg-gray-500 text-white rounded-md"
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-blue-500 text-white rounded-md"
            >
              {step === 1 ? "Next" : "Confirm Booking"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentScheduler;
