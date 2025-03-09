import React, { useState, useRef } from 'react';
import { HiOutlineX, HiOutlineDocumentAdd, HiOutlineDocumentDownload } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { ACCOUNT_CREATED_TEMPLATE } from '../../../../../../api/utils/emailTemplate';
import axios from 'axios';

const ImportStudentsModal = ({ isOpen, onClose }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type === 'application/json' || selectedFile.type === 'text/csv') {
        setFile(selectedFile);
      } else {
        toast.error('Unsupported file format. Please use JSON or CSV.');
      }
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error('Please select a file first');
      return;
    }

    setLoading(true);
    const loadingToastId = toast.loading("Importing students...");
    
    const fileReader = new FileReader();
    fileReader.onload = async (e) => {
      try {
        let importedData;
        
        // Parse the file based on its type
        if (file.type === 'application/json') {
          importedData = JSON.parse(e.target.result);
        } else if (file.type === 'text/csv') {
          // CSV parsing
          const csvRows = e.target.result.split('\n');
          const headers = csvRows[0].split(',');
          
          importedData = csvRows.slice(1)
            .filter(row => row.trim()) // Skip empty rows
            .map(row => {
              const values = row.split(',');
              const student = {};
              
              headers.forEach((header, index) => {
                // Handle boolean values
                if (values[index]?.trim().toLowerCase() === 'true') {
                  student[header.trim()] = true;
                } else if (values[index]?.trim().toLowerCase() === 'false') {
                  student[header.trim()] = false;
                } else {
                  student[header.trim()] = values[index]?.trim() || '';
                }
              });
              
              return student;
            });
        }
        
        // Validate required fields
        const validatedData = importedData.filter(student => {
          const requiredFields = ['username', 'email', 'password', 'firstName', 'lastName', 'college', 'degreeProgram', 'yearLevel'];
          return requiredFields.every(field => student[field] && student[field].toString().trim() !== '');
        });

        if (validatedData.length === 0) {
          toast.update(loadingToastId, {
            render: "No valid student data found. Please check your file format.",
            type: "error",
            isLoading: false,
            autoClose: 3000
          });
          setLoading(false);
          return;
        }

        // Send to backend API
        const response = await fetch('/api/auth/import', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ students: validatedData }),
        });

        const result = await response.json();
        
        if (!response.ok) {
          throw new Error(result.message || 'Failed to import students');
        }

        // Send emails to successfully imported users
      for (const student of validatedData) {
        let emailContent = ACCOUNT_CREATED_TEMPLATE
          .replace('{firstName}', student.firstName)
          .replace('{email}', student.email)
          .replace('{password}', student.password);

        try {
          await axios.post('/api/email/emailUser', {
            email: student.email,
            subject: 'isKalusugan Account Created',
            html: emailContent // Use html instead of text for formatted email
          });
        } catch (emailError) {
          console.error(`Failed to send email to ${student.email}:`, emailError);
        }
      }

        // Show results
        if (result.results.failed > 0) {
          toast.update(loadingToastId, {
            render: `Imported ${result.results.successful} students. ${result.results.failed} failed.`,
            type: "warning",
            isLoading: false,
            autoClose: 5000
          });
          
          // Log errors for debugging
          console.log("Import errors:", result.results.errors);
        } else {
          toast.update(loadingToastId, {
            render: `Successfully imported ${result.results.successful} students!`,
            type: "success",
            isLoading: false,
            autoClose: 3000
          });
          navigate('/manage-students')
        }
                // Reload the page to reflect changes
       
        
      } catch (error) {
        toast.update(loadingToastId, {
          render: 'Error: ' + (error.message || 'Unknown error occurred'),
          type: "error",
          isLoading: false,
          autoClose: 3000
        });
        console.error("Import error:", error);
      } finally {
        setLoading(false);
      }
    };

    fileReader.readAsText(file);
  };

  const handleDownloadTemplate = () => {
    // Create CSV template
    const headers = 'firstName,middleName,lastName,username,email,password,college,degreeProgram,yearLevel,isGraduating\n';
    const exampleRow = 'John,Smith,Doe,johndoe,john.doe@up.edu.ph,password123,CAS,COMPUTER SCIENCE,3rd,false\n';
    
    // Create and download file
    const blob = new Blob([headers, exampleRow], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'student_import_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success('Template downloaded successfully');
  };

  if (!isOpen) return null;

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
      
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl transform transition-all">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-2xl p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">Import Students</h2>
                <button
                  onClick={onClose}
                  className="text-white hover:bg-blue-700 rounded-full p-2 transition-colors"
                >
                  <HiOutlineX className="w-6 h-6" />
                </button>
              </div>
              <p className="text-blue-100 mt-2">Import multiple students from a CSV or JSON file</p>
            </div>

            {/* Content */}
            <div className="p-6">
              <div className="space-y-6">
                {/* Template download */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-0.5">
                      <HiOutlineDocumentDownload className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-blue-800">Need a template?</h3>
                      <div className="mt-1 text-sm text-blue-700">
                        <p>Download a sample CSV template to see the required format.</p>
                      </div>
                      <div className="mt-2">
                        <button
                          type="button"
                          onClick={handleDownloadTemplate}
                          className="inline-flex items-center px-3 py-1.5 border border-blue-600 text-xs font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                          Download Template
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* File upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select File
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      <HiOutlineDocumentAdd className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex flex-col items-center text-sm text-gray-600">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500">
                          <span>Select a file</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            ref={fileInputRef}
                            type="file"
                            accept=".csv,.json"
                            className="sr-only"
                            onChange={handleFileChange}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        CSV or JSON up to 10MB
                      </p>
                    </div>
                  </div>
                  {file && (
                    <div className="mt-2 text-sm text-gray-600">
                      Selected file: <span className="font-medium">{file.name}</span>
                    </div>
                  )}
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-yellow-800">Required fields</h3>
                      <div className="mt-2 text-sm text-yellow-700">
                        <p>
                          The following fields are required for each student:
                        </p>
                        <ul className="list-disc list-inside mt-1">
                          <li>firstName, lastName, username</li>
                          <li>email, password</li>
                          <li>college, degreeProgram, yearLevel</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleImport}
                  disabled={!file || loading}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Importing...
                    </>
                  ) : (
                    'Import Students'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ImportStudentsModal;