import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';

const AnnualProcess = () => {
    const navigate = useNavigate();
    const { currentUser } = useSelector((state) => state.user);
    const [loading, setLoading] = useState(false);

    const handleGetStarted = async () => {
        setLoading(true);  
        try {
          const response = await fetch('/api/queue/add-to-queue', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              studentId: currentUser._id, 
              studentNumber: currentUser.username,
              firstName: currentUser.firstName, 
              lastName: currentUser.lastName, 
              yearLevel: currentUser.yearLevel, 
              college: currentUser.college, 
              degreeProgram: currentUser.degreeProgram, 
              step: 'General PE', isPriority: false }),
          });
          
          if (!response.ok) {
            throw new Error('Failed to add to queue.');
          }
          
          const data = await response.json();
          toast.success(`You have been added to the queue. Your queue number is ${data.queueNumber}`);
          navigate('/annualpe-process');
        } catch (error) {
          console.error(error);
          toast.error('Failed to add to queue. Please try again.');
        } finally {
          setLoading(false); 
        }
      };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
            <ToastContainer />
            <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full space-y-6">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-green-800 mb-4">
                        Hello, {currentUser.firstName}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        Welcome to UPV Annual PE. To get started, click the button below to generate your Queue Number.
                    </p>
                </div>

                <button
                    onClick={handleGetStarted}
                    disabled={loading}
                    className={`w-full py-3 rounded-lg font-bold uppercase tracking-wider transition-all duration-300
                        ${loading ? 'bg-gray-400 text-gray-600' : 'bg-green-600 text-white hover:bg-green-700 shadow-md'}
                    `}
                >
                    {loading ? 'Generating...' : 'Get Started'}
                </button>
            </div>
        </div>
    );
};

export default AnnualProcess;
