import DocumentRequest from "../models/documentRequest.model.js";
import { errorHandler } from "../utils/error.js";
import User from '../models/user.model.js';
import mongoose from 'mongoose';


const generateTrackingNumber = () => {
  const timestamp = Date.now() 
  return `LR-${timestamp}`; // Combine both parts
};


export const createRequest = async (req, res, next) => {
  try {
    const dateRequested = new Date();
    const requestData = {
      generalInformation: {
        studentNumber: req.body.studentNumber,
        firstName: req.body.firstName,
        middleName: req.body.middleName,
        lastName: req.body.lastName,
        yearLastAttended: req.body.yearLastAttended,
        birthday: req.body.birthday,
        email: req.body.email,
        contactNumber: req.body.contactNumber,
        age: req.body.age,
        sex: req.body.sex,
      },
      education: {
        degreeLevel: req.body.degreeLevel,
        yearLevel: req.body.yearLevel,
        college: req.body.college,
        degreeProgram: req.body.degreeProgram,
      },
      documentRequest: {
        cbc: req.body.documentRequest.cbc || false,
        plateletCount: req.body.documentRequest.plateletCount || false,
        urinalysis: req.body.documentRequest.urinalysis || false,
        fecalysis: req.body.documentRequest.fecalysis || false,
        xRay: req.body.documentRequest.xRay || false,
        ecg12Leads: req.body.documentRequest.ecg12Leads || false,
        drugTest: req.body.documentRequest.drugTest || false,
        others: req.body.documentRequest.others || '',
      },
      trackingNumber: generateTrackingNumber(),
      dateRequested: dateRequested,
      dateUpdated: dateRequested,
      status: req.body.status || '',  // Adding the status field
      comment: req.body.comment || '',  // Adding the comment field
      signedRequestForm: req.body.signedRequestForm || '',  // Adding the signedRequestForm field
      purpose: req.body.purpose || '',  // Adding the signedRequestForm field
      userId: req.user.id,
    };

    // Create a new document request
    const newRequest = new DocumentRequest(requestData);

    // Save the document request to the database
    const savedRequest = await newRequest.save();

    // Return the saved request as the response
    res.status(201).json(savedRequest);
  } catch (error) {
    // If there's an error, pass it to the error handler
    next(error);
  }
};

export const getRequestHistory = async (req, res, next) => {
  try {
    // Fetch all document requests, sorted by dateRequested in descending order
    const requests = await DocumentRequest.find().sort({ dateRequested: -1 });
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching request history:', error);
    next(error);
  }
};

  export const getRequestHistory2 = async (req, res, next) => {
    try {
      const requests = await DocumentRequest.find({ userId: req.query.userId });
  
      // Transform data to the desired format
      const transformedRequests = requests.flatMap((doc) => {
        const types = Object.entries(doc.documentRequest)
          .filter(([key, value]) => value === true) // Filter where the value is `true`
          .map(([key]) => ({
            id: doc.trackingNumber,
            type: key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()), // Format type (e.g., "cbc" -> "CBC")
            status: doc.status || 'pending', // Default status to 'pending' if not set
            date: doc.dateRequested.toISOString().split('T')[0], // Format date
            signedRequestForm: doc.signedRequestForm,
          }));
  
        return types;
      });
  
      res.status(200).json({ requests: transformedRequests });
    } catch (error) {
      next(error);
    }
  };
  

  export const updateRequestStatus = async (req, res, next) => {
    try {
      const { requestId, status, comment, signedRequestForm } = req.body;
  
      // Find the document request
      const request = await DocumentRequest.findById(requestId);
      if (!request) {
        return res.status(404).json({ message: 'Request not found' });
      }
  
      // Update the request details
      request.status = status || request.status;
      request.comment = comment || request.comment;
      request.dateUpdated = new Date();
      request.signedRequestForm = signedRequestForm || request.signedRequestForm;
  
      // Save the updated request
      const updatedRequest = await request.save();
  
      // Convert `userId` from `DocumentRequest` to ObjectId
      const userId = new mongoose.Types.ObjectId(request.userId);
  
      // Add a notification for the user
      const notification = {
        message: status === 'approved'
          ? 'Requested documents are now approved. You may view them.'
          : 'Requested documents are denied.',
        type: 'info',
        timestamp: new Date(),
        link: '/requestDocs',
        isRead: false,
      };
  
      const user = await User.findByIdAndUpdate(
        userId,
        { $push: { notifications: notification } },
        { new: true } // Return the updated document
      );
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Respond with the updated request
      res.status(200).json(updatedRequest);
    } catch (error) {
      next(error);
    }
  };
  
  

export const getRequestDetails = async (req, res) => {
  const { trackingNumber } = req.params;
  
  try {
    const request = await DocumentRequest.findOne({ trackingNumber });
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }

    // Format dates
    const formattedDateRequested = new Date(request.dateRequested).toLocaleDateString();
    const formattedDateUpdated = new Date(request.dateUpdated).toLocaleDateString();

    const statusMap = {
      'pending': 'Under Review',
      'rejected': 'Rejected',
      'approved': 'Approved',

    };

    const formattedStatus = statusMap[request.status.toLowerCase()] || request.status;

    //  include fields that are true meaning those r requested v=by user
    const filteredDocumentRequest = Object.keys(request.documentRequest)
      .filter(key => request.documentRequest[key] === true)
      .reduce((obj, key) => {
        obj[key] = request.documentRequest[key];
        return obj;
      }, {});

    res.json({
      trackingId: request.trackingNumber,
      purpose: request.purpose,
      status: formattedStatus,
      signedRequestForm: request.signedRequestForm,
      dateRequested: formattedDateRequested,
      dateUpdated: formattedDateUpdated,
      documentRequest: filteredDocumentRequest, // Only return the true fields
      timeline: [
        { status: 'Submitted', date: formattedDateRequested, description: 'Request submitted successfully' },
        { status: formattedStatus, date: formattedDateUpdated, description: `Request is ${formattedStatus}` }
      ],
      type: 'Document Request'
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
};
