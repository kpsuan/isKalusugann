import React, { useState } from 'react';
import { HiOutlinePlusCircle, HiOutlineX, HiOutlineUser, HiOutlineMail, HiOutlineLockClosed, HiOutlineIdentification, HiOutlineUserGroup } from 'react-icons/hi';
import { toast, ToastContainer } from 'react-toastify';
import { useSelector } from 'react-redux';

const AddUserModal = ({ isOpen, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    role: 'Admin',
    licenseNumber: '',
    isAdmin: true,
    isSuperAdmin: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { currentUser } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleRoleChange = (e) => {
    const selectedRole = e.target.value;
    setFormData((prevData) => ({
      ...prevData,
      role: selectedRole,
      isSuperAdmin: selectedRole === 'SuperAdmin',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
  
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
  
      if (data.success === false) {
        toast.error('Unable to add user');
      } else {
        onAdd(data);
        toast.success('User added successfully', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
        
        onClose();
        setTimeout(() => window.location.reload(), 1000);
        
        //Log activity 

        const now = new Date(); // Get current timestamp
     
        const approvalLog = {
          modifiedBy: `${currentUser.firstName} ${currentUser.lastName}`,
          role: currentUser.isSuperAdmin ? "superadmin" : currentUser.role || "user",
          approvedAt: now.toISOString(), 
          userId: currentUser._id, 
          addedUser: {
            id: data.user?._id, // ID of the new user
            firstName: data.user?.firstName,
            lastName: data.user?.lastName,
            email: data.user?.email,
            username: data.user?.username,
            role: data.user?.role,
          }
        };
        
        try {
          const logResponse = await fetch("/api/activity/log", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: currentUser?._id, 
              action: `${currentUser.role} created an admin account`,
              details: approvalLog,
            }),
          });
        
          const logData = await logResponse.json();
          
          if (!logResponse.ok) {
            throw new Error(`Activity log failed: ${logData.error || "Unknown error"}`);
          }
        
          console.log("Activity log success:", logData);
        } catch (error) {
          console.error("Error logging activity:", error);
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };
  

  if (!isOpen) return null;

  return (
    <>
    <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
          style={{ zIndex: 9999 }} /><div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 ">

              <div className="flex items-center justify-center min-h-screen p-4">
                  <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all">
                      {/* Header Section */}
                      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl p-6">
                          <div className="flex justify-between items-center">
                              <h2 className="text-2xl font-bold text-white">Add New Admin</h2>
                              <button
                                  onClick={onClose}
                                  className="text-white hover:bg-blue-700 rounded-full p-2 transition-colors"
                              >
                                  <HiOutlineX className="w-6 h-6" />
                              </button>
                          </div>
                          <p className="text-blue-100 mt-2">Enter the details for the new user account</p>
                      </div>

                      {/* Form Section */}
                      <form onSubmit={handleSubmit} className="p-6">
                          <div className="space-y-4">
                              {/* Name Fields */}
                              <div className="flex gap-4">
                                  <div className="flex-1">
                                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                                      <div className="relative">
                                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                              <HiOutlineUser className="h-5 w-5 text-gray-400" />
                                          </div>
                                          <input
                                              type="text"
                                              id="firstName"
                                              placeholder="John"
                                              className="pl-10 w-full bg-gray-50 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                              onChange={handleChange} />
                                      </div>
                                  </div>
                                  <div className="flex-1">
                                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                                      <div className="relative">
                                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                              <HiOutlineUser className="h-5 w-5 text-gray-400" />
                                          </div>
                                          <input
                                              type="text"
                                              id="lastName"
                                              placeholder="Doe"
                                              className="pl-10 w-full bg-gray-50 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                              onChange={handleChange} />
                                      </div>
                                  </div>
                              </div>

                              {/* Email Field */}
                              <div>
                                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                  <div className="relative">
                                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                          <HiOutlineMail className="h-5 w-5 text-gray-400" />
                                      </div>
                                      <input
                                          type="email"
                                          id="email"
                                          placeholder="john@example.com"
                                          className="pl-10 w-full bg-gray-50 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                          onChange={handleChange} />
                                  </div>
                              </div>

                              {/* Password Field */}
                              <div>
                                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                  <div className="relative">
                                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                          <HiOutlineLockClosed className="h-5 w-5 text-gray-400" />
                                      </div>
                                      <input
                                          type="password"
                                          id="password"
                                          placeholder="••••••••"
                                          className="pl-10 w-full bg-gray-50 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                          onChange={handleChange} />
                                  </div>
                              </div>
                              

                              <div className="space-y-2">
                                  <div className="flex gap-4">

                                      <div className="flex-1">
                                          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                                          <div className="relative">
                                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                  <HiOutlineIdentification className="h-5 w-5 text-gray-400" />
                                              </div>
                                              <input
                                                  type="text"
                                                  id="username"
                                                  placeholder="johndoe123"
                                                  className="pl-10 w-full bg-gray-50 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                  onChange={handleChange} />
                                          </div>
                                      </div>
                                      {/* Role Selection */}
                                      <div>
                                          <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                          <div className="relative">
                                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                  <HiOutlineUserGroup className="h-5 w-5 text-gray-400" />
                                              </div>
                                              <select
                                                  id="role"
                                                  className="pl-10 w-full bg-gray-50 border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                                  value={formData.role}
                                                  onChange={handleRoleChange}
                                              >
                                                  <option value="Admin">Staff/Admin</option>
                                                  <option value="SuperAdmin">Super Admin</option>
                                                  <option value="Doctor">Doctor</option>
                                                  <option value="Dentist">Dentist</option>

                                              </select>
                                          </div>
                                      </div>
                                  </div>
                              </div>
                          </div>

                          {error && (
                              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                  <p className="text-red-600 text-sm">{error}</p>
                              </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex justify-end space-x-3 mt-8">
                              <button
                                  type="button"
                                  onClick={onClose}
                                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
                              >
                                  Cancel
                              </button>
                              <button
                                  type="submit"
                                  disabled={loading}
                                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-50 flex items-center gap-2"
                              >
                                  {loading ? (
                                      <>
                                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                          </svg>
                                          Creating...
                                      </>
                                  ) : (
                                      <>
                                          <HiOutlinePlusCircle className="w-5 h-5" />
                                          Create User
                                      </>
                                  )}
                              </button>
                          </div>
                      </form>
                  </div>
              </div>
          </div></>
  );
};

export default AddUserModal;