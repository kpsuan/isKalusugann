import React, { useState, useRef, useEffect } from 'react';

const TermsModal = ({ isOpen, onClose, onAccept }) => {
    const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
    const contentRef = useRef(null);

    const handleScroll = (e) => {
        const element = e.target;
        const isAtBottom = Math.abs(element.scrollHeight - element.scrollTop - element.clientHeight) < 1;
        if (isAtBottom) {
            setHasScrolledToBottom(true);
        }
    };

    useEffect(() => {
        if (!isOpen) {
            setHasScrolledToBottom(false);
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full mx-4">
                <div className="p-6 border-b">
                    <h2 className="text-2xl font-bold">Terms and Conditions</h2>
                </div>

                <div 
                    ref={contentRef}
                    onScroll={handleScroll}
                    className="p-6 max-h-[60vh] overflow-y-auto"
                >
                    {/* Terms and Conditions Content */}
                    <h3 className="font-bold mb-4">1. General Terms</h3>
                    <p className="mb-4">
                        By using this physical examination scheduling system, you acknowledge and agree to the following terms and conditions.
                    </p>

                    <h4 className="font-semibold">1.1 Accuracy of Information</h4>
                    <ul className="list-disc list-inside mb-4">
                        <li>You agree to provide accurate, current, and complete information during the registration and examination process.</li>
                        <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
                        <li>You certify that all submitted medical information and documentation is truthful and accurate.</li>
                    </ul>

                    <h3 className="font-bold mb-4">2. Online Submission Option</h3>
                    <h4 className="font-semibold">2.1 Documentation Requirements</h4>
                    <ul className="list-disc list-inside mb-4">
                        <li>All uploaded medical documents must be clear, legible, and in the required format.</li>
                        <li>Documents must be issued by licensed healthcare providers and dated within the last six months.</li>
                        <li>You are responsible for the authenticity of submitted documents.</li>
                    </ul>

                    <h4 className="font-semibold">2.2 Privacy and Data Security</h4>
                    <ul className="list-disc list-inside mb-4">
                        <li>Your medical information will be handled in accordance with the <b>Data Privacy Act of 2012 (RA 10173)</b>.</li>
                        <li>Uploaded documents will be stored securely and accessed only by authorized personnel.</li>
                        <li>You consent to the electronic storage and processing of your medical information for purposes related to the annual physical examination.</li>
                        <li>Your data will not be shared with third parties without your explicit consent, except when required by law.</li>
                    </ul>

                    <h3 className="font-bold mb-4">3. In-Person Examination Option</h3>
                    <h4 className="font-semibold">3.1 Examination Protocols</h4>
                    <ul className="list-disc list-inside mb-4">
                        <li>You must follow all health and safety protocols during the examination.</li>
                        <li>You agree to comply with all instructions from medical personnel.</li>
                        <li>You must disclose any relevant medical conditions or concerns.</li>
                    </ul>

                    <h3 className="font-bold mb-4">4. Data Usage and Privacy</h3>
                    <h4 className="font-semibold">4.1 Information Collection and Use</h4>
                    <ul className="list-disc list-inside mb-4">
                        <li>We collect personal and medical information necessary for the examination.</li>
                        <li>Your information may be shared with relevant medical staff and administrators for examination purposes.</li>
                        <li>Data will be used solely for medical evaluation and institutional record-keeping.</li>
                    </ul>

                    <h4 className="font-semibold">4.2 Data Protection and User Rights</h4>
                    <ul className="list-disc list-inside mb-4">
                        <li>Your information is protected by institutional security measures, in compliance with <b>RA 10173</b>.</li>
                        <li>Access to your data is restricted to authorized personnel only.</li>
                        <li>You have the right to:
                            <ul className="list-disc list-inside ml-4">
                                <li>Request access to your stored information.</li>
                                <li>Correct any inaccurate or outdated personal data.</li>
                                <li>Withdraw consent for data processing, subject to legal and institutional requirements.</li>
                                <li>Request deletion of personal data, except when retention is required by law.</li>
                            </ul>
                        </li>
                    </ul>

                    <h3 className="font-bold mb-4">5. Disclaimer and Limitations</h3>
                    <h4 className="font-semibold">5.1 Service Availability</h4>
                    <ul className="list-disc list-inside mb-4">
                        <li>The scheduling system may experience occasional downtime for maintenance.</li>
                        <li>Available appointment slots are subject to change.</li>
                        <li>The institution reserves the right to modify examination requirements.</li>
                    </ul>

                    <h4 className="font-semibold">5.2 Liability</h4>
                    <ul className="list-disc list-inside mb-4">
                        <li>The institution is not liable for any technical issues preventing submission.</li>
                        <li>Users are responsible for maintaining copies of submitted documents.</li>
                        <li>The institution reserves the right to verify any submitted information.</li>
                    </ul>

                    <h3 className="font-bold mb-4">6. Modifications</h3>
                    <p>
                        The institution reserves the right to modify these terms and conditions at any time. Users will be notified of any significant changes.
                    </p>

                    <p className="font-bold mt-4">
                        By checking the terms and conditions box, you acknowledge that you have read, understood, and agree to be bound by these terms.
                    </p>
                </div>

                <div className="p-6 border-t flex justify-end items-center bg-gray-50">
                    {!hasScrolledToBottom && (
                        <p className="text-amber-600 mr-4">
                            Please scroll to the bottom to accept
                        </p>
                    )}
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 mr-2"
                    >
                        Close
                    </button>
                    <button
                        onClick={onAccept}
                        disabled={!hasScrolledToBottom}
                        className={`px-4 py-2 rounded ${
                            hasScrolledToBottom
                                ? 'bg-green-600 text-white hover:bg-green-700'
                                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        Accept
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TermsModal;
