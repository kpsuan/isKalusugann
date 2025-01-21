import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../SideBar Section/Sidebar";
import { toast, ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux';
import axios from "axios";
import Datepicker from "./Datepicker";
import "./schedApp.css";

const AppointmentScheduler = () => {
  const [date, setDate] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState(1);
  const { currentUser } = useSelector((state) => state.user);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [userDetails, setUserDetails] = useState({
    userId: "",
    service: "",
    date: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    formattedDate: "",
    category: "uncategorized"
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      setUserDetails(prev => ({
        ...prev,
        userId: currentUser._id || "",
        firstName: currentUser.firstName || "",
        lastName: currentUser.lastName || "",
        email: currentUser.email || "",

      }));
    }
  }, [currentUser]);


  

const handleMonthChange = (month) => {
  const today = moment(); // Get the current date
  const startOfMonth = month.startOf('month');
  const endOfMonth = month.endOf('month');

  // Clear previous availability
  setAvailableSlots({});

};



  const handleDateChange = (selectedDate, selectedSlot) => {
    setDate(selectedDate);
    setSelectedSlot(selectedSlot);
    const formattedDate = selectedDate ? selectedDate.format('MMMM D, YYYY') : '';
    
    setUserDetails(prev => ({
      ...prev,
      date: selectedDate,
      slot: selectedSlot,
      formattedDate: `${formattedDate} ${selectedSlot}`,
    }));
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserDetails(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formData = {
        userId: currentUser?._id,
        firstName: userDetails.firstName,
        lastName: userDetails.lastName,
        date: userDetails.date,
        timeSlot: selectedSlot,
        service: userDetails.service,
        category: userDetails.category,
        phoneNumber: userDetails.phone,
        email: userDetails.email,
      };
      
      await axios.post("/api/appointments/create", formData);
      setStep(3); // Move to confirmation step
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create appointment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-8">
      {[1, 2, 3].map((s) => (
        <div key={s} className="flex items-center">
          <div className={`
            w-10 h-10 rounded-full flex items-center justify-center
            transition-all duration-300 text-sm font-medium
            ${step >= s 
              ? "bg-blue-600 text-white" 
              : "bg-gray-100 text-gray-400"}
          `}>
            {s}
          </div>
          {s < 3 && (
            <div className={`
              w-24 h-1 mx-2 rounded
              transition-all duration-300
              ${step > s ? "bg-blue-600" : "bg-gray-200"}
            `} />
          )}
        </div>
      ))}
    </div>
  );

  // Function to determine date class based on availability
  const getDateClassName = (date) => {
    const dateStr = date.format('YYYY-MM-DD');
    if (dateStr in availableSlots) {
        switch (availableSlots[dateStr]) {
            case 'available':
                return 'bg-green-50 hover:bg-green-100 text-green-900';
            case 'full':
            case 'unavailable':
                return 'bg-red-50 hover:bg-red-100 text-red-900 cursor-not-allowed';
            default:
                return 'bg-gray-50 hover:bg-gray-100';
        }
    }
    return 'bg-gray-50 hover:bg-gray-100';
};
 const renderStep1 = () => (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <div className="mb-8 w-1/2">
        <label className="block text-lg font-semibold text-blue-500 mb-3">
          Select Service
        </label>
        <select
          className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          value={userDetails.service}
          onChange={(e) => setUserDetails(prev => ({ ...prev, service: e.target.value }))}
        >
          <option value="">Choose a dental service</option>
          {serviceOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.value} - {option.duration} - {option.price}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-lg font-semibold text-blue-500 mb-3">
          Select Date & Time
        </label>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
        <Datepicker
          onDateChange={handleDateChange}
          selectedDate={date}
          getDateClassName={getDateClassName}
          onMonthChange={handleMonthChange}
          disabledDate={(currentDate) => currentDate.isBefore(moment().startOf('day'))}        />

          <div className="mt-4 flex items-center space-x-6 text-sm">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-100 rounded mr-2"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-red-100 rounded mr-2"></div>
              <span>No Available Slots</span>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 bg-gray-100 rounded mr-2"></div>
              <span>Not Yet Checked</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="bg-white rounded-lg shadow-sm p-8 flex flex-col h-full border-t-4 border-blue-500">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Contact Details</h2>
        <div className="space-y-5 flex-grow">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Name*
              </label>
              <input
                type="text"
                name="firstName"
                value={userDetails.firstName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Last Name*
              </label>
              <input
                type="text"
                name="lastName"
                value={userDetails.lastName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address*
            </label>
            <input
              type="email"
              name="email"
              value={userDetails.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone Number*
            </label>
            <input
              type="tel"
              name="phone"
              value={userDetails.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
              required
            />
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-4">* Required fields</p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-8 flex flex-col h-full border-t-4 border-indigo-500">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">Appointment Summary</h2>
        <div className="space-y-6 flex-grow">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg">
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Selected Service</p>
              <p className="font-medium text-gray-900">{userDetails.service || "Not selected"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Estimated Price</p>
              <p className="font-medium text-gray-900">
                {serviceOptions.find(opt => opt.value === userDetails.service)?.price || "N/A"}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-1">Date & Time</p>
              <p className="font-medium text-gray-900">{userDetails.formattedDate || "Not selected"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Duration</p>
              <p className="font-medium text-gray-900">
                {serviceOptions.find(opt => opt.value === userDetails.service)?.duration || "N/A"}
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-800 mb-3">Important Notes</p>
            <ul className="text-sm text-gray-700 space-y-2">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Please arrive 10 minutes before your appointment
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Bring any relevant medical records
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                Face mask is required
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-400 rounded-full mr-2"></span>
                24-hour cancellation policy applies
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="terms"
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              required
            />
            <span className="text-sm text-gray-600">
              I agree to the terms and conditions and confirm that all provided information is correct
            </span>
          </label>
        </div>
      </div>
    </div>
  );


  const renderStep3 = () => (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
      <div className="mb-8">
        <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Appointment Submitted!</h2>
        <p className="text-gray-600 mb-8">
          Your appointment request has been successfully submitted. Keep track of your status on our system.
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <div className="grid grid-cols-2 gap-4 text-left">
          <div>
            <p className="text-sm text-gray-500">Patient Name</p>
            <p className="font-medium text-gray-900">{`${userDetails.firstName} ${userDetails.lastName}`}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Service</p>
            <p className="font-medium text-gray-900">{userDetails.service}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date & Time</p>
            <p className="font-medium text-gray-900">{userDetails.formattedDate}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Duration</p>
            <p className="font-medium text-gray-900">60 minutes</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        <button 
          onClick={() => navigate('/dashboard')}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Go to Dashboard
        </button>
        <button 
          onClick={() => {
            setStep(1);
            setUserDetails(prev => ({
              ...prev,
              service: "",
              date: "",
              formattedDate: "",
            }));
          }}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          Book Another
        </button>
      </div>
    </div>
  );

  const serviceOptions = [
    { value: "Dental Consultation/Check-up", duration: "30 minutes", price: "₱500" },
    { value: "Cleaning", duration: "60 minutes", price: "₱1,500" },
    { value: "Dental Fillings", duration: "45 minutes", price: "₱2,000" },
    { value: "Tooth Extraction", duration: "30 minutes", price: "₱1,000" },
    { value: "Root Canal", duration: "90 minutes", price: "₱8,000" },
    { value: "Teeth Whitening", duration: "60 minutes", price: "₱5,000" }
  ];

  return (
    <div className="dashboard my-flex">
      <div className="dashboardContainer bg-gray-100 my-flex">
        <ToastContainer className="z-50" />
        <Sidebar />
        <div className="mainContent m-0 p-0 min-h-screen">
          <div className="bg-gradient-to-r  from-blue-600 via-indigo-600 to-purple-600 p-20 mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">
              Book Your Dental Appointment
            </h1>
            <p className="text-blue-100">
              Schedule your visit in just a few clicks
            </p>
          </div>

          {renderStepIndicator()}

          <div className="max-w-6xl mx-auto px-10 pb-8">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}

            {step < 3 && (
              <div className="mt-8 flex justify-end space-x-4">
                {step > 1 && (
                  <button
                    onClick={() => setStep(step - 1)}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Back
                  </button>
                )}
                <button
                  onClick={step === 1 ? () => setStep(2) : handleSubmit}
                  disabled={isSubmitting}
                  className={`
                    px-6 py-3 rounded-lg text-white transition-colors
                    ${isSubmitting 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'}
                  `}
                >
                  {isSubmitting 
                    ? 'Processing...' 
                    : step === 1 
                      ? 'Continue' 
                      : 'Confirm Booking'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppointmentScheduler;