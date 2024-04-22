import Sidebar from "../../SideBar Section/Sidebar";
import Top from "../../Profile/Components/Header";
import "../../Annual/annual.css";
import {Alert, Button, Modal, ModalBody, TextInput, Table, TableCell} from 'flowbite-react'

import { HiOutlineExclamationCircle } from 'react-icons/hi';
import {Link} from 'react-router-dom'
import { useEffect, useState  } from "react"
import { useSelector } from 'react-redux';
import { set } from 'mongoose';

const DashDocs = () => {
  const {currentUser} = useSelector((state) => state.user);
  const [userDocs, setUserDocs] = useState([])
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [docsIdToDelete, setDocsIdToDelete] = useState(null);

  useEffect(() => {
    
    const fetchDocs = async () => {
      try {
        const res = await fetch(`/api/docs/getdocuments?userId=${currentUser._id}`);
        const data = await res.json();
        if(res.ok){
          setUserDocs(data.docs);
          if (data.docs.length < 9) {
            setShowMore(false);
          }
        }      
      } catch (error) {
        console.log(error.message)
      }
    }; 
    if (currentUser.isAdmin) {
        fetchDocs();
    }
  }, [currentUser._id]);

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

  const handleDeleteDocs = async (docsId) => {
    setShowModal(false);
    try 
      {
        const res = await fetch(
          `/api/docs/deletedocuments/${docsIdToDelete}/${currentUser._id}`, 
          {
            method: 'DELETE',
          }
        );
        const data = await res.json();
        if (!res.ok) {
          console.log(data.message);
        } else{
          setUserDocs((prev) => 
          prev.filter((docs) => docs._id !== docsIdToDelete));
        };
      } catch (error) {
        console.log(error.message);
      }
  };

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin && userDocs.length > 0 ? (
        <>
           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {userDocs.map((docs) => (
                <div key={docs._id} className="bg-white dark:border-gray-700 dark:bg-gray-800 p-4 rounded-md">
                <Link to={docs.content}>
                    <img 
                    src={docs.image} 
                    alt={docs.title}
                    className="w-full h-full object-fit mb-2 "
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
      ):(
        <p>You have no docs yet! </p>
      )}
      <Modal
        show={showModal}
        onClose={() => setShowModal(false)}
        popup
        size='md'
        
      >
        <Modal.Header />
        <Modal.Body>
          <div className='text-center'>
            <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
            <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
              Are you sure you want to delete this document?
            </h3>
            <div className='flex justify-center gap-4'>
              <Button color='failure' onClick={handleDeleteDocs}>
                Yes, I'm sure
              </Button>
              <Button color='gray' onClick={() => setShowModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      


    </div>
    
  );
}


export default DashDocs