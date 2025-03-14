import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../../SideBar Section/Sidebar';
import { LoaderCircle, UserRound, Clock } from 'lucide-react';
import {FaGraduationCap} from 'react-icons/fa';

const DoctorQueue = () => {
  const [studentsInQueue, setStudentsInQueue] = useState([]);
  const [currentStep, setCurrentStep] = useState('Doctor');
  const [loading, setLoading] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);  
  const [isPriorityModalOpen, setIsPriorityModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

  useEffect(() => {
    fetchQueue();

    const intervalId = setInterval(fetchQueue, 10000);

    return () => clearInterval(intervalId);
  }, [currentStep]);

  const fetchQueue = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/queue/get-students', {
        params: { step: currentStep },
      });
      setStudentsInQueue(response.data.students);
      setCurrentStudent(response.data.students[0] || null);
    } catch (error) {
      console.error('Error fetching queue data:', error);
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
        setIsPriorityModalOpen(false)
      }
    } catch (error) {
      console.error('Error making student priority:', error);
      toast.error('Error making student priority');
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async (studentId) => {
    try {
      setIsCompleteModalOpen(false);
      setLoading(true);
      const response = await axios.post('/api/queue/complete-step', {
        studentId,
        currentStep,
      });
  
      toast.success(response.data.message);
      setLoading(false);
      fetchQueue();
    } catch (error) {
      console.error('Error completing step:', error);
      toast.error(error.response?.data?.error || 'Failed to complete student.');
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
              <div className=" bg-gradient-to-r from-cyan-700 to-blue-500 rounded-lg border border-gray-200 p-10 w-full">
                <div className="text-5xl font-bold  text-white mb-4">Doctors Consultation Queue</div>
                <p className="font-light text-lg my-8 text-white">
                Step 3: Students in queue for Doctor consultation.
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
                        onClick={() => 
                          {
                            setSelectedUserId(currentStudent.studentId);
                            setIsCompleteModalOpen(true);}}
                        disabled={loading}
                        className="bg-green-600 text-white hover:bg-green-700 px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                      >
                        {loading ? (
                          <>
                            <LoaderCircle className="animate-spin" size={20} />
                            Processing...
                          </>
                        ) : (
                          'Complete Annual PE'
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
                               onClick={() => 
                                {
                                  setSelectedUserId(student.studentId);
                                  setIsPriorityModalOpen(true);}}
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
      {/* Make Student Priority Confirmation Modal */}
              {isPriorityModalOpen && (
                                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mx-auto mb-4">
                                        <FaGraduationCap className="w-6 h-6 text-green-600" />
                                      </div>
                                      
                                      <h3 className="text-lg font-medium text-gray-900 text-center mb-2">Prioritize Student</h3>
                                      <p className="text-sm text-gray-500 text-center mb-4">
                                        Are you sure you want to prioritize student? Action cannot be undone.
                                      </p>
                                      
                                      <div className="flex justify-center space-x-3 mt-4">
                                          <button
                                          onClick={() => setIsPriorityModalOpen(false)}
                                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                                          >
                                          Cancel
                                          </button>
                                          <button
                                          onClick={() => handleMakePriority(selectedUserId)}
                                          className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-red-700"
                                          >
                                          Yes, Prioritize
                                          </button>
                                      </div>
                                    </div>
                                  </div>
              )}
      
      {/* Make Student Priority Confirmation Modal */}
      {isCompleteModalOpen && (
                                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
                                      <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mx-auto mb-4">
                                        <FaGraduationCap className="w-6 h-6 text-green-600" />
                                      </div>
                                      
                                      <h3 className="text-lg font-medium text-gray-900 text-center mb-2">Complete Student</h3>
                                      <p className="text-sm text-gray-500 text-center mb-4">
                                        Are you sure you want to complete student from queue? Action cannot be undone.
                                      </p>
                                      
                                      <div className="flex justify-center space-x-3 mt-4">
                                          <button
                                          onClick={() => setIsCompleteModalOpen(false)}
                                          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                                          >
                                          Cancel
                                          </button>
                                          <button
                                          disabled={loading}

                                          onClick={() => handleComplete(selectedUserId)}
                                          className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-lg hover:bg-green-700"
                                          >
                                          Complete
                                          </button>
                                      </div>
                                    </div>                          

                                  </div>
              )}
    </div>
  );
};

export default DoctorQueue;