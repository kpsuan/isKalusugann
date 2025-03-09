import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { updateUserStart, updateUserSuccess, updateUserFailure } from '../../../redux/user/userSlice';
import TermsModal from './TermsModal';


const NoAnnualPe = () => {
    const [mode, setMode] = useState("");
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({});
    const [updateSuccess, setUpdateSuccess] = useState(false);
    const { currentUser } = useSelector((state) => state.user);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const dateFormatter = new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        month: 'short',
        day: '2-digit',
        year: 'numeric'
    });

    useEffect(() => {
        const fetchDates = async () => {
            try {
                const res = await fetch('/api/settings/getDates', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
    
                const data = await res.json();
                if (res.ok) {
                    setStartDate(data.startDate);
                    setEndDate(data.endDate);
                } else {
                    console.error('Error fetching dates:', data.message);
                }
            } catch (error) {
                console.error('Error fetching dates:', error.message);
            }
        };
    
        fetchDates();
    }, []);

    const handleModeSelection = (selectedMode) => {
        setMode(selectedMode);
        setFormData({ ...formData, annualPE: selectedMode });
    };

    const handleTermsClick = (e) => {
        e.preventDefault();
        setIsModalOpen(true);
    };

    const handleTermsAccept = () => {
        setTermsAccepted(true);
        setIsModalOpen(false);
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!termsAccepted) {
            return;
        }
        try {
            dispatch(updateUserStart());
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success === false) {
                dispatch(updateUserFailure(data));
                return;
            }
            dispatch(updateUserSuccess(data));
            setUpdateSuccess(true);
            if (mode === "Online") {
                navigate('/onlinePE');
            } else if (mode === "InPerson") {
                navigate(`/availableSched/${currentUser._id}`);
            }
        } catch (error) {
            dispatch(updateUserFailure(error));
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
            <div className="bg-white shadow-2xl rounded-2xl p-8 max-w-md w-full space-y-6">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-green-800 mb-4">
                        Hello, {currentUser.firstName}
                    </h2>
                    <p className="text-gray-600 mb-6">
                        You were not able to pre-enlist. Choose how you'd like to complete your annual physical examination:
                    </p>
                </div>

                <div className="space-y-4">
                    <button 
                        onClick={() => handleModeSelection('Online')}
                        className={`w-full py-4 rounded-lg transition-all duration-300 ${
                            mode === 'Online' 
                            ? 'bg-green-500 text-white scale-105 shadow-lg' 
                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                        }`}
                    >
                        <span className="block font-semibold">Online Submission</span>
                        <span className="text-sm">Complete PE documents online</span>
                    </button>

                    <button 
                        onClick={() => handleModeSelection('InPerson')}
                        className={`w-full py-4 rounded-lg transition-all duration-300 ${
                            mode === 'InPerson' 
                            ? 'bg-blue-500 text-white scale-105 shadow-lg' 
                            : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                        }`}
                    >
                        <span className="block font-semibold">In-Person Examination</span>
                        <span className="text-sm">View available schedules</span>
                    </button>
                </div>

                <div className="flex items-center">
                    <input 
                        id="terms-checkbox" 
                        type="checkbox" 
                        checked={termsAccepted}
                        onChange={() => {
                            if (!termsAccepted) {
                                setIsModalOpen(true);
                            } else {
                                setTermsAccepted(false);
                            }
                        }}
                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded-sm focus:ring-blue-500"
                    /> 
                    <label htmlFor="terms-checkbox" className="ms-2 text-sm font-medium text-gray-900">
                        I agree with the <a href="#" onClick={handleTermsClick} className="text-blue-600 hover:underline">terms and conditions</a>.
                    </label>
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={!mode || !termsAccepted}
                    className={`w-full py-3 rounded-lg font-bold uppercase tracking-wider transition-all duration-300 ${
                        mode && termsAccepted
                        ? 'bg-green-600 text-white hover:bg-green-700 shadow-md' 
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    }`}
                >
                    Save Preference
                </button>
                {startDate && endDate && (
                    <div className="text-center text-sm text-gray-500 mt-4">
                        Pre-enlistment Period: <br/> {dateFormatter.format(new Date(startDate))} - {dateFormatter.format(new Date(endDate))}
                    </div>
                )}
            </div>
            <TermsModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onAccept={handleTermsAccept}
            />
        </div>
    );
};

export default NoAnnualPe;