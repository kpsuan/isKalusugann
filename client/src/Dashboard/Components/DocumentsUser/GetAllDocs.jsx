
import {Alert, Button, Modal, ModalBody, TextInput, Table, TableCell} from 'flowbite-react'

import { HiOutlineExclamationCircle } from 'react-icons/hi';
import {Link} from 'react-router-dom'
import { useEffect, useState  } from "react"
import { useSelector } from 'react-redux';
import { set } from 'mongoose';

const GetAllDocs = () => {
  const {currentUser} = useSelector((state) => state.user);
  const [userDocs, setUserDocs] = useState([])
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    
    const fetchDocs = async () => {
      try {
        const res = await fetch(`/api/docs/getdocuments`);
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
   
    fetchDocs();
    
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = userDocs.length;
    try {
      const res = await fetch(
        `/api/docs/getdocuments?startIndex=${startIndex}`
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


  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {userDocs.length > 0 ? (
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
    </div>
    
  );
}


export default GetAllDocs