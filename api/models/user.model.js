import mongoose from 'mongoose';

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
      //required: true,
    },
    middleName: {
      type: String,
      default: ''
      //required: true,
    },
    lastName: {
      type: String,
      default: ''
      //required: true,
    },
    dateOfBirth: {
      type: String,
      default: ''
      //required: true,
    },
    gender: {
      type: String,
      default: ''
      //required: true,
    },
    degreeLevel: {
      type: String,
      default: ''
      //required: true,
    },
    yearLevel: {
      type: String,
      default: ''
      //required: true,
    },
    college: {
      type: String,
      default: ''
      //required: true,
    },
    degreeProgram: {
      type: String,
      default: ''
      //required: true,
    },
    profilePicture: {
      type: String,
      default:
        'https://grallc.github.io/img/avatar.jpg',
    },
    annualPE: {
      type: String,
      default: ''
      //required: true,
    },
    peForm: {
      type: String,
      default: ''
      //required: true,
    },
    labResults: {
      type: String,
      default: ''
      //required: true,
    },
    requestPE: {
      type: String,
      default: ''
      //required: true,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

export default User;
