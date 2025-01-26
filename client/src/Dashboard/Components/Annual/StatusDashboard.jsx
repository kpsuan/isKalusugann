import React, { useState } from 'react';
import { HiUserCircle } from 'react-icons/hi';
import { MdDashboard } from 'react-icons/md';
import { BsFillFileEarmarkArrowDownFill } from 'react-icons/bs';
import { FaCheckSquare } from 'react-icons/fa';
export const StatusDashboard = ({ currentUser, userDocs, userHasChoice }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const renderStatusColor = () => {
    switch(currentUser.status) {
      case 'approved': return 'bg-emerald-100 text-emerald-800';
      case 'denied': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderTabs = () => {
    const tabs = [
      { 
        key: 'overview', 
        label: 'Overview', 
        icon: <HiUserCircle className="mr-2" />,
        content: renderOverviewTab()
      },
      ...(userHasChoice !== 'Online' ? [{
        key: 'schedule', 
        label: 'Schedule', 
        icon: <HiUserCircle className="mr-2" />,
        content: renderScheduleTab()
      }] : []),
      { 
        key: 'forms', 
        label: 'Submitted Forms', 
        icon: <MdDashboard className="mr-2" />,
        content: renderFormsTab()
      },
      { 
        key: 'reminders', 
        label: 'Reminders', 
        icon: <MdDashboard className="mr-2" />,
        content: renderRemindersTab()
      }
    ];

    return (
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                flex items-center px-3 py-2 border-b-2 font-medium text-sm
                ${activeTab === tab.key 
                  ? 'border-indigo-500 text-indigo-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
              `}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-4">
          {tabs.find(tab => tab.key === activeTab)?.content}
        </div>
      </div>
    );
  };

  const renderOverviewTab = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className={`p-4 rounded-lg shadow ${renderStatusColor()}`}>
            <h3 className="text-xl font-semibold mb-2">Status</h3>
            <p className="text-lg font-bold">
              {currentUser.status === 'approved' ? 'Approved' : 
               currentUser.status === 'denied' ? 'Denied' : 'Pending'}
            </p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-xl font-semibold mb-2">Remarks</h3>
            <p className="text-gray-600">
              {currentUser.comment 
                ? currentUser.comment.replace(/<p>/g, '').replace(/<\/p>/g, '') 
                : "No remarks"}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Medical Certificate</h3>
          {currentUser.medcert ? (
            <div className="flex flex-col items-center">
              <a 
                href={currentUser.medcert} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mb-4"
              >
                <img
                  src={currentUser.medcert}
                  alt="Medical Certificate"
                  className="max-h-64 object-contain rounded-lg"
                />
              </a>
              <a 
                href={currentUser.medcert}
                target="_blank" 
                rel="noopener noreferrer"
                className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600"
              >
                View Certificate
              </a>
            </div>
          ) : (
            <p className="text-gray-500">No medical certificate uploaded</p>
          )}
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Downloadable Forms</h2>
          <button className="text-indigo-600 hover:bg-indigo-50 px-3 py-2 rounded-md">
            View All
          </button>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {userDocs.map((doc) => (
            <div 
              key={doc._id} 
              className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
            >
              <div className="flex items-center">
                <BsFillFileEarmarkArrowDownFill className="text-2xl text-gray-500 mr-3" />
                <div>
                  <h4 className="font-semibold text-gray-800">{doc.title}</h4>
                  <p className="text-sm text-gray-500">
                    {doc.size} | {new Date(doc.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderScheduleTab = () => (
    <div className="space-y-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Appointment Schedule</h3>
        <p className="text-2xl text-gray-700">
          {currentUser.schedule
            ? new Date(currentUser.schedule).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })
            : "Schedule Not Yet Assigned"}
        </p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Requirements</h3>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-center">
            <FaCheckSquare className="mr-3 text-emerald-500" />
            Completely Filled-Out Periodic Health Examination Form
          </li>
          <li className="flex items-center">
            <FaCheckSquare className="mr-3 text-emerald-500" />
            Dental Health Record
          </li>
          <li className="flex items-center">
            <FaCheckSquare className="mr-3 text-emerald-500" />
            University ID / Form 5
          </li>
          <li className="flex items-center">
            <FaCheckSquare className="mr-3 text-emerald-500" />
            White Folder
          </li>
          <li className="flex items-center">
            <FaCheckSquare className="mr-3 text-emerald-500" />
            Request for P.E.
          </li>
        </ul>
      </div>
    </div>
  );

  const renderFormsTab = () => (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Submitted Forms</h2>
      {/* Placeholder for GetDocsUser component */}
      <p>Submitted forms will be displayed here.</p>
    </div>
  );

  const renderRemindersTab = () => (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-4">Important Reminders</h3>
        <ul className="space-y-3 text-gray-600">
          <li>Please bring all required documents to your appointment</li>
          <li>Ensure all forms are completely and accurately filled out</li>
          <li>Arrive at least 15 minutes before your scheduled time</li>
        </ul>
      </div>
    </div>
  );

  return (
    <div className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl overflow-hidden">
        {renderTabs()}
      </div>
    </div>
  );
};

export default StatusDashboard;