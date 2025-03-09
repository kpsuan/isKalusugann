import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { Card, Label, Textarea } from 'flowbite-react';

import LabForm from './LabForm';


export default function RequestForm() {
  const dispatch = useDispatch();
  const { currentUser, loading, error } = useSelector((state) => state.user);

  const [purpose, setPurpose] = useState('');
  const [isAnnualPE, setIsAnnualPE] = useState(false); // Track the checkbox state


  const [formData, setFormData] = useState({
    studentNumber: '',
    firstName: '',
    middleName: '',
    lastName: '',
    yearLastAttended: '',
    birthday: '',
    email: '',
    contactNumber: '',
    age: '',
    sex: '',
    degreeLevel: '',
    yearLevel: '',
    college: '',
    degreeProgram: '',
    documentRequest: {
      cbc: false,
      plateletCount: false,
      urinalysis: false,
      fecalysis: false,
      xRay: false,
      ecg12Leads: false,
      drugTest: false,
      others: '',
    },
    dateRequested: '',
    dateUpdated: '',
    status: 'pending',
    comment: '',
    signedRequestForm: '',
    trackingNumber: '',
    userID: '',
    purpose: ''
  });

  // Populate formData with currentUser data
  useEffect(() => {
    if (currentUser) {
      setFormData((prev) => ({
        ...prev,
        studentNumber: currentUser.username || '',
        firstName: currentUser.firstName || '',
        middleName: currentUser.middleName || '',
        lastName: currentUser.lastName || '',
        birthday: currentUser.dateOfBirth || '',
        email: currentUser.email || '',
        contactNumber: currentUser.contactNumber || '',
        age: currentUser.age || '',
        sex: currentUser.gender || '',
        degreeLevel: currentUser.degreeLevel || '',
        yearLevel: currentUser.yearLevel || '',
        college: currentUser.college || '',
        degreeProgram: currentUser.degreeProgram || '',
        userId: currentUser.userId || '', 
      }));
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { id, value, type } = e.target;
    
    if (type === 'radio') {
      setFormData({ ...formData, sex: value });
    } else if (id === 'annualPE') {
      // Handle checkbox change for Annual PE
      setIsAnnualPE(e.target.checked);
      setPurpose(e.target.checked ? 'Annual PE' : formData.purpose); // Set 'Annual PE' if checked
    } else {
      setFormData({ ...formData, [id]: value });
    }
  };
  

  const handleDocumentChange = (e) => {
    const { id, checked } = e.target;
    setFormData({
      ...formData,
      documentRequest: {
        ...formData.documentRequest,
        [id]: checked,
      },
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Set purpose based on checkbox and comment text
    const finalPurpose = isAnnualPE ? 'Annual PE' : formData.purpose;
    
    const formDataToSubmit = { 
      ...formData, 
      purpose: finalPurpose, // Add purpose to form data
    };
    
    try {
      const res = await fetch(`/api/docrequest/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formDataToSubmit),
      });
      const data = await res.json();
      if (data.success === false) {
        toast.error('Something went wrong!');
        return;
      }
      toast.success('Document request submitted successfully!');
    } catch (error) {
      toast.error('Something went wrong!');
    }
  };
  

  return (
      <div className=" min-h-screen flex bg-gray-100">
         <div className="flex ">
                  <Card className='w-full h-full '>
                    
                  <ToastContainer className={"z-50"} />
                  <div className="w-full h-36 overflow-hidden">
                    <img 
                        src="https://media.istockphoto.com/id/1191184417/vector/vector-white-background.jpg?s=612x612&w=0&k=20&c=XZMWqfLdZ3ImrVgeFYzKs8-f_cr_GcD7X5F7cUqAkC8=" 
                        alt="Banner" 
                        className="w-full h-full object-cover" 
                    />
                    </div>

                  <h1 className='text-center pt-3 text-2xl font-bold'>Laboratory Request Form</h1>
                    <div className="text-2xl font-light tracking-tight p-7 text-black dark:text-white">
                      <h1 className='text-2xl font-semibold  text-black '>General Information</h1>
                      <form onSubmit={handleSubmit} className="sm:flex-cols-2 flex flex-col gap-4 mt-4">
                      <div className="flex flex-row gap-3">
                      <div className="col flex-1">
                          <p className="pt-2 text-sm font-medium dark:text-white mb-2">Student Number:</p>
                          <input
                            type="text"
                            id="studentNumber"
                            placeholder={currentUser.username ? currentUser.username : "Student Number"}
                            className="w-full appearance-none rounded-md border border-gray-300 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            onChange={handleChange}
                          />
                        </div>
                        <div className="col flex-1">
                          <p className="pt-2 text-sm font-medium dark:text-white mb-2">First Name:</p>
                          <input
                            type="text"
                            id="firstName"
                            placeholder={currentUser.firstName ? currentUser.firstName : "First Name"}
                            className="w-full appearance-none rounded-md border border-gray-300 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            onChange={handleChange}
                          />
                        </div>
                        <div className="col flex-1">
                          <p className="pt-2 text-sm font-medium dark:text-white mb-2">Middle Name:</p>
                          <input
                            type="text"
                            id="middleName"
                            placeholder={currentUser.middleName ? currentUser.middleName : "Middle Name"}
                            className="w-full appearance-none rounded-md border border-gray-300 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            onChange={handleChange}
                          />
                        </div>
                        <div className="col flex-1">
                          <p className="pt-2 text-sm font-medium dark:text-white mb-2">Last Name:</p>
                          <input
                            type="text"
                            id="lastName"
                            placeholder={currentUser.lastName ? currentUser.lastName : "Last Name"}
                            className="w-full appearance-none rounded-md border border-gray-300 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="flex flex-row gap-3">
                      <div className="col flex-1">
                          <p className="pt-2 text-sm font-medium dark:text-white mb-2">Year Last Attended in UPV:</p>
                          <input
                            type="number"
                            id="yearLastAttended"
                            placeholder="Year"
                            className="w-full appearance-none rounded-md border border-gray-300 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            onChange={handleChange}
                          />
                        </div>
                        <div className="col flex-1">
                          <p className="pt-2 text-sm font-medium dark:text-white mb-2">Birthday:</p>
                          <input
                            type="date"
                            id="birthday"
                            placeholder="Select a date"

                            value={currentUser.dateOfBirth ? currentUser.dateOfBirth.split('T')[0] : ""}
                            className="w-full appearance-none rounded-md border border-gray-300 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            onChange={handleChange}
                          />
                        </div>
                        <div className="col flex-1">
                          <p className="pt-2 text-sm font-medium dark:text-white mb-2">Email:</p>
                          <input
                            type="email"
                            id="email"
                            placeholder={currentUser.email ? currentUser.email : "Email"}
                            className="w-full appearance-none rounded-md border border-gray-300 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            onChange={handleChange}
                          />
                        </div>
                        <div className="col flex-1">
                          <p className="pt-2 text-sm font-medium dark:text-white mb-2">Contact Number:</p>
                          <input
                            type="text"
                            id="contactNumber"
                            placeholder= "Contact Number"
                            className="w-full appearance-none rounded-md border border-gray-300 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            onChange={handleChange}
                          />
                        </div>
                        
                      </div>

                      <div className="flex flex-row gap-3">
                      <div className="col flex-1">
                          <p className="pt-2 text-sm font-medium dark:text-white mb-2">Age:</p>
                          <input
                            type="number"
                            id="age"
                            placeholder="Enter age"
                            className="w-full appearance-none rounded-md border border-gray-300 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            onChange={handleChange}
                          />
                        </div>
                        <div className="col flex-1">
                          <p className="pt-2 text-sm font-medium dark:text-white mb-2">Sex:</p>
                          <select
                            id="sex"
                            className="w-full rounded-md border border-gray-300 bg-white placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            onChange={handleChange}
                            defaultValue={currentUser.gender ? currentUser.gender : "Sex"}
                            >
                            <option value="" disabled>
                                Select sex
                            </option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                            </select>
                        </div>
                      </div>


                        <h1 className='text-2xl  mt-5 font-semibold'>Education</h1>
                        <div className="flex flex-row gap-2">
                          
                          <div className='space-y-6 w-1/2 '>
                            {/* Degree Level */}
                            <div className="mt-1">
                              <label className="block text-sm font-medium text-gray-700 pb-2">
                                Degree Level
                              </label>
                              <select
                                id="degreeLevel"
                                onChange={handleChange}
                                value={formData.degreeLevel}
                                className="block h-10 w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                              >
                                <option value="">{currentUser.degreeLevel ? currentUser.degreeLevel : "Select Degree Level"}</option>
                                <option value="undergraduate">Undergraduate</option>
                                <option value="graduate">Graduate</option>
                              </select>
                            </div>
                          </div>

                          {/* Year Level */}
                          <div className="mt-1 w-1/2">
                            <label className="block text-sm font-medium text-gray-700 pb-2">
                              Year Level
                            </label>
                            <select
                              id="yearLevel"
                              onChange={handleChange}
                              value={formData.yearLevel}
                              className="block h-10 w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            >
                              <option value="">{currentUser.yearLevel ? currentUser.yearLevel : "Year Level"}</option>
                              <option value="1st">1st Year</option>
                              <option value="2nd">2nd Year</option>
                              <option value="3rd">3rd Year</option>
                              <option value="4th">4th Year</option>
                              <option value="5th">5th Year</option>
                            </select>
                          </div>
                        </div>

                        <div className="flex flex-row gap-2">
                          {/* College */}
                          <div className="mt-1 w-1/2">
                            <label className="block text-sm font-medium text-gray-700 pb-2">
                              College
                            </label>
                            <select
                              id="college"
                              onChange={handleChange}
                              value={formData.college}
                              defaultValue={currentUser.college ? currentUser.college : "College"}
                              className="block h-10 w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                            >
                              <option value="" disabled> Select College</option>
                              <option value="CAS">CAS</option>
                              <option value="CFOS">CFOS</option>
                              <option value="CM">CM</option>
                              <option value="SOTECH">SOTECH</option>
                            </select>
                          </div>

                          {/* Degree Program */}
                          {formData.college === 'CAS' && (
                            <div className="mt-1 w-1/2">
                              <label className="block text-sm font-medium text-gray-700 pb-2">
                                Degree Program
                              </label>
                              <select
                                id="degreeProgram"
                                onChange={handleChange}
                                value={formData.degreeProgram}
                                className="block h-10 w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                              >
                                <option value="">{currentUser.degreeProgram ? currentUser.degreeProgram : "Select Degree Program"}</option>
                                <option value="BIOLOGY">BS Biology</option>
                                <option value="PUBLIC HEALTH">BS Public Health</option>
                                <option value="COMMUNICATION AND MEDIA STUDIES">BA Communication and Media Studies</option>
                                <option value="LITERATURE">BA Literature</option>
                                <option value="History"> BA History</option>
                                <option value="COMMUNITY DEVELOPMENT">BA Community Development</option>
                                <option value="ECONOMICS">BS Economics</option>
                                <option value="POLITICAL SCIENCE">BA Political Science</option>
                                <option value="PSYCHOLOGY">BA Psychology</option>
                                <option value="SOCIOLOGY">BA Sociology</option>
                                <option value="APPLIED MATHEMATICS">BS Applied Mathematics</option>
                                <option value="CHEMISTRY">BS Chemistry</option>
                                <option value="COMPUTER SCIENCE">BS Computer Science</option>
                                <option value="STATISTICS">BS Statistics</option>
                              </select>
                            </div>
                          )}

                          {formData.college === 'CFOS' && (
                            <div className="mt-1  w-1/2">
                              <label className="block text-sm font-medium text-gray-700 pb-2">
                                Degree Program
                              </label>
                              <select
                                id="degreeProgram"
                                onChange={handleChange}
                                value={formData.degreeProgram}
                                className="block h-10 w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                              >
                                <option value="">{currentUser.degreeProgram ? currentUser.degreeProgram : "Select Degree Program"}</option>
                                <option value="BS Fisheries">BS Fisheries</option>
                              </select>
                            </div>
                          )}

                          {formData.college === 'CM' && (
                            <div className="mt-1 w-1/2">
                              <label className="block text-sm font-medium text-gray-700 pb-2">
                                Degree Program
                              </label>
                              <select
                                id="degreeProgram"
                                onChange={handleChange}
                                value={formData.degreeProgram}
                                className="block h-10 w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                              >
                                <option value="">{currentUser.degreeProgram ? currentUser.degreeProgram : "Select Degree Program"}</option>
                                <option value="Accountancy">BS Accountancy</option>
                                <option value="Business Administration">BS Business Administration</option>
                                <option value="Management">BS Management</option>
                              </select>
                            </div>
                          )}

                          {formData.college === 'SOTECH' && (
                            <div className="mt-1 w-1/2">
                              <label className="block text-sm font-medium text-gray-700 pb-2">
                                Degree Program
                              </label>
                              <select
                                id="degreeProgram"
                                onChange={handleChange}
                                value={formData.degreeProgram}
                                className="block h-10 w-full appearance-none rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                              >
                                <option value="">{currentUser.degreeProgram ? currentUser.degreeProgram : "Select Degree Program"}</option>
                                <option value="Chemical Engineering">BS Chemical Engineering</option>
                                <option value="Food Technology">BS Food Technology</option>
                              </select>
                            </div>
                          )}
                        </div>


                        <Card className="max-w-full mt-8">
                            <div className="mb-6">
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                Medical Test Requests
                                </h2>
                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">

                                Select all medical test you want to request. Test are to be done in the UPV HSU
                                </p>
                            </div>                        
                            
                            <ul className="">
                                {[
                                    { id: "cbc", label: "Complete Blood Count (CBC)", description: "Basic blood screening test" },
                                    { id: "plateletCount", label: "Platelet Count", description: "Measures blood platelet levels" },
                                    { id: "urinalysis", label: "Urinalysis", description: "Examines urine composition" },
                                    { id: "fecalysis", label: "Fecalysis", description: "Stool examination" },
                                    { id: "xRay", label: "X-Ray", description: "Diagnostic imaging" },
                                    { id: "ecg12Leads", label: "ECG 12 Leads", description: "Heart activity recording" },
                                    { id: "drugTest", label: "Drug Test", description: "Substance screening" },
                                    { id: "other", label: "Other Tests", description: "Additional examinations" }
                                ].map(({ id, label, description }) => (
                                    <li
                                    key={id}
                                    className="flex p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                                    >
                                    <div className="flex items-center ps-3">
                                        <input
                                        id={id}
                                        type="checkbox"
                                        checked={formData.documentRequest[id]}
                                        onChange={handleDocumentChange}
                                        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                        />
                                        
                                        <div className="ml-3 text-sm">
                                            <label
                                            htmlFor={id}
                                            className="font-medium text-gray-900 dark:text-gray-300"
                                            >
                                            {label}
                                            </label>
                                            <p
                                                id={`${id}-description`}
                                                className="text-gray-500 dark:text-gray-400"
                                            >
                                                {description}
                                            </p>
                                        </div>
                                        
                                    </div>

                                    {/* If "Other Tests" is checked, show a text input */}
                                    {id === "other" && formData.documentRequest[id] && (
                                        <div className="ml-6 mt-2">
                                            <input
                                                type="text"
                                                value={formData.documentRequest.others || ""}
                                                onChange={(e) => handleOtherTestsChange(e)}
                                                placeholder="Please specify other tests"
                                                className="w-full p-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white dark:border-gray-500"
                                            />
                                        </div>
                                    )}
                                    </li>
                                ))}
                            </ul>
                        </Card>

                        <Card className="max-w-full mt-8"> 
                          <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Purpose: </h2>
                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                              If for annual PE, check the annual PE checkbox.
                            </p>
                          </div>

                          <ul className="">
                            {[{ id: "annualPE", label: "Annual PE", description: "For Annual PE Requirement" }].map(({ id, label, description }) => (
                              <li
                                key={id}
                                className="flex p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
                              >
                                <div className="flex items-center ps-3">
                                  <input
                                    id={id}
                                    type="checkbox"
                                    checked={isAnnualPE}
                                    onChange={handleChange}
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                                  />
                                  
                                  <div className="ml-3 text-sm">
                                    <label
                                      htmlFor={id}
                                      className="font-medium text-gray-900 dark:text-gray-300"
                                    >
                                      {label}
                                    </label>
                                    <p id={`${id}-description`} className="text-gray-500 dark:text-gray-400">
                                      {description}
                                    </p>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>       

                          <div>
                            <div className="mb-2 block">
                              <Label htmlFor="purpose" value="Enter purpose" />
                            </div>
                            <Textarea
                              id="purpose"
                              placeholder="Enter your comment here..."
                              rows={4}
                              value={formData.purpose} // Bind to formData.comment
                              onChange={handleChange} // Handle change for textarea
                              className="w-full"
                            />
                          </div>
                        </Card>


                        
                        <button className='mt-10 bg-gradient-to-r from-green-500 to-cyan-500 text-white text-lg font-semibold p-3 rounded-lg uppercase hover:from-green-600 hover:to-cyan-600 disabled:opacity-80'>
                          {loading ? 'Loading...' : 'Submit Request'}
                        </button>
                      </form>
                      
                    </div>
                  </Card>

                </div>
                
            </div> 


  );
}