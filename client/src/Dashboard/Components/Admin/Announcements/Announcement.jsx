import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { HiOutlineSpeakerphone, HiOutlinePencilAlt, HiOutlineClipboardList } from 'react-icons/hi';
import Sidebar from "../../SideBar Section/Sidebar";
import Top from "../../Profile/Components/Header";
import DashPost from "./DashPost";
import DashAnnouncement from "../../AnnouncementUser/DashAnnouncement";

const Announcement = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState("all"); // all, yours, create

  return (
    <div className="dashboard my-flex">
      <div className="dashboardContainer my-flex">
        <Sidebar />
        <div className="mainContent m-0 p-0">

            <div className="flex-1">
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-12 animate-gradient-x">
                <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between pb-8">
                    <div className="animate-fade-in">
                    <h1 className="text-4xl font-bold text-white mb-3">
                        Announcements Dashboard
                    </h1>
                    <p className="text-blue-100 text-lg">
                        Stay updated with the latest announcements and updates
                    </p>
                    </div>
                    {currentUser.isAdmin && (
                    <Link 
                        to="/create-post"
                        className="inline-flex items-center px-6 py-3 bg-white text-blue-600 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                    >
                        <HiOutlinePencilAlt className="w-5 h-5 mr-2" />
                        Create Announcement
                    </Link>
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
                    <HiOutlineSpeakerphone className="w-5 h-5 mr-2" />
                    All Announcements
                    </button>
                    
                    {currentUser.isAdmin && (
                    <button
                        onClick={() => setActiveTab("yours")}
                        className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeTab === "yours"
                            ? "bg-white shadow-sm text-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        <HiOutlineClipboardList className="w-5 h-5 mr-2" />
                        Your Posts
                    </button>
                    )}

                    {currentUser.isAdmin && (
                    <button
                        onClick={() => setActiveTab("create")}
                        className={`flex-1 flex items-center justify-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeTab === "create"
                            ? "bg-white shadow-sm text-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        <HiOutlinePencilAlt className="w-5 h-5 mr-2" />
                        Create New
                    </button>
                    )}
                </div>

                {/* Tab Content */}
                <div className="mt-6">
                    {activeTab === "all" && (
                    <div className="animate-fade-in">
                        <DashAnnouncement />
                    </div>
                    )}

                    {activeTab === "yours" && currentUser.isAdmin && (
                    <div className="animate-fade-in">
                        <DashPost />
                    </div>
                    )}

                    {activeTab === "create" && currentUser.isAdmin && (
                    <div className="animate-fade-in">
                        <Link to="/create-post">
                        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl p-8 border border-blue-100 hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center space-x-4 mb-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                                <HiOutlinePencilAlt className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800">
                                Create a New Announcement
                            </h3>
                            </div>
                            <p className="text-gray-600 mb-6">
                            Share important updates, news, and information with your team. Create engaging announcements that keep everyone informed and aligned.
                            </p>
                            <button className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200">
                            Start Writing
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                            </button>
                        </div>
                        </Link>
                    </div>
                    )}
                </div>
                </div>
            </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Announcement;

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