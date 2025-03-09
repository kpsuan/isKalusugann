import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { toJpeg } from 'html-to-image';
import { format } from 'date-fns';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


const MedicalCertificate = () => {
  const certificateRef = useRef(null);
  const { userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(true); // TODO: Replace with actual admin check
  

  const queryParams = new URLSearchParams(window.location.search);
  const stateKey = queryParams.get('stateKey');

  let stateData = null;
  if (stateKey) {
    try {
      const storedState = sessionStorage.getItem(stateKey);
      if (storedState) {
        stateData = JSON.parse(storedState);
        sessionStorage.removeItem(stateKey);
      }
    } catch (error) {
      console.error('Error parsing state data:', error);
    }
  }
  
  const { medicalRemark, approvers, status } = stateData || {
    medicalRemark: '',
    status: '',
    approvers: {
      dentist: { name: '', license: '', approved: false },
      doctor: { name: '', license: '', approved: false },
      studentDetails: { firstName: '', lastName: '', middleName: '', username: '' }
    }
  };
  
  const [medicalDetails, setMedicalDetails] = useState({
    dentistName: approvers.dentist.name || '',
    dentistLicense: approvers.dentist.license || '',
    dentistSignature: null,
    dentistApproved: approvers.dentist.approved || false,
    physicianName: approvers.doctor.name || '',
    physicianLicense: approvers.doctor.license || '',
    physicianSignature: null,
    physicianApproved: approvers.doctor.approved || false,

    dentistApprovedDate: approvers.dentist.approvedDate || '', // Add this line
    physicianApprovedDate: approvers.doctor.approvedDate || '', // Add this line

    useDigitalSignature: {
      dentist: true,
      physician: true
    }
  });

  const handleSignatureUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMedicalDetails(prev => ({
          ...prev,
          [`${type}Signature`]: reader.result,
          useDigitalSignature: {
            ...prev.useDigitalSignature,
            [type]: false
          }
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleSignatureType = (type) => {
    setMedicalDetails(prev => ({
      ...prev,
      useDigitalSignature: {
        ...prev.useDigitalSignature,
        [type]: !prev.useDigitalSignature[type]
      },
      [`${type}Signature`]: null
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setMedicalDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const onButtonClick = useCallback(() => {
    if (certificateRef.current === null) {
      return;
    }

    toJpeg(certificateRef.current, { quality: 0.95, cacheBust: true, backgroundColor: "#ffffff" }) 
    .then((dataUrl) => {
      const fileName = `${approvers.studentDetails.lastName}_medcert.jpg`;
      const link = document.createElement('a');
      link.download = fileName;
      link.href = dataUrl;
      link.click();
    })
      .catch((err) => {
        console.log(err);
      });
  }, [navigate, approvers.studentDetails.lastName]);

  const handleDownloadPDF = () => {
    const input = certificateRef.current;
    
    html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 30;
      
      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`medical_certificate_${approvers.studentDetails.lastName}.pdf`);
    });
  };

  

  
  const currentDate = format(new Date(), 'MMMM d, yyyy');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {isAdmin && (
          <>
            <div className='text-2xl justify-center font-semibold text-gray-900 mb-6'>isKalusugan Medcert Generator</div>
            <div className="bg-white rounded-lg shadow-md mb-8">
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Medical Staff Details</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Dentist Section */}
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="text-blue-900 font-medium mb-4">Dentist Information</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="dentistName"
                            value={medicalDetails.dentistName}
                            onChange={handleInputChange}
                            className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter dentist's name" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            License Number
                          </label>
                          <input
                            type="text"
                            name="dentistLicense"
                            value={medicalDetails.dentistLicense}
                            onChange={handleInputChange}
                            className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter license number" />
                        </div>

                        {/* Signature selection */}
                        <div className="mt-3">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Signature Type
                          </label>
                          <div className="flex space-x-4">
                            <button
                              type="button"
                              onClick={() => handleToggleSignatureType('dentist')}
                              className={`px-3 py-2 text-sm font-medium rounded-md ${
                                medicalDetails.useDigitalSignature.dentist
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-200 text-gray-800'
                              }`}
                            >
                              Digital Text
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleSignatureType('dentist')}
                              className={`px-3 py-2 text-sm font-medium rounded-md ${
                                !medicalDetails.useDigitalSignature.dentist
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-200 text-gray-800'
                              }`}
                            >
                              Upload Image
                            </button>
                          </div>
                        </div>

                        {/* Conditional rendering based on signature type */}
                        {medicalDetails.useDigitalSignature.dentist ? (
                          <div className="bg-gray-100 p-3 rounded-md">
                            <p className="text-sm text-gray-700">
                              Certificate will show "Digitally signed by {medicalDetails.dentistName || '[Dentist Name]'}"
                            </p>
                          </div>
                        ) : (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Signature
                            </label>
                            <div className="mt-1 flex items-center">
                              <label className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                                <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                Upload Signature
                                <input
                                  type="file"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={(e) => handleSignatureUpload(e, 'dentist')} />
                              </label>
                            </div>
                            {medicalDetails.dentistSignature && (
                              <div className="mt-2">
                                <p className="text-xs text-gray-500 mb-1">Preview:</p>
                                <img 
                                  src={medicalDetails.dentistSignature}
                                  alt="Signature Preview" 
                                  className="h-12 object-contain border border-gray-200 rounded"
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Physician Section */}
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="text-blue-900 font-medium mb-4">Physician Information</h4>
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="physicianName"
                            value={medicalDetails.physicianName}
                            onChange={handleInputChange}
                            className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter physician's name" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            License Number
                          </label>
                          <input
                            type="text"
                            name="physicianLicense"
                            value={medicalDetails.physicianLicense}
                            onChange={handleInputChange}
                            className="w-full p-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Enter license number" />
                        </div>

                        {/* Signature selection */}
                        <div className="mt-3">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Signature Type
                          </label>
                          <div className="flex space-x-4">
                            <button
                              type="button"
                              onClick={() => handleToggleSignatureType('physician')}
                              className={`px-3 py-2 text-sm font-medium rounded-md ${
                                medicalDetails.useDigitalSignature.physician
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-200 text-gray-800'
                              }`}
                            >
                              Digital Text
                            </button>
                            <button
                              type="button"
                              onClick={() => handleToggleSignatureType('physician')}
                              className={`px-3 py-2 text-sm font-medium rounded-md ${
                                !medicalDetails.useDigitalSignature.physician
                                  ? 'bg-blue-600 text-white'
                                  : 'bg-gray-200 text-gray-800'
                              }`}
                            >
                              Upload Image
                            </button>
                          </div>
                        </div>

                        {/* Conditional rendering based on signature type */}
                        {medicalDetails.useDigitalSignature.physician ? (
                          <div className="bg-gray-100 p-3 rounded-md">
                            <p className="text-sm text-gray-700">
                              Certificate will show "Digitally signed by {medicalDetails.physicianName || '[Physician Name]'}"
                            </p>
                          </div>
                        ) : (
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Signature
                            </label>
                            <div className="mt-1 flex items-center">
                              <label className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                                <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                                Upload Signature
                                <input
                                  type="file"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={(e) => handleSignatureUpload(e, 'physician')} />
                              </label>
                            </div>
                            {medicalDetails.physicianSignature && (
                              <div className="mt-2">
                                <p className="text-xs text-gray-500 mb-1">Preview:</p>
                                <img 
                                  src={medicalDetails.physicianSignature}
                                  alt="Signature Preview" 
                                  className="h-12 object-contain border border-gray-200 rounded"
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="bg-white rounded-lg shadow-md mb-6">
          <div ref={certificateRef} className="p-8 relative">
            {/* Certificate Border */}
            <div className="absolute inset-0 border-8 border-blue-900 rounded-lg pointer-events-none" />
            
            {/* Header */}
            <div className="relative z-10 text-center mb-8">
              <div className="w-24 h-24 mx-auto mb-4">
                <img 
                  src="https://newsinfo.inquirer.net/files/2020/07/UP-Visayas-620x620.jpg" 
                  alt="University Logo" 
                  className="w-full h-full object-cover rounded-full border-4 border-blue-900"
                />
              </div>
              <h2 className="text-2xl font-bold text-blue-900">University of the Philippines Visayas</h2>
              <h3 className="text-xl font-semibold text-gray-800 mt-1">HEALTH SERVICES UNIT</h3>
              <p className="text-gray-600">Miagao, Iloilo</p>
            </div>

            {/* Certificate Title */}
            <h1 className="text-center text-2xl font-bold text-gray-900 mb-8">MEDICAL CERTIFICATE</h1>

            {/* Content */}
            <div className="space-y-6 max-w-2xl mx-auto">
              <p className="text-gray-800 font-medium">TO WHOM IT MAY CONCERN:</p>
              
              <p className="text-gray-800">
                This is to certify that{' '}
                <span className="font-bold text-blue-900">
                  {`${approvers.studentDetails.firstName} ${approvers.studentDetails.middleName || ''} ${approvers.studentDetails.lastName}`}
                </span>{' '}
                with Student ID <span className="font-semibold">{approvers.studentDetails.username}</span> has passed the Dental and Medical Examination
              </p>

              {/* Status */}
              <div className={`p-4 rounded-lg border-l-4 ${
                status === 'Approved' 
                  ? 'bg-green-100 border-green-500' 
                  : status === 'Rejected' 
                    ? 'bg-red-100 border-red-500' 
                    : 'bg-blue-100 border-blue-500'
              }`}>
                <h3 className={`text-md font-semibold mb-1 ${
                  status === 'Approved' 
                    ? 'text-green-900' 
                    : status === 'Rejected' 
                      ? 'text-red-900' 
                      : 'text-blue-900'
                }`}>Status:</h3>
                <p className={`font-semibold ${
                  status === 'Approved' 
                    ? 'text-green-700' 
                    : status === 'Rejected' 
                      ? 'text-red-700' 
                      : 'text-blue-700'
                }`}>{status}</p>
              </div>

              {/* Medical Remarks */}
              {medicalRemark && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-md font-semibold text-blue-900 mb-2">Medical Remarks:</h3>
                  <div dangerouslySetInnerHTML={{ __html: medicalRemark }} className="text-gray-700" />
                </div>
              )}

              
              {/* Signatures */}
              <div className="mt-16 grid md:grid-cols-2 gap-8">
                {/* Dentist Signature */}
                <div className="text-center">
                  {medicalDetails.useDigitalSignature.dentist ? (
                    <div className="h-16 flex items-end justify-center mb-2">
                      <p className="text-blue-800 italic">Digitally signed by</p>
                    </div>
                  ) : medicalDetails.dentistSignature ? (
                    <img 
                      src={medicalDetails.dentistSignature} 
                      alt="Dentist Signature"
                      className="w-48 h-16 object-contain mx-auto mb-2"
                    />
                  ) : medicalDetails.dentistApproved ? (
                    <div className="h-16 flex items-end justify-center mb-2">
                      <p className="text-blue-800 italic">Digitally signed by</p>
                    </div>
                  ) : (
                    <div className="h-16 mb-2"></div>
                  )}
                  <div className="border-b-2 border-gray-900 w-48 mx-auto mb-2"></div>
                  <p className="font-semibold text-gray-900">
                    {medicalDetails.dentistName || 'University Dentist'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Lic. No. {medicalDetails.dentistLicense || ''}
                  </p>
                </div>

                {/* Physician Signature */}
                <div className="text-center">
                  {medicalDetails.useDigitalSignature.physician ? (
                    <div className="h-16 flex items-end justify-center mb-2">
                      <p className="text-blue-800 italic">Digitally signed by</p>
                    </div>
                  ) : medicalDetails.physicianSignature ? (
                    <img 
                      src={medicalDetails.physicianSignature} 
                      alt="Physician Signature"
                      className="w-48 h-16 object-contain mx-auto mb-2"
                    />
                  ) : medicalDetails.physicianApproved ? (
                    <div className="h-16 flex items-end justify-center mb-2">
                      <p className="text-blue-800 italic">Digitally signed by</p>
                    </div>
                  ) : (
                    <div className="h-16 mb-2"></div>
                  )}
                  <div className="border-b-2 border-gray-900 w-48 mx-auto mb-2"></div>
                  <p className="font-semibold text-gray-900">
                    {medicalDetails.physicianName || 'University Physician'}
                  </p>
                  <p className="text-sm text-gray-600">
                    Lic. No. {medicalDetails.physicianLicense || ''}
                  </p>
                </div>
              </div>

              {/* Date of issuance */}
              <div className="text-center mt-8 pt-6 border-t border-gray-200">
                <p className="text-gray-600">This certificate is issued on {currentDate}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-4">
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center justify-center px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors shadow-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </button>
          
          <button 
            onClick={onButtonClick}
            className="flex-1 flex items-center justify-center px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors shadow-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Certificate
          </button>
          
          <button 
            onClick={handleDownloadPDF}
            className="flex items-center justify-center px-6 py-3 bg-red-700 text-white rounded-lg hover:bg-red-600 transition-colors shadow-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default MedicalCertificate;