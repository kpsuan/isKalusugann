import DocumentRequest from "../models/documentRequest.model.js";
import { errorHandler } from "../utils/error.js";



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
      const userId = req.params.userId; 
      console.log("Received userId:", userId);  // Log userId here
      const requests = await DocumentRequest.find({ userId }) 
        .sort({ dateRequested: -1 }); 
      res.status(200).json(requests);
    } catch (error) {
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
          }));
  
        return types;
      });
  
      res.status(200).json({ requests: transformedRequests });
    } catch (error) {
      next(error);
    }
  };
  