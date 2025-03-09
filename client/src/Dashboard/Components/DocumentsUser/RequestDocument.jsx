import { useSelector } from 'react-redux';
import { useEffect, useState } from "react";
import { Card, Button, Badge, Tooltip } from 'flowbite-react';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from "../SideBar Section/Sidebar";

import RequestForm from './RequestForm';
import RequestFormDoc from './RequestFormDoc';

import { 
  FileText, 
  ClipboardList, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Download,
  Mail,
  CreditCard,
  Building,
  FileSpreadsheet
} from 'lucide-react';
import DocumentDetailsModal from './DocumentDetailsModal';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const RequestDocument = () => {
  const [activeTab, setActiveTab] = useState('new');
  const [recentRequests, setRecentRequests] = useState([]);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'failure';
      default: return 'default';
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleDownloadPDF = async () => {
    const content = document.getElementById("pdf-content");
    if (!content) return;

    try {
      // Create a loading state if needed
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true
      });

      // Add header
      pdf.setFontSize(20);
      pdf.setTextColor(44, 62, 80);
      pdf.text("Document Request Summary", 20, 20);

      // Add user info
      pdf.setFontSize(12);
      pdf.setTextColor(52, 73, 94);
      pdf.text(`Generated for: ${currentUser.name}`, 20, 35);
      pdf.text(`Date: ${formatDate(new Date())}`, 20, 42);

      // Convert content to canvas
      const canvas = await html2canvas(content, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      // Calculate dimensions to fit on A4
      const imgWidth = 170; // Leave margins
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add content image
      pdf.addImage(
        canvas.toDataURL('image/png'),
        'PNG',
        20, // X position
        50, // Y position
        imgWidth,
        imgHeight,
        '',
        'FAST'
      );

      // Add footer
      const pageCount = pdf.internal.getNumberOfPages();
      pdf.setFontSize(10);
      pdf.setTextColor(127, 140, 141);
      pdf.text(
        `Generated on ${formatDate(new Date())} - Page ${pageCount}`,
        pdf.internal.pageSize.getWidth() / 2,
        pdf.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );

      // Save the PDF
      pdf.save(`DocumentRequest_${formatDate(new Date())}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Handle error state if needed
    }
  };

  useEffect(() => {
    const fetchRequestedDocumentUser = async () => {
      try {
        const res = await fetch(`/api/docrequest/getRequestHistory2?userId=${currentUser._id}`);
        const data = await res.json();
        if (res.ok) {
          setRecentRequests(data.requests);
        }
      } catch (error) {
        console.error(error.message);
      }
    };
    fetchRequestedDocumentUser();
  }, [currentUser._id]);

  return (
    <div className="dashboard my-flex">
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
                      <h1 className="text-3xl font-bold text-white">Document Requests</h1>
                    </div>
                    <p className="text-white/80 max-w-xl">
                      Request and manage your medical document requirements. Track status and history of your requests.
                    </p>
                  </div>
                  <div className="absolute right-0 top-0 w-64 h-64 bg-white/10 rounded-full -mt-16 -mr-16 blur-3xl" />
                </div>
              </Card>
            </motion.div>

            {/* PDF Download Button */}
            <Button
              onClick={handleDownloadPDF}
              className="bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Summary PDF
            </Button>

            {/* Tabs and Content */}
            <div id="pdf-content" className="bg-white p-6 rounded-xl shadow-sm space-y-6">
              <div className="flex space-x-4 border-b border-gray-200">
                {['new', 'history'].map((tab) => (
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
                      {tab === 'new' ? 'New Request' : 'Request History'}
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

              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeTab === 'new' ? (
                  currentUser.role === 'Doctor' ? (
                    <RequestFormDoc />
                  ) : (
                    <RequestForm />
                  )
                  ) : (
                    <div className="space-y-4">
                      {recentRequests.map((request) => (
                        <motion.div
                          key={request.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-2 bg-blue-100 rounded-lg">
                              <ClipboardList className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-medium text-gray-900">{request.type}</h3>
                              <p className="text-sm text-gray-500">
                                Requested on {formatDate(request.date)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge color={getStatusColor(request.status)}>
                              {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </Badge>
                            <Tooltip content="View Details">
                              <Button 
                                size="sm" 
                                color="gray"
                                onClick={() => {
                                  setSelectedRequest(request);
                                  setIsModalOpen(true);
                                }}
                              >
                                Details
                              </Button>
                            </Tooltip>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
      <DocumentDetailsModal 
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRequest(null);
        }}
        request={selectedRequest}
      />
    </div>
  );
};

export default RequestDocument;