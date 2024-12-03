import { useSelector, useDispatch } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Carousel } from 'flowbite-react';
import { toast, ToastContainer } from 'react-toastify';
import Sidebar from '../Dashboard/Components/SideBar Section/Sidebar';
import Top from '../Dashboard/Components/Profile/Components/Header';
import {
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOut,
} from '../redux/user/userSlice';
import '../App.css';

export default function UserProfile() {
  const dispatch = useDispatch();
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/user/${userId}`);
        if (!res.ok) {
          const errorData = await res.json();
          setError(errorData.message);
          return;
        }
        const userData = await res.json();
        setUser(userData);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [userId]);

  // Loading and error states
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!user) return <div>No user found</div>;

  // Handle account deletion
  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${userId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data));
        toast.error(data.message || "Failed to delete account.");
        return;
      }
      dispatch(deleteUserSuccess(data));
      toast.success("Account deleted successfully.");
    } catch (error) {
      dispatch(deleteUserFailure(error));
      toast.error("An error occurred while deleting the account.");
    }
  };

  return (
    <div className="dashboard flex">
      <div className="dashboardContainer flex">
        <Sidebar />
        <div className="mainContent">
          <Top className="text-bold" title="User Profile" />
          <div className='p-3 mx-auto mt-10'>
            <div className="flex flex-row space-x-5">
              <Card className='w-2/3 h-full'>
                <ToastContainer className={"z-50"} />
                <div className="text-2xl font-light tracking-tight p-7 text-black dark:text-white">
                  <h1 className='text-2xl font-semibold text-black'>General Information</h1>
                  <form className="flex flex-col gap-3 mt-4">
                    <div className="flex flex-row gap-3">
                      {/* User Details */}
                      {["First Name", "Middle Name", "Last Name"].map((label, index) => (
                        <div className="col flex-1" key={index}>
                          <p className="pt-2 text-sm font-medium dark:text-white mb-2">{label}:</p>
                          <p className='w-full border border-gray-300 placeholder-gray-400 shadow-sm rounded-md'>
                            {user[label.toLowerCase().replace(' ', '')] || label}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-row gap-3">
                      {/* More User Details */}
                      {["Birthday", "Email", "Student Number"].map((label, index) => (
                        <div className="col flex-1" key={index}>
                          <p className="pt-2 text-sm font-medium dark:text-white mb-2">{label}:</p>
                          <p className='w-full border border-gray-300 placeholder-gray-400 shadow-sm rounded-md'>
                            {user[label.toLowerCase().replace(' ', '')] || label}
                          </p>
                        </div>
                      ))}
                    </div>

                    <h1 className='text-2xl mt-5 font-semibold'>Education</h1>
                    <div className="flex flex-row gap-2">
                      <div className='space-y-6 w-1/2'>
                        {/* Degree Level */}
                        <div className="mt-1">
                          <label className="block text-sm font-medium text-gray-700 pb-2">Degree Level</label>
                          <p className='w-full border border-gray-300 placeholder-gray-400 shadow-sm rounded-md'>
                            {user.degreeLevel || "Degree Level"}
                          </p>
                        </div>
                      </div>

                      {/* Year Level */}
                      <div className="mt-1 w-1/2">
                        <label className="block text-sm font-medium text-gray-700 pb-2">Year Level</label>
                        <p className='w-full border border-gray-300 placeholder-gray-400 shadow-sm rounded-md'>
                          {user.yearLevel || "Year Level"}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-row gap-2">
                      {/* College */}
                      <div className="mt-1 w-1/2">
                        <label className="block text-sm font-medium text-gray-700 pb-2">College</label>
                        <p className='w-full border border-gray-300 placeholder-gray-400 shadow-sm rounded-md'>
                          {user.college || "College"}
                        </p>
                      </div>

                      {/* Degree Program */}
                      <div className="mt-1 w-1/2">
                        <label className="block text-sm font-medium text-gray-700 pb-2">Degree Program</label>
                        <p className='w-full border border-gray-300 placeholder-gray-400 shadow-sm rounded-md'>
                          {user.degreeProgram || "Degree Program"}
                        </p>
                      </div>
                    </div>
                  </form>
                </div>
              </Card>

              <Card className='w-1/3 h-full'>
                <div className="relative">
                  <div className="h-20 sm:h-20 xl:h-40 2xl:h-80">
                    <Carousel slide={false}>
                      <img src="https://flowbite.com/docs/images/carousel/carousel-1.svg" alt="..." />
                      <img src="https://flowbite.com/docs/images/carousel/carousel-2.svg" alt="..." />
                      <img src="https://flowbite.com/docs/images/carousel/carousel-3.svg" alt="..." />
                      <img src="https://flowbite.com/docs/images/carousel/carousel-4.svg" alt="..." />
                      <img src="https://flowbite.com/docs/images/carousel/carousel-5.svg" alt="..." />
                    </Carousel>
                  </div>

                  {/* Profile Picture overlapping the carousel */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 h-24 w-24 cursor-pointer rounded-full border-4 border-white">
                    <img src={user.profilePicture} alt="profile" className="h-full w-full rounded-full object-cover" />
                  </div>
                </div>

                <div className='flex flex-col justify-center p-1 text-center'>
                  <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {`${user.firstName} ${user.middleName || ""} ${user.lastName}`}
                  </h5>
                  <p className="font-normal text-gray-700 dark:text-gray-400">
                    Student Number: {user.username}
                  </p>
                  <p className="font-normal text-gray-700 dark:text-gray-400">
                    {`${user.college} | ${user.yearLevel} - ${user.degreeProgram}`}
                  </p>
                </div>

                <div className='flex flex-col justify-center p-3 text-center w-full'>
                  <span
                    onClick={handleDeleteAccount}
                    className='text-red-700 cursor-pointer bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded'
                  >
                    Delete Account
                  </span>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
