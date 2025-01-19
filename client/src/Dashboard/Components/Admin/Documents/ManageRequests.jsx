import { useSelector } from 'react-redux';
import { useEffect, useState } from "react";
import { Card, Button, Badge, Tooltip, Table, Modal, Label, Textarea } from 'flowbite-react';
import { motion, AnimatePresence } from 'framer-motion';
import React from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { app } from '../../../../firebase';
import DocumentRequestModal from './DocumentRequestModal';

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';

import Sidebar from "../../SideBar Section/Sidebar";
import { 
    FileText, 
    ClipboardList, 
    Clock, 
    CheckCircle,
    AlertCircle,
    XCircle,
    MessageCircle,
    ChevronDown,
    ChevronUp
  } from 'lucide-react';

const ManageRequests = () => {
  const [activeTab, setActiveTab] = useState('new');
  const [recentRequests, setRecentRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [expandedRow, setExpandedRow] = useState(null);
  const [signedRequestForm, setSignedRequestForm] = useState(null);
  
  const { currentUser } = useSelector((state) => state.user);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
 // New state for modal

 const [showActionModal, setShowActionModal] = useState(false);
 const [selectedAction, setSelectedAction] = useState(null);
 const [actionComment, setActionComment] = useState('');
 const [selectedRequestId, setSelectedRequestId] = useState(null);

 const handleActionClick = (request, action) => {
  setSelectedRequestId(request._id);
  setSelectedRequest(request); 
  setSelectedAction(action);
  setActionComment('');
  setShowActionModal(true);
};

 const handleActionSubmit = async () => {
  try {
    let signedFormURL = null;

    if (signedRequestForm) {
      // Upload to Firebase Storage
      const storage = getStorage(app);
      const storageRef = ref(storage, `signedRequestForms/${Date.now()}_${signedRequestForm.name}`);
      const uploadTask = uploadBytesResumable(storageRef, signedRequestForm);

      await new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          null, // Optionally, handle progress updates
          (error) => {
            console.error("Error uploading file:", error);
            toast.error("File upload failed. Please try again.");
            reject(error);
          },
          async () => {
            signedFormURL = await getDownloadURL(uploadTask.snapshot.ref);
            resolve();
          }
        );
      });
    }

    const response = await fetch(`/api/docrequest/updateStatus`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        requestId: selectedRequestId,
        status: selectedAction,
        comment: actionComment,
        signedRequestForm: signedFormURL,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to update request");
    }

    const updatedRequest = await response.json();

    // Update the local state
    setRecentRequests(recentRequests.map(request => {
      if (request._id === selectedRequestId) {
        return {
          ...request,
          status: updatedRequest.status,
          comment: updatedRequest.comment,
          signedRequestForm: updatedRequest.signedRequestForm,
        };
      }
      return request;
    }));

    setShowActionModal(false);
    setSignedRequestForm(null);
    setSelectedRequestId(null);

    toast.success("Document request status saved successfully!");
  } catch (error) {
    console.error("Error updating request:", error);
    toast.error("Error updating request. Please try again.");
  }
};

const handleEmailUser = async (request) => {
  try {
    if (!request.signedRequestForm) {
      toast.error("No signed request form available. Cannot send email.");
      return; 
    }

    const signedRequestFormUrl = request.signedRequestForm; 

    // Send email if signedRequestForm is present
    const response = await fetch('/api/email/emailUser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: request.generalInformation.email,
        subject: 'Document Request Notification',
        text: `Dear ${request.generalInformation.firstName}, your document request has been processed. 

        
        Here is the file link for your Signed Request Form:
        ${signedRequestFormUrl}

        You may also view the attached request slip by logging in to the system using your account. 

        Please let us know if you have any questions.

        Best regards,
        IsKalusugan`,
      }),
    });

    if (response.ok) {
      toast.success("Email sent successfully!");
    } else {
      toast.error("Failed to send email.");
    }
  } catch (error) {
    console.error('Error:', error);
    toast.error("Error sending email.");
  }
};







  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'failure';
      default: return 'default';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    const fetchRequestedDocument = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('/api/docrequest/getRequestHistory');
        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await res.json();
        console.log('API Response:', data); // Debug log
        
        // Check if data is an array
        const requestsArray = Array.isArray(data) ? data : [];
        setRecentRequests(requestsArray);
        
        // Update stats
        const newStats = requestsArray.reduce((acc, request) => {
          acc[request.status] = (acc[request.status] || 0) + 1;
          return acc;
        }, { pending: 0, approved: 0, rejected: 0 });
        setStats(newStats);
        
      } catch (error) {
        console.error('Error fetching requests:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
  
    fetchRequestedDocument();
  }, []);

  const renderTableContent = () => {
    const filteredRequests = recentRequests.filter(request => 
      activeTab === 'new' ? request.status === 'pending' :
      activeTab === 'history' ? request.status === 'approved' :
      activeTab === 'rejected' ? request.status === 'rejected' : true
    );
    
    console.log('Rendering table with data:', filteredRequests);

    if (isLoading) {
      return (
        <Table.Row>
          <Table.Cell colSpan={7} className="text-center py-4">
            Loading requests...
          </Table.Cell>
        </Table.Row>
      );
    }

    if (error) {
      return (
        <Table.Row>
          <Table.Cell colSpan={7} className="text-center text-red-500 py-4">
            Error loading requests: {error}
          </Table.Cell>
        </Table.Row>
      );
    }

    if (!filteredRequests || filteredRequests.length === 0) {
      return (
        <Table.Row>
          <Table.Cell colSpan={7} className="text-center py-4">
            No requests available.
          </Table.Cell>
        </Table.Row>
      );
    }


    return filteredRequests.map((request) => (
      <React.Fragment key={request._id}>
        <Table.Row className="bg-white hover:bg-gray-50">
          <Table.Cell className="whitespace-nowrap font-medium text-gray-900">
            {request.trackingNumber}
          </Table.Cell>
          <Table.Cell>
            {formatDate(request.dateRequested)}
          </Table.Cell>
          <Table.Cell>
            {formatDate(request.dateUpdated)}
          </Table.Cell>
          <Table.Cell>
            <Badge color={getStatusColor(request.status)}>
              {request.status}
            </Badge>
          </Table.Cell>
          <Table.Cell>
            {request.generalInformation?.firstName} {request.generalInformation?.middleName} {request.generalInformation?.lastName}
          </Table.Cell>
          <Table.Cell>
            <div className="flex gap-2">
            <Tooltip content="Approve Request">
                <Button 
                  size="sm" 
                  color="green" 
                  className="p-2"
                  onClick={() => handleActionClick(request, 'approved')}
                >
                  <CheckCircle className="h-4 w-4" />
                </Button>
              </Tooltip>
              <Tooltip content="Reject Request">
                <Button 
                  size="sm" 
                  color="red" 
                  className="p-2"
                  onClick={() => handleActionClick(request, 'rejected')}
                >
                  <XCircle className="h-4 w-4" />
                </Button>
              </Tooltip>
              <Tooltip content="Email Laboratory Request Slip to User">
                <Button 
                  size="sm" 
                  color="info" 
                  className="p-2" 
                  onClick={() => handleEmailUser(request)} // Trigger email sending when button is clicked
                >
                  <FileText className="h-4 w-4" />
                </Button>
              </Tooltip>


            </div>
          </Table.Cell>
          <Table.Cell>
            <Button
              size="sm"
              color="gray"
              className="p-2"
              onClick={() => setExpandedRow(expandedRow === request._id ? null : request._id)}
            >
              {expandedRow === request._id ? 
              <ChevronUp className="h-4 w-4" /> : 
              <ChevronDown className="h-4 w-4" />}
            </Button>
          </Table.Cell>
        </Table.Row>
        {expandedRow === request._id && (
          <Table.Row className="bg-gray-50">
            <Table.Cell colSpan={7}>
              <div className="p-4">
                <h4 className="font-medium mb-2">Request Details</h4>
               
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Student Number:</p>
                    <p className="font-medium">{request.generalInformation?.studentNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Contact Number:</p>
                    <p className="font-medium">{request.generalInformation?.contactNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Comment:</p>
                    <p className="font-medium">{request.comment || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Purpose:</p>
                    <p className="font-medium">{request.purpose || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">CBC:</p>
                    <p className="font-medium">{request.documentRequest?.cbc ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Platelet Count:</p>
                    <p className="font-medium">{request.documentRequest?.plateletCount ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Urinalysis:</p>
                    <p className="font-medium">{request.documentRequest?.urinalysis ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Fecalysis:</p>
                    <p className="font-medium">{request.documentRequest?.fecalysis ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">X-Ray (Chest PA):</p>
                    <p className="font-medium">{request.documentRequest?.xray ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">ECG 12 Leads:</p>
                    <p className="font-medium">{request.documentRequest?.ecg12Leads ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Drug Test:</p>
                    <p className="font-medium">{request.documentRequest?.drugTest ? 'Yes' : 'No'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Others:</p>
                    <p className="font-medium">{request.documentRequest?.others || 'None'}</p>
                  </div>
                </div>
              </div>
            </Table.Cell>
          </Table.Row>
        )}
      </React.Fragment>
    ));
  };

  return (
    <div className="dashboard my-flex">
          <ToastContainer className="z-50" />
        
      <div className="dashboardContainer my-flex">
        
        <Sidebar />
        <div className="mainContent">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 space-y-6"
          >
            {/* Header Card */}
            <motion.div
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <Card className="bg-gradient-to-r from-blue-600 to-cyan-500 border-none">
                <div className="relative overflow-hidden p-8">
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                      <FileText className="w-8 h-8 text-white" />
                      <h1 className="text-3xl font-bold text-white">
                        Document Requests
                      </h1>
                    </div>
                    <p className="text-white/80 max-w-xl">
                      Request and manage your medical document requirements. Track status and history of your requests.
                    </p>
                  </div>
                  <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -mt-16 -mr-16 blur-3xl" />
                </div>
              </Card>
            </motion.div>

            {/* Tabs */}
            <div className="flex space-x-4 border-b border-gray-200">
              {['new', 'history', 'rejected'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 px-4 relative ${
                    activeTab === tab 
                      ? 'text-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span className="capitalize font-medium">
                  {tab === 'new' ? 'New Request' : tab === 'history' ? 'Request History' : 'Rejected Request'}
                  </span>
                  {activeTab === tab && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"
                      initial={false}
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Request Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="overflow-x-auto shadow-md sm:rounded-lg"
            >
              <Table hoverable className='bg-slate'>
                <Table.Head>
                  <Table.HeadCell className="w-[180px]">Tracking Number</Table.HeadCell>
                  <Table.HeadCell>Date Requested</Table.HeadCell>
                  <Table.HeadCell>Last Updated</Table.HeadCell>
                  <Table.HeadCell>Status</Table.HeadCell>
                  <Table.HeadCell>Name</Table.HeadCell>
                  <Table.HeadCell>Actions</Table.HeadCell>
                  <Table.HeadCell>
                    <span className="sr-only">Expand</span>
                  </Table.HeadCell>
                </Table.Head>
                <Table.Body className="divide-y">
                  {renderTableContent()}
                </Table.Body>
              </Table>
            </motion.div>
          </motion.div>
        </div>
      </div>
      {/* Action Modal */}
      <DocumentRequestModal
        showActionModal={showActionModal}
        setShowActionModal={setShowActionModal}
        selectedAction={selectedAction}
        actionComment={actionComment}
        setActionComment={setActionComment}
        signedRequestForm={signedRequestForm}
        setSignedRequestForm={setSignedRequestForm}
        handleActionSubmit={handleActionSubmit}
        selectedRequest={selectedRequest}
      />
    </div>
  );
};

export default ManageRequests;