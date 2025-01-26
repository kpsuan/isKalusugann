import Sidebar from "../../SideBar Section/Sidebar";
import Top from "../../Profile/Components/Header";
import "../../Annual/annual.css";
import { Alert, Button, Modal } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';

const DashDocs = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userDocs, setUserDocs] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [docsIdToDelete, setDocsIdToDelete] = useState(null);

  // Fetch documents
  const fetchDocs = async () => {
    try {
      const res = await fetch(`/api/docs/getdocuments?userId=${currentUser._id}`);
      const data = await res.json();
      if (res.ok) {
        setUserDocs(data.docs);
        if (data.docs.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  useEffect(() => {
    if (currentUser.isAdmin) {
      fetchDocs();
    }
  }, [currentUser._id]);

  // Handle "Load More" button click
  const handleShowMore = async () => {
    const startIndex = userDocs.length;
    try {
      const res = await fetch(
        `/api/docs/getdocuments?userId=${currentUser._id}&startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUserDocs((prev) => [...prev, ...data.docs]);
        if (data.docs.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  // Handle document deletion
  const handleDeleteDocs = async () => {
    setShowModal(false);
    try {
      const res = await fetch(
        `/api/docs/deletedocuments/${docsIdToDelete}/${currentUser._id}`, 
        {
          method: 'DELETE',
        }
      );
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        toast.success("Document deleted successfully!")
        fetchDocs();
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Unable to delete document!")

    }
  };

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      <ToastContainer className="z-50" />
      {currentUser.isAdmin && userDocs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {userDocs.map((docs) => (
              <div key={docs._id} className="bg-white dark:border-gray-700 dark:bg-gray-800 p-4 rounded-md">
                <Link to={docs.content}>
                  <img 
                    src={docs.image} 
                    alt={docs.title}
                    className="w-42 h-46 mb-2"
                  />
                </Link>
                <h3 className="text-sm font-semibold mb-2">{docs.title}</h3>
                <Link to={docs.content} target="_blank" rel="noopener noreferrer" className="block w-full mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm text-center">
                  View
                </Link>
                <button 
                  onClick={() => {
                    setShowModal(true);
                    setDocsIdToDelete(docs._id);
                  }}
                  className="block w-full mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
          {showMore && (
            <button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm py-7">Load more</button>
          )}
        </>
      ) : (
        <p>You have no docs yet!</p>
      )}
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
                                  Delete Post
                                </h3>
                                <div className="mt-2">
                                  <p className="text-sm text-gray-500">
                                    Are you sure you want to delete this post? This action cannot be undone.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                            <button
                              type="button"
                              onClick={handleDeleteDocs}
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

export default DashDocs;
