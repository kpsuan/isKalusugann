import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiOutlinePlusCircle, HiOutlinePencilAlt, HiOutlineClipboardList } from 'react-icons/hi';
import Sidebar from "../../SideBar Section/Sidebar";
import Top from "../../Profile/Components/Header";
import AllPersonnel from './AllPersonnel';
import AddUserModal from './AddUserModal';
import { toast, ToastContainer } from 'react-toastify';


const Personnel = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [users, setUsers] = useState([]); // Ensure this exists

  const [activeTab, setActiveTab] = useState("all"); // all, yours, create
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddUser = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]); // Update users state
  };
  return (
    <div className="dashboard my-flex">
      <div className="dashboardContainer my-flex">
        <Sidebar />
        <ToastContainer className="z-50" />
        <div className="mainContent m-0 p-0">

            <div className="flex-1">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-12 animate-gradient-x">
                <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between pb-8">
                    <div className="animate-fade-in">
                    <h1 className="text-4xl font-bold text-white mb-3">
                       Personnel
                    </h1>
                    <p className="text-blue-100 text-lg">
                       Manage and Add HSU Staff and Doctors
                    </p>
                    </div>
                    {currentUser.isAdmin && (
                     <button
                     onClick={() => setIsAddModalOpen(true)}
                     className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                     >
                     <HiOutlinePlusCircle className="w-5 h-5" />
                     Add User
                   </button>
                   
                    )}
                </div>
                </div>
            </div>
            
            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8">
                <div className="bg-white rounded-xl shadow-lg p-6 animate-slide-up">
                {/* Tabs */}
                <div className="flex space-x-1 p-1 bg-gray-50 rounded-lg mb-6">
                    <button
                    onClick={() => setActiveTab("all")}
                    className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeTab === "all"
                        ? "bg-white shadow-sm text-blue-600"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    >
                    
                 <p className='font-semibold'>Showing All HSU Staff</p> 
                    </button>
                    
                   
                </div>

                {/* Tab Content */}
                <div className="mt-6">
                    {activeTab === "all" && (
                    <div className="animate-fade-in">
                       <AllPersonnel/>
                    </div>
                    )}

                    
                </div>
                </div>
            </div>
            </div>
            {isAddModalOpen && (
              <AddUserModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onAdd={handleAddUser} // Ensure this is passed
              />
            )}
        </div>
      </div>
    </div>
  );
};

export default Personnel;

// Add these custom animations to your CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes gradient-x {
    0%, 100% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
  }
  
  .animate-gradient-x {
    background-size: 200% 200%;
    animation: gradient-x 15s ease infinite;
  }
  
  @keyframes fade-in {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }
  
  .animate-fade-in {
    animation: fade-in 0.3s ease-out;
  }
  
  @keyframes slide-up {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-slide-up {
    animation: slide-up 0.5s ease-out;
  }
`;
document.head.appendChild(style);