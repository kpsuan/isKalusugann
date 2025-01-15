import mongoose from "mongoose";

const documentRequestSchema = new mongoose.Schema({
  generalInformation: {
    studentNumber: { type: String, required: true },
    firstName: { type: String, required: true },
    middleName: { type: String, required: true },
    lastName: { type: String, required: true },
    yearLastAttended: { type: Number, required: false },
    birthday: { type: Date, required: false },
    email: { type: String, required: true },
    contactNumber: { type: String, required: false },
    age: { type: Number, required: false },
    sex: { type: String, required: false }
  },
  education: {
    degreeLevel: { type: String, required: true },
    yearLevel: { type: String, required: true },
    college: { type: String, required: true },
    degreeProgram: { type: String, required: true }
  },
  documentRequest: {
    cbc: { type: Boolean, default: false },
    plateletCount: { type: Boolean, default: false },
    urinalysis: { type: Boolean, default: false },
    fecalysis: { type: Boolean, default: false },
    xRay: { type: Boolean, default: false },
    ecg12Leads: { type: Boolean, default: false },
    drugTest: { type: Boolean, default: false },
    others: { type: String, default: '' }
  },
  trackingNumber: { type: String, required: true },  // Added trackingNumber field
  dateRequested: { type: Date, required: true },
  dateUpdated: { type: Date, required: true },
  status: { type: String, required: false },  // Add status field
  comment: { type: String, default: '' },  // Add comment field
  signedRequestForm: { type: String, default: '' },  // Add signedRequestForm field
  userId: {
    type: String,
    required: true,
  },
});

const DocumentRequest = mongoose.model('DocumentRequest', documentRequestSchema);

export default DocumentRequest;
