import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['success', 'error', 'info', 'warning'], // Restrict to specific types
      default: 'info',
    },
    isRead: {
      type: Boolean,
      default: false, // Notifications are unread by default
    },
    timestamp: {
      type: Date,
      default: Date.now, // Automatically set the time of creation
    },
    link: {
      type: String,  // To store the URL as a string
      required: false  // Optional, set to true if it's always required
    }
    
  },
 
);

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    firstName: {
      type: String,
      default: '',
    },
    middleName: {
      type: String,
      default: '',
    },
    lastName: {
      type: String,
      default: '',
    },
    dateOfBirth: {
      type: String,
      default: '',
    },
    gender: {
      type: String,
      default: '',
    },
    degreeLevel: {
      type: String,
      default: '',
    },
    yearLevel: {
      type: String,
      default: '',
    },
    college: {
      type: String,
      default: '',
    },
    degreeProgram: {
      type: String,
      default: '',
    },
    profilePicture: {
      type: String,
      default: 'https://grallc.github.io/img/avatar.jpg',
    },
    annualPE: {
      type: String,
      default: '',
    },
    peForm: {
      type: String,
      default: '',
    },
    medcertUser: {
      type: String,
      default: '',
    },
    labResults: {
      type: String,
      default: '',
    },
    requestPE: {
      type: String,
      default: '',
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isSuperAdmin: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      default: 'NO ACTION',
    },
    dentistStatus: {
      type: String,
      default: 'NO ACTION',
    },
    doctorStatus: {
      type: String,
      default: 'NO ACTION',
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    comment: {
      type: String,
      default: '',
    },
    medcert: {
      type: String,
      default: '',
    },
    schedule: {
      type: [String],
      default: [''],
    },
    rescheduledDate: {
      type: [String],
      default: [],
    },
    reschedule: {
      type: String,
      default: '',
    },
    rescheduleStatus: {
      type: String,
      default: '',
    },
    rescheduleRemarks: {
      type: String,
      default: '',
    },
    isRescheduled: {
      type: Boolean,
      default: false,
    },
    rescheduleLimit: {
      type: Number,
      default: 0,
    },
    isPresent: {
      type: String,
      default: 'PENDING',
    },
    lastLoggedIn: {
      type: Date,
      default: null,
    },
    queueNumber: {
      type: Number,
      default: null,
    },
    queueNumberDate: {
      type: String,
      default: null,
    },
    
    lastUpdated: { 
      type: Date, 
      default: Date.now 
    },

    isGraduating: {
      type: Boolean,
      default: false,
    },

    isGeneral: {
      type: Boolean,
      default: false,
    },
    isDental:{
      type: Boolean,
      default: false,
    },
    approvedByDentist:{
      type: String,
      default: null,
    },
    approvedByDoctor:{
      type: String,
      default: null,
    },
    approvedByDentistLicense:{
      type: String,
      default: null,
    },
    approvedByDoctorLicense:{
      type: String,
      default: null,
    },

    approvedByDentistDate:{
      type: Date,
      default: null,
    },
    approvedByDoctorDate:{
      type: Date,
      default: null,
    },

    licenseNumber: {
      type: String,
      default: null,
    },
    isNewUser:{
      type: Boolean,
      default: true
    },

    isArchive:{
      type: Boolean,
      default: false
    },
    isActive:{
      type: Boolean,
      default: true
    },
    archivedDate: {
      type: Date,
      default: null,
    },
    isNewUser:{
      type: Boolean,
      default: true
    },

    resetPasswordToken: String,
    resetPasswordTokenExpiresAt: Date,
    
    
    notifications: {
      type: [notificationSchema],
      default: [], // Initialize as an empty array
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
