import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../../SideBar Section/Sidebar';
import { LoaderCircle, UserRound, Clock } from 'lucide-react';

const DentalQueue = () => {
  const [studentsInQueue, setStudentsInQueue] = useState([]);
  const [currentStep, setCurrentStep] = useState('Dental');
  const [nextStep, setNextStep] = useState('Doctor');
  const [loading, setLoading] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/queue/get-students', {
        params: { step: currentStep },
      });
      setStudentsInQueue(response.data.students);
      // Assuming the first student in queue is the current one being served
      setCurrentStudent(response.data.students[0] || null);
    } catch (error) {
      console.error('Error fetching queue data:', error);
      toast.error('Failed to load queue data.');
    } finally {
      setLoading(false);
    }
  };

  const handleMoveToNextStep = async (studentId) => {
    try {
      setLoading(true);
      const response = await axios.post('/api/queue/move-to-next-step', {
        studentId,
        currentStep,
        nextStep,
      });
      toast.success(response.data.message);
      fetchQueue();
    } catch (error) {
      console.error('Error moving to next step:', error);
      toast.error(error.response?.data?.error || 'Failed to move student to the next step.');
    } finally {
      setLoading(false);
    }
  };

  const handleMakePriority = async (studentId) => {
    try {
      setLoading(true); 
      const response = await axios.post('/api/queue/make-student-priority', 
        { studentId, currentStep});
  
      if (response.status === 200) {
        toast.success(response.data.message); 
      }
    } catch (error) {
      console.error('Error making student priority:', error);
      toast.error('Error making student priority');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard my-flex">
      <div className="dashboardContainer my-flex">
        <Sidebar />
        <ToastContainer />
        <div className="mainContent m-0 p-0">
          <div className="flex-1 p-8">
            <div className="max-w-6xl mx-auto">
              {/* Header Section */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Dental Examination Queue
                </h2>
                <p className="text-gray-600">
                  Step 2: Managing student medical examinations
                </p>
              </div>

              {/* Currently Serving Section */}
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Clock size={20} />
                  Currently Serving
                </h3>
                
                {currentStudent ? (
                  <div className="bg-blue-50 rounded-lg p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="bg-blue-100 p-3 rounded-full">
                          <UserRound size={24} className="text-blue-600" />
                        </div>
                        <div>
                          <p className="text-lg font-medium text-gray-900">
                            {currentStudent.firstName} {currentStudent.lastName}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>ID: {currentStudent.studentNumber}</span>
                            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                              Queue #{currentStudent.queueNumber}
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleMoveToNextStep(currentStudent.studentId)}
                        disabled={loading}
                        className="bg-green-600 text-white hover:bg-green-700 px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {loading ? (
                          <>
                            <LoaderCircle className="animate-spin" size={20} />
                            Processing...
                          </>
                        ) : (
                          'Move to Next'
                        )}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-6 text-center">
                    <p className="text-gray-600">No student currently being served</p>
                  </div>
                )}
              </div>

              {/* Queue Status Card */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-blue-800 font-medium">Waiting Queue Status</p>
                    <p className="text-blue-600">
                      {Math.max(0, studentsInQueue.length - 1)} student(s) waiting
                    </p>
                  </div>
                  <button
                    onClick={fetchQueue}
                    className="flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors"
                    disabled={loading}
                  >
                    Refresh Queue
                    {loading && <LoaderCircle className="animate-spin" size={16} />}
                  </button>
                </div>
              </div>

              {/* Queue Table */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">#</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Student ID</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Student Name</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Queue Number</th>
                        <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {studentsInQueue.length > 1 ? (
                        studentsInQueue.slice(1).map((student, index) => (
                          <tr 
                            key={student.studentId}
                            className="hover:bg-gray-50 transition-colors"
                          >
                            <td className="px-6 py-4 text-sm text-gray-600">{index + 1}</td>
                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                              {student.studentNumber}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {student.firstName} {student.lastName}
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                                #{student.queueNumber}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <button
                                onClick={() => handleMakePriority(student.studentId)}
                                disabled={loading}
                                className="bg-green-100 text-green-700 hover:bg-green-200 px-4 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                              >
                                {loading ? (
                                  <>
                                    <LoaderCircle className="animate-spin" size={16} />
                                    Processing...
                                  </>
                                ) : (
                                  'Make Priority'
                                )}
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                            <p className="text-lg font-medium">No students in waiting queue</p>
                            <p className="text-sm">The waiting queue is currently empty</p>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DentalQueue;