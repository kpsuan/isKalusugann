import React from 'react';
import { Modal, Button, Timeline } from 'flowbite-react';
import { 
  FileText, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Calendar,
  User,
  FileCheck,
  MessageSquare
} from 'lucide-react';
import { 
  HiDocumentDownload
} from 'react-icons/hi';

import { motion } from 'framer-motion';

const DocumentDetailsModal = ({ isOpen, onClose, request }) => {
  if (!request) return null;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return Clock;
      case 'approved': return CheckCircle;
      case 'rejected': return AlertCircle;
      default: return FileText;
    }
  };

  const StatusIcon = getStatusIcon(request.status);

  return (
    <><div className="w-full fixed inset-0 bg-black bg-opacity-10 z-50">
    <Modal show={isOpen} onClose={onClose} size="xl">
      <Modal.Header className="border-b">
        <div className="flex items-center gap-3 ">
          <StatusIcon className="w-6 h-6 text-blue-600" />
          <span>Document Request Details</span>
        </div>
      </Modal.Header>
      <Modal.Body>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Request Overview */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4" />
                <span className="text-sm">Request Date</span>
              </div>
              <p className="font-medium">{new Date(request.date).toLocaleDateString()}</p>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <FileCheck className="w-4 h-4" />
                <span className="text-sm">Status</span>
              </div>
              <p className="font-medium capitalize">{request.status}</p>
            </div>
          </div>

          {/* Documents Requested */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Requested Documents</h3>
            <div className="grid grid-cols-2 gap-3">
              <div
                className="p-3 bg-gray-50 rounded-lg border border-gray-200"
              >
                <FileText className="w-5 h-5 text-blue-600 mb-2" />
                <p className="text-sm font-medium capitalize">
                  <h3 className="font-medium text-gray-900">
                    {request.type}
                  </h3>
                </p>
              </div>
            </div>
          </div>

          {/* Request Timeline */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold">Request Timeline</h3>
            <Timeline>
              <Timeline.Item>
                <Timeline.Content>
                  <Timeline.Time>
                    {new Date(request.date).toLocaleDateString()}
                  </Timeline.Time>
                  <Timeline.Title>Request Submitted</Timeline.Title>
                  <Timeline.Body>
                    Document request was submitted to the system
                  </Timeline.Body>
                </Timeline.Content>
              </Timeline.Item>
              {request.status !== 'pending' && (
                <Timeline.Item>
                  <Timeline.Point icon={request.status === 'approved' ? CheckCircle : AlertCircle} />
                  <Timeline.Content>
                    <Timeline.Time>
                      {new Date(request.dateUpdated).toLocaleDateString()}
                    </Timeline.Time>
                    <Timeline.Title>
                      Request {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </Timeline.Title>
                    {request.comment && (
                      <Timeline.Body>
                        {request.comment}
                      </Timeline.Body>
                    )}
                  </Timeline.Content>
                </Timeline.Item>
              )}
            </Timeline>
          </div>

          {/* Signed Request Form Section */}

          <div className="border-t pt-6">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-lg font-semibold text-gray-800">Signed Request Form</h4>
                <p className="text-sm text-gray-600">Download the signed laboratory request form</p>
              </div>
              <Button
                onClick={() => window.open(request.signedRequestForm, '_blank')}
                className="flex items-center gap-2"
              >
                <HiDocumentDownload className="h-5 w-5" />
                Download Form
              </Button>
            </div>
          </div>

        </motion.div>
      </Modal.Body>
      <Modal.Footer>
        <Button color="gray" onClick={onClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
    </div>
    </>
   
  );
};

export default DocumentDetailsModal;