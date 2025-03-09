import React, { useState, useEffect } from "react";

const ApprovalWarning = ({ user }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [bounce, setBounce] = useState(false);

  // Animation effect
  useEffect(() => {
    const bounceInterval = setInterval(() => {
      setBounce((prev) => !prev);
    }, 1500);

    return () => {
      clearInterval(bounceInterval);
    };
  }, []);

  // Check which submissions are missing
  const missingSubmissions = [];

  if (!user.peForm) {
    missingSubmissions.push("Missing PE form submission");
  }

  if (!user.labResults) {
    missingSubmissions.push("Missing laboratory results");
  }

  if (!user.requestPE) {
    missingSubmissions.push("Missing request for PE");
  }

  if (!user.medcertUser) {
    missingSubmissions.push("Missing medcert from their doctor");
  }

  // If all files are submitted, show "Fit for Approval"
  if (missingSubmissions.length === 0) {
    return (
      <div className="fixed top-20 right-8 max-w-md z-50">
        <div
          className={`bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-lg ${
            bounce ? "translate-y-1" : "translate-y-0"
          } transition-transform duration-300`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg
                className="h-6 w-6 text-green-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-green-800">Fit for Approval</h3>
              <p className="mt-2 text-sm text-green-700">
                All required documents have been submitted.
              </p>
              <div className="mt-4">
                <button
                  type="button"
                  className="bg-green-50 px-2 py-1.5 rounded-md text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  onClick={() => setIsVisible(false)}
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show missing files warning
  if (!isVisible) return null;

  return (
    <div className="fixed top-20 right-8 max-w-md z-50">
      <div
        className={`bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-lg ${
          bounce ? "translate-y-1" : "translate-y-0"
        } transition-transform duration-300`}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="h-6 w-6 text-red-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-lg font-medium text-red-800">Not Fit for Approval</h3>
            <div className="mt-2 text-sm text-red-700">
              <ul className="list-disc pl-5 space-y-1">
                {missingSubmissions.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="mt-4">
              <button
                type="button"
                className="bg-red-50 px-2 py-1.5 rounded-md text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={() => setIsVisible(false)}
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApprovalWarning;
