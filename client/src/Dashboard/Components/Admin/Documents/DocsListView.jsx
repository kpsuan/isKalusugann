import React, { useEffect, useState } from 'react';
import { 
  Alert, 
  Button, 
  Modal, 
  Table,
  Card,
  Spinner,
  Badge
} from 'flowbite-react';
import { 
  HiOutlineExclamationCircle,
  HiOutlineDocument,
  HiOutlineTrash,
  HiOutlineExternalLink,
  HiOutlineDocumentDownload,
  HiOutlineClock
} from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast, ToastContainer } from 'react-toastify';


const DashDocuments = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userDocs, setUserDocs] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [docsIdToDelete, setDocsIdToDelete] = useState(null);
  const [loading, setLoading] = useState(true);

  const getCategoryBadge = (category) => {
    const categories = {
      'medical': 'success',
      'permits': 'warning',
      'General': 'gray',
      'Urgent': 'failure'
    };

    return (
      <Badge color={categories[category] || 'info'} size="md">
        {category}
      </Badge>
    );
  };

  const fetchDocs = async () => {
    try {
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser.isAdmin) {
      fetchDocs();
    }
  }, [currentUser._id]);

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
        toast.success("Documents successfully deleted!")
        fetchDocs();
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Unable to delete document!")
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner size="xl" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <ToastContainer className="z-50" />
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
             
              Document Management
            </h2>
            <p className="text-gray-600 mt-1">
              Manage and track all uploaded documents
            </p>
          </div>
          
        </div>

        {currentUser.isAdmin && userDocs.length > 0 ? (
          <div className="overflow-x-auto">
            <Table hoverable className="shadow-sm z-10 relative bg-slate">
              <Table.Head>
                <Table.HeadCell className="bg-gray-50">Document Title</Table.HeadCell>
                <Table.HeadCell className="bg-gray-50">Category</Table.HeadCell>
                <Table.HeadCell className="bg-gray-50">Last Updated</Table.HeadCell>
                <Table.HeadCell className="bg-gray-50">Actions</Table.HeadCell>
              </Table.Head>
              <Table.Body className="divide-y">
                {userDocs.map((doc) => (
                  <Table.Row 
                    key={doc._id}
                    className="bg-white hover:bg-gray-50 transition-colors"
                  >
                    <Table.Cell className="font-medium">
                      <Link 
                        to={doc.content} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
                      >
                        <HiOutlineDocument className="h-5 w-5" />
                        {doc.title}
                        <HiOutlineExternalLink className="h-4 w-4" />
                      </Link>
                    </Table.Cell>
                    <Table.Cell>
                      {getCategoryBadge(doc.category)}
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex items-center gap-1 text-gray-600">
                        <HiOutlineClock className="h-4 w-4" />
                        {new Date(doc.updatedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </Table.Cell>
                    <Table.Cell>
                      <div className="flex gap-2">
                        <Button 
                          size="md" 
                          color="white"
                          onClick={() => {
                            setShowModal(true);
                            setDocsIdToDelete(doc._id);
                          }}
                        >
                          <HiOutlineTrash className="h-4 w-4" />
                        </Button>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>

            {showMore && (
              <div className="flex justify-center mt-4">
                <Button 
                  gradientDuoTone="cyanToBlue"
                  size="sm"
                  onClick={handleShowMore}
                >
                  Load More Documents
                </Button>
              </div>
            )}
          </div>
        ) : (
          <Alert color="info" className="mt-4">
            <span className="font-medium">No documents found!</span> Upload some documents to get started.
          </Alert>
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

export default DashDocuments;