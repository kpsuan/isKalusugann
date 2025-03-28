import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { HiOutlineExclamationCircle, HiOutlineCalendar, HiOutlinePencil, HiOutlineTrash, HiOutlineEye, HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";
import { toast, ToastContainer } from 'react-toastify';
import { useDispatch } from 'react-redux';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOut,
} from '../../../../redux/user/userSlice';

const AllPersonnel = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(9); // Keep this constant
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(false); // Loading state
  const [users, setUsers] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [error, setError] = useState(null); // Error state
 
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true); 
      setError(null); 
      try {
        const startIndex = (currentPage - 1) * limit;
        let url = `/api/user/getadmins?startIndex=${startIndex}&limit=${limit}`;
        if (filter) {
          url += `&searchQuery=${encodeURIComponent(filter)}`;        
        }
        
        
        const res = await fetch(url);
        const data = await res.json();
        if (res.ok) {
          setUsers(data.users);
          setTotalUsers(data.totalUsers);
          
        } else {
          setError(data.message || "Failed to fetch users."); // Set error message
        }
      } catch (error) {
        setError("An error occurred while fetching users."); // Handle fetch error
      } finally {
        setLoading(false); // Reset loading state
      }
    };

    if (currentUser.isAdmin) {
      fetchUsers();
    }
  }, [currentUser._id, filter, currentPage, limit]);


  
  const handleFilterChange = (event) => {
    setFilter(event.target.value);
    setCurrentPage(1);
  };

  // Pagination handlers
  const totalPages = Math.ceil(totalUsers / limit);
  
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const handlePageClick = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPageButtons = 5; // Show maximum 5 page buttons at a time
    
    // Calculate start and end page numbers to display
    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = startPage + maxPageButtons - 1;
    
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const handleDeleteAccount = async (userId) => {
    try {
        dispatch(deleteUserStart());

        // 🔍 Find the user before deleting (from state)
        const userToDelete = users.find(user => user._id === userId);
        if (!userToDelete) {
            toast.error("User not found.");
            return;
        }

        const res = await fetch(`/api/user/delete/${userId}`, {
            method: 'DELETE',
        });

        const data = await res.json();
        if (!res.ok) {
            dispatch(deleteUserFailure(data));
            toast.error(data.message || 'Failed to delete user');
            return;
        }

        // 📝 Log activity with deleted user's details
        const now = new Date();
        const approvalLog = {
            modifiedBy: `${currentUser.firstName} ${currentUser.lastName}`,
            role: currentUser.isSuperAdmin ? "superadmin" : currentUser.role || "user",
            approvedAt: now.toISOString(),
            userId: currentUser._id,
            deletedUser: {  // 👈 Store deleted user details
                id: userToDelete._id,
                firstName: userToDelete.firstName,
                lastName: userToDelete.lastName,
                email: userToDelete.email,
                role: userToDelete.role || "user",
                college: userToDelete.college || "N/A",
                degreeProgram: userToDelete.degreeProgram || "N/A",
                yearLevel: userToDelete.yearLevel || "N/A",
            },
        };

        try {
            const logResponse = await fetch("/api/activity/log", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: currentUser._id,
                    action: `${currentUser.role} deleted a user account`,
                    details: approvalLog,
                }),
            });

            const logData = await logResponse.json();

            if (!logResponse.ok) {
                throw new Error(`Activity log failed: ${logData.error || "Unknown error"}`);
            }

            console.log("Activity log success:", logData);
        } catch (error) {
            console.error("Error logging activity:", error);
        }

        // ✅ Successfully deleted user
        toast.success('User deleted successfully');
        setUsers(users.filter(user => user._id !== userId));
        window.location.reload();
    } catch (error) {
        dispatch(deleteUserFailure(error));
        toast.error('An error occurred while deleting the user');
    }
};

  

  return (
    <div className="p-0">
      <ToastContainer className="z-50" />
       <div className="rounded-lg pl-0 mb-6">
          <div className="flex space-x-4">
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Search users..."
                value={filter}
                onChange={handleFilterChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-6">
            <div className="text-red-500 mb-2">
              <HiOutlineExclamationCircle className="w-8 h-8 mx-auto" />
            </div>
            <p className="text-red-500">{error}</p>
          </div>
        ) : currentUser.isAdmin && users.length > 0 ? (
          <div className="animate-fade-in">
            
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            
              <div className="overflow-x-auto">
              
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b">
                      <th className="px-6 py-4 text-sm font-semibold text-gray-600">Name</th>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-600">Role</th>
                      <th className="px-6 py-4 text-sm font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {users.map((user) => (
                      <tr 
                        key={user._id}
                        className="hover:bg-gray-50 transition-colors duration-200"
                      >
                        
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-4">
                                  {user.profilePicture ? (
                                      <img
                                      src={user.profilePicture}
                                      alt={`${user.firstName} ${user.lastName}`}
                                      className="w-12 h-12 rounded-full object-cover"
                                      />
                                  ) : (
                                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                      <span className="text-gray-500">No Image</span>
                                      </div>
                                  )}
                                  <div>
                                      <Link className="text-lg font-medium text-gray-900 hover:underline" to={`/user-profile/${user._id}`}>
                                      {`${user.firstName} ${user.lastName}`}
                                      </Link>
                                  </div>
                                  </div>
                        </td>
                      
                        <td className="px-6 py-4  justify-center items-center ">
                          <span className="inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Link                           
                              to={'/my-Profile'}
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200"
                            >
                            <HiOutlineEye className="w-5 h-5" /> 

                            </Link>
                            <button
                              onClick={() => {
                                setSelectedUserId(user._id);
                                setShowModal(true);
                              }}
                              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-full transition-all duration-200"
                            >
                              <HiOutlineTrash className="w-5 h-5" />

                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Showing <span className="font-medium">{Math.min((currentPage - 1) * limit + 1, totalUsers)}</span> to <span className="font-medium">{Math.min(currentPage * limit, totalUsers)}</span> of <span className="font-medium">{totalUsers}</span> users
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handlePrevPage}
                        disabled={currentPage === 1}
                        className={`p-2 rounded-md ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200'}`}
                      >
                        <HiOutlineChevronLeft className="w-5 h-5" />
                      </button>
                      
                      {getPageNumbers().map(pageNumber => (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageClick(pageNumber)}
                          className={`w-8 h-8 flex items-center justify-center rounded-md ${
                            currentPage === pageNumber
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      ))}
                      
                      <button
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className={`p-2 rounded-md ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-200'}`}
                      >
                        <HiOutlineChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <HiOutlineExclamationCircle className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No users found</h3>
          </div>
        )}

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowModal(false)}
            ></div>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <HiOutlineExclamationCircle className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Remove Admin Privileges
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to delete admin privileges? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={() => handleDeleteAccount(selectedUserId)}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllPersonnel;

// Add these custom animations to your CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes fade-in {
    0% {
      opacity: 0;
      transform: translateY(10px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fade-in {
    animation: fade-in 0.5s ease-out;
  }
`;
document.head.appendChild(style);