import React, { useState } from 'react';
import { 
  TextInput, 
  Button, 
  Card, 
  Timeline,
  Badge,
  Alert,
  Spinner,
  Table
} from 'flowbite-react';
import { 
  HiSearch, 
  HiClock, 
  HiXCircle, 
  HiDocument,
  HiClipboardList,
  HiBeaker,
  HiOutlineCalendar,
  HiDocumentDownload
} from 'react-icons/hi';

const TrackRequestHistory = () => {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [requestData, setRequestData] = useState(null);

  const labTests = {
    cbc: { label: "Complete Blood Count (CBC)", description: "Basic blood screening test" },
    plateletCount: { label: "Platelet Count", description: "Measures blood platelet levels" },
    urinalysis: { label: "Urinalysis", description: "Examines urine composition" },
    fecalysis: { label: "Fecalysis", description: "Stool examination" },
    xRay: { label: "X-Ray", description: "Diagnostic imaging" },
    ecg12Leads: { label: "ECG 12 Leads", description: "Heart activity recording" },
    drugTest: { label: "Drug Test", description: "Substance screening" },
    other: { label: "Other Tests", description: "Additional examinations" }
  };

  const filterDocumentRequest = (documentRequest) => {
    return Object.keys(documentRequest)
      .filter(key => documentRequest[key] === true)
      .reduce((obj, key) => {
        obj[key] = documentRequest[key];
        return obj;
      }, {});
  };

  const handleTrack = async (e) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      setError('Please enter a tracking number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/docrequest/${trackingNumber}`);
      const data = await response.json();
      
      if (data.documentRequest) {
        data.documentRequest = filterDocumentRequest(data.documentRequest);
      }

      setRequestData(data);
    } catch (err) {
      setError('Failed to fetch request details');
      setRequestData(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      'Submitted': 'info',
      'Under Review': 'warning',
      'Processing': 'purple',
      'Completed': 'success',
      'Rejected': 'failure',
      'In Progress': 'warning'
    };

    return (
      <Badge color={statusColors[status] || 'info'} size="lg">
        {status}
      </Badge>
    );
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getFormattedStatus = (status) => {
    if (status === 'pending') return 'Under Review';
    if (status === 'rejected') return 'Rejected';
    if (status === 'approved') return 'Approved';
    return status;
  };

  return (
    <div className="w-full mx-auto space-y-6">
      <Card className="bg-white shadow-lg">
        <div className="mb-4">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <HiClipboardList className="h-6 w-6 text-blue-600" />
            Track Laboratory Request
          </h2>
          <p className="text-gray-600">Enter your tracking number to view request details</p>
        </div>

        <form onSubmit={handleTrack} className="space-y-4">
          <div className="flex gap-3">
            <TextInput
              id="tracking-number"
              type="text"
              placeholder="e.g., LR-1737185268326"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              icon={HiDocument}
              className="flex-1"
            />
            <Button 
              type="submit" 
              disabled={loading}
            >
              {loading ? (
                <Spinner size="sm" className="mr-2" />
              ) : (
                <HiSearch className="mr-2 h-5 w-5" />
              )}
              Track Request
            </Button>
          </div>
        </form>

        {error && (
          <Alert color="failure" className="mt-4">
            <HiXCircle className="mr-2 h-5 w-5" />
            {error}
          </Alert>
        )}
      </Card>

      {requestData && (
        <Card className="bg-white shadow-lg">
          <div className="space-y-6">
            <div className="flex justify-between items-start border-b pb-4">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                  <HiBeaker className="h-6 w-6 text-blue-600" />
                  Request Details
                </h3>
                <div className="space-y-1">
                  <p className="text-gray-600">
                    <span className="font-semibold">Tracking ID:</span> {requestData.trackingId}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Purpose:</span> {requestData.purpose}
                  </p>
                  <p className="text-gray-600">
                    <span className="font-semibold">Request Date:</span>{' '}
                    <span className="flex items-center gap-1">
                      <HiOutlineCalendar className="h-4 w-4" />
                      {formatDate(requestData.dateRequested)}
                    </span>
                  </p>
                  
                </div>
              </div>
              {getStatusBadge(getFormattedStatus(requestData.status))}
            </div>

            <div>
              <h4 className="text-xl font-semibold text-gray-800 mb-4">Requested Laboratory Tests</h4>
              <Table striped className='bg-slate'>
                <Table.Head>
                  <Table.HeadCell>Test Name</Table.HeadCell>
                  <Table.HeadCell>Description</Table.HeadCell>
                </Table.Head>
                <Table.Body>
                  {Object.keys(requestData.documentRequest || {}).length === 0 ? (
                    <Table.Row>
                      <Table.Cell colSpan={2} className="text-center">
                        No laboratory tests requested.
                      </Table.Cell>
                    </Table.Row>
                  ) : (
                    Object.keys(requestData.documentRequest).map((testId) => (
                      <Table.Row key={testId}>
                        <Table.Cell className="font-medium">
                          {labTests[testId]?.label || testId}
                        </Table.Cell>
                        <Table.Cell>
                          {labTests[testId]?.description || ''}
                        </Table.Cell>
                      </Table.Row>
                    ))
                  )}
                </Table.Body>
              </Table>
            </div>

            <div>
              <h4 className="text-xl font-semibold text-gray-800 mb-4">Request Timeline</h4>
              <Timeline>
                {requestData.timeline.map((event, index) => (
                  <Timeline.Item key={index}>
                    <Timeline.Content>
                      <Timeline.Time className="text-blue-600 font-medium">
                        {event.date}
                      </Timeline.Time>
                      <Timeline.Title className="text-gray-800 font-semibold">
                        {event.status}
                      </Timeline.Title>
                      <Timeline.Body className="text-gray-600">
                        {event.description}
                      </Timeline.Body>
                    </Timeline.Content>
                  </Timeline.Item>
                ))}
              </Timeline>
            </div>

            {/* Signed Request Form Section */}
            {requestData.signedRequestForm && (
              <div className="border-t pt-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="text-xl font-semibold text-gray-800">Signed Request Form</h4>
                    <p className="text-gray-600">Download the signed laboratory request form</p>
                  </div>
                  <Button 
                    onClick={() => window.open(requestData.signedRequestForm, '_blank')}
                    className="flex items-center gap-2"
                  >
                    <HiDocumentDownload className="h-5 w-5" />
                    Download Form
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      )}
    </div>
  );
};

export default TrackRequestHistory;