import { Alert, Button, Modal, Table } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';

const DashAnnouncement = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userDocs, setUserDocs] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [docsIdToDelete, setDocsIdToDelete] = useState(null);

  // Fetch documents
  const fetchDocs = async () => {
    try {
      const res = await fetch(`/api/docs/getdocuments`);
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
      const res = await fetch(`/api/docs/getdocuments?startIndex=${startIndex}`);
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
      const res = await fetch(`/api/docs/deletedocuments/${docsIdToDelete}/${currentUser._id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        // Refresh documents after deletion
        fetchDocs();
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin && userDocs.length > 0 ? (
        <>
          <Table hoverable className='shadow-md z-10 relative'>
            <Table.Head className="bg-gray-50 dark:bg-gray-700 text-lg">
              <Table.HeadCell>Document name</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
              <Table.HeadCell>Delete</Table.HeadCell>
              <Table.HeadCell>Date updated</Table.HeadCell>
            </Table.Head>
            <Table.Body className="divide-y">
              {userDocs.map((docs) => (
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800" key={docs._id}>
                  <Table.Cell>
                    <Link to={docs.content} target="_blank" rel="noopener noreferrer" className="text-right font-medium text-gray-900 hover:underline">
                      {docs.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{docs.category}</Table.Cell>
                  <Table.Cell className="text-center">
                    <span onClick={() => {
                      setShowModal(true);
                      setDocsIdToDelete(docs._id);
                    }} className="font-medium text-red-500 hover:underline cursor-pointer">Delete</span>
                  </Table.Cell>
                  <Table.Cell>{new Date(docs.updatedAt).toLocaleDateString()}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
          {showMore && (
            <button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm py-7">Load more</button>
          )}
        </>
      ) : (
        <p>You have no docs yet!</p>
      )}

      {showModal && (
        <div className='fixed inset-0 bg-gray-900 bg-opacity-50 z-40 flex items-center justify-center'>
          <Modal
            show={showModal}
            onClose={() => setShowModal(false)}
            popup
            size='md'
            className='relative z-50 p-40'
          >
            <Modal.Header />
            <Modal.Body>
              <div className='text-center pb-10'>
                <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto' />
                <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                  Are you sure you want to delete this document?
                </h3>
                <div className='flex justify-center gap-4'>
                  <Button color='red' className='bg-red-600 text-white hover:text-white hover:bg-red-800' onClick={handleDeleteDocs}>
                    Delete
                  </Button>
                  <Button color='gray' onClick={() => setShowModal(false)}>
                    No, cancel
                  </Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default DashAnnouncement;
