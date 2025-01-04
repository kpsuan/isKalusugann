import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Home, FileText, Calendar, Bell, User, Settings, HelpCircle, ChevronDown } from 'lucide-react';
import { useSelector } from 'react-redux';
import logo from '../../../assets/logo1.png'


const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isAnnualPEOpen, setIsAnnualPEOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className={`transition-all duration-300 bg-white shadow-md h-screen 
      ${isCollapsed ? 'w-20' : 'w-72'} relative`}>
      
      {/* Collapse Button */}
      <button 
        onClick={toggleCollapse}
        className="absolute -right-3 top-8 bg-white rounded-full p-1.5 shadow-md"
      >
        {isCollapsed ? 
          <ChevronRight className="w-4 h-4 text-gray-600" /> : 
          <ChevronLeft className="w-4 h-4 text-gray-600" />
        }
      </button>

      {/* Logo */}
      <div className="p-6 mt-2">
        <img 
          src={logo}
          alt="Logo"
          className={`transition-all duration-300 ${isCollapsed ? 'w-8' : 'w-28'}`}
        />
      </div>

      {/* Navigation */}
      <div className="px-4">
        <div className="text-sm font-semibold text-gray-600 mb-4">
          {!isCollapsed && 'QUICK MENU'}
        </div>

        <nav className="space-y-2">
          {/* Home */}
          <a href="/dashboard" className="flex items-center px-4 py-2.5 text-gray-600 hover:bg-blue-50 rounded-lg transition-colors">
            <Home className="w-5 h-5" />
            {!isCollapsed && <span className="ml-3">Home</span>}
          </a>

          {/* Documents */}
          <a href={currentUser.isAdmin ? '/documents' : '/docsuser'} 
            className="flex items-center px-4 py-2.5 text-gray-600 hover:bg-blue-50 rounded-lg transition-colors">
            <FileText className="w-5 h-5" />
            {!isCollapsed && (
              <span className="ml-3">
                {currentUser.isAdmin ? 'Documents' : 'Documents'}
              </span>
            )}
          </a>

          {/* Annual PE Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsAnnualPEOpen(!isAnnualPEOpen)}
              className="w-full flex items-center px-4 py-2.5 text-gray-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              <Calendar className="w-5 h-5" />
              {!isCollapsed && (
                <>
                  <span className="ml-3">Annual PE</span>
                  <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${isAnnualPEOpen ? 'rotate-180' : ''}`} />
                </>
              )}
            </button>
            
            {!isCollapsed && isAnnualPEOpen && (
              <div className="pl-11 mt-1 space-y-2">
                <a href={currentUser.isAdmin ? '/adminHome' : '/annualhome'} 
                  className="block py-2 text-sm text-gray-600 hover:text-blue-600">
                  {currentUser.isAdmin ? 'Manage PE' : 'View PE'}
                </a>
                <a href="/manageInPerson" className="block py-2 text-sm text-gray-600 hover:text-blue-600">
                  View Schedule
                </a>
                <a href="/manage-online" className="block py-2 text-sm text-gray-600 hover:text-blue-600">
                  View Submissions
                </a>
              </div>
            )}
          </div>

          {/* Announcements */}
          <a href="/announcement" className="flex items-center px-4 py-2.5 text-gray-600 hover:bg-blue-50 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            {!isCollapsed && (
              <span className="ml-3">
                {currentUser.isAdmin ? 'Announcements' : 'Announcements'}
              </span>
            )}
          </a>

          {/* Profile */}
          <a href="/my-Profile" className="flex items-center px-4 py-2.5 text-gray-600 hover:bg-blue-50 rounded-lg transition-colors">
            <User className="w-5 h-5" />
            {!isCollapsed && <span className="ml-3">My Profile</span>}
          </a>
        </nav>

        {/* Settings Section */}
        <div className="mt-8">
          <div className="text-sm font-semibold text-gray-600 mb-4">
            {!isCollapsed && 'SETTINGS'}
          </div>
          <nav className="space-y-2">
            <a href="#" className="flex items-center px-4 py-2.5 text-gray-600 hover:bg-blue-50 rounded-lg transition-colors">
              <Settings className="w-5 h-5" />
              {!isCollapsed && <span className="ml-3">Account</span>}
            </a>
          </nav>
        </div>

        {/* Help Card */}
        {!isCollapsed && (
          <div className="mt-8 bg-blue-50 rounded-lg p-4 relative">
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <HelpCircle className="w-8 h-8 text-blue-500 bg-white rounded-full p-1" />
            </div>
            <div className="pt-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-2">Help Center</h3>
              <p className="text-xs text-gray-600 mb-3">
                Having trouble? Contact us for assistance with the UPV-HSU Portal.
              </p>
              <button className="w-full bg-blue-500 text-white text-sm rounded-lg py-2 hover:bg-blue-600 transition-colors">
                Go to help center
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;