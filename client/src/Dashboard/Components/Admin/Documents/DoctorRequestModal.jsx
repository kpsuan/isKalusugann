import React from 'react';
import { Modal, Button, Label, Textarea } from 'flowbite-react';
import { FileText, Download, Upload } from 'lucide-react';

const DoctorRequestModal = ({
  showActionModal,
  setShowActionModal,
  selectedAction,
  actionComment,
  setActionComment,
  signedRequestForm,
  setSignedRequestForm,
  handleActionSubmit,
  selectedRequest
}) => {
  return (
    <Modal
      show={showActionModal}
      onClose={() => setShowActionModal(false)}
      size="xl"
      className="w-full fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">

      <Modal.Header>
        {selectedAction === 'approved' ? 'Mark Request as Done' : 'Delete Request'}
      </Modal.Header>
      <Modal.Body>
        <div className="space-y-6">
          <p className="text-base leading-relaxed text-gray-500">
            Are you sure you want to {selectedAction === 'approved' ? 'approve' : 'reject'} this request?
          </p>

          <div className="grid grid-row-2 gap-2">
          
            <div className="grid grid-col-2 gap-2">
                <div className="space-y-6">
              {/* Display existing comment if available */}
              {selectedRequest?.comment && (
                <div className="p-2 bg-gray-50 rounded-lg h-full">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Previous Comment</h4>
                  <p className="text-gray-600">{selectedRequest.comment}</p>
                </div>
              )}

              {/* Comment input */}
              <div>
                <div className="mb-2 block">
                  <Label htmlFor="comment" value="Add remarks" />
                </div>
                <Textarea
                  id="comment"
                  placeholder="Enter your comment here..."
                  required
                  rows={4}
                  value={actionComment}
                  onChange={(e) => setActionComment(e.target.value)}
                  className="w-full"
                />
              </div>
                </div>
            </div>

          
            <div className="space-y-6">
              {/* Display existing signed request form if available */}
              {selectedRequest?.signedRequestForm && (
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Current Laboratory Request Slip</h4>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-600">Laboratory Request Slip</span>
                    </div>
                    <a
                      href={selectedRequest.signedRequestForm}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
                    >
                      <Download className="w-4 h-4" />
                      <span className="text-sm">Download</span>
                    </a>
                  </div>
                </div>
              )}

              
            </div>
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <div className="w-full flex justify-end gap-2">
          <Button
            color={selectedAction === 'approved' ? 'green' : 'red'}
            onClick={handleActionSubmit}
          >
            {selectedAction === 'approved' ? 'Mark as Done' : 'Delete'}
          </Button>
          <Button
            color="gray"
            onClick={() => setShowActionModal(false)}
          >
            Cancel
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default DoctorRequestModal;