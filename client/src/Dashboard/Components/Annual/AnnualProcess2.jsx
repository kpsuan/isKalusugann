import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { CheckCircle, Clock, Activity, Stethoscope } from 'lucide-react';

const AnnualProcess2 = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [stepCompletion, setStepCompletion] = useState({
        generalPE: false,
        dental: false,
        doctorCheckup: false,
    });

    const { currentUser } = useSelector((state) => state.user);

    const handleCheckboxChange = (step) => {
        setStepCompletion((prev) => ({
            ...prev,
            [step]: !prev[step],
        }));
    };

    const steps = [
        {
            id: 'generalPE',
            label: 'General Physical Examination',
            description: 'Complete basic health measurements and screenings',
            icon: Activity
        },
        {
            id: 'dental',
            label: 'Dental Check-up',
            description: 'Dental cleaning and examination',
            icon: Activity
        },
        {
            id: 'doctorCheckup',
            label: 'Doctor Consultation',
            description: 'Review results with your physician',
            icon: Stethoscope
        }
    ];

    const allStepsCompleted = Object.values(stepCompletion).every(Boolean);
    const completedSteps = Object.values(stepCompletion).filter(Boolean).length;

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-100 to-green-90 p-6">
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="text-center border-b border-gray-200 p-8 mt-8">
                    <h2 className="text-3xl font-bold text-green-900">
                        Welcome, {currentUser?.firstName || 'User'}
                    </h2>
                    <p className="text-lg text-gray-600 mt-2">
                        Annual Physical Examination Process
                    </p>
                    <div className="mt-8">
                        <div className="text-sm font-medium text-gray-500">Your Queue Number</div>
                        <div className="flex items-center justify-center gap-2 mt-2">
                            <span className="text-9xl font-bold text-green-600">1</span>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-500">Progress</span>
                            <span className="text-sm font-medium text-green-600">
                                {completedSteps} of {steps.length} completed
                            </span>
                        </div>
                        
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                                className="bg-green-600 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${(completedSteps / steps.length) * 100}%` }}
                            />
                        </div>

                        <div className="space-y-4">
                            {steps.map((step) => {
                                const StepIcon = step.icon;
                                const isCompleted = stepCompletion[step.id];
                                
                                return (
                                    <div
                                        key={step.id}
                                        className={`p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer
                                            ${isCompleted 
                                                ? 'border-green-600 bg-green-50' 
                                                : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        onClick={() => handleCheckboxChange(step.id)}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div 
                                                className={`p-2 rounded-full ${
                                                    isCompleted ? 'bg-green-600' : 'bg-gray-100'
                                                }`}
                                            >
                                                <StepIcon 
                                                    className={`w-6 h-6 ${
                                                        isCompleted ? 'text-white' : 'text-gray-400'
                                                    }`}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h3 className="font-semibold text-gray-900">
                                                        {step.label}
                                                    </h3>
                                                    <div
                                                        className={`w-6 h-6 rounded-full border transition-all duration-300 flex items-center justify-center
                                                            ${isCompleted 
                                                                ? 'bg-green-600 border-green-600' 
                                                                : 'border-gray-300'
                                                            }`}
                                                    >
                                                        {isCompleted && (
                                                            <CheckCircle className="w-4 h-4 text-white" />
                                                        )}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {step.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <button
                            onClick={() => allStepsCompleted && navigate('/nextStep')}
                            disabled={!allStepsCompleted}
                            className={`w-full mt-6 py-4 rounded-lg font-semibold text-sm transition-all duration-300
                                ${allStepsCompleted
                                    ? 'bg-green-600 text-white hover:bg-green-700'
                                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <span>{allStepsCompleted ? 'Claim Medical Certificate' : 'Complete All Steps to Continue'}</span>
                                {allStepsCompleted && <CheckCircle className="w-4 h-4" />}
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AnnualProcess2;