import React from 'react';
import { Link } from 'react-router-dom';
import UnavailableDatesManager from './UnavailableDatesManager';
import Sidebar from '../../SideBar Section/Sidebar';
import { useNavigate } from "react-router-dom";

const UnavailableDatesPage = () => {
    const navigate = useNavigate();

    const handleNavigate = () => {
        navigate("/manageInPerson", { state: { openPopup: true } });
    };

  return (
    <div className="dashboard my-flex">
        <div className="dashboardContainer my-flex">
        <Sidebar />
            <div className="mainContent">
                <div className="p-4">
                    <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Manage Unavailable Dates</h1>
                    <div className="flex space-x-4">
                        <Link 
                        to="/manageInPerson" 
                        className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-gray-800"
                        >
                        Back to In Person Page
                        </Link>
                        <button
                        onClick={handleNavigate}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
                        >
                        Schedule Generator
                        </button>

                    </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow">
                    <div className="p-6">
                        <p className="mb-6 text-gray-600">
                        Set dates that will be unavailable for scheduling. Philippine holidays are automatically included and cannot be removed.
                        Any additional dates you add here will be excluded when generating schedules.
                        </p>
                        
                        <UnavailableDatesManager />
                    </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};

export default UnavailableDatesPage;