import React from 'react';
import { Card } from 'flowbite-react';

const LabForm = ({ formData, handleDocumentChange }) => {
  const medicalTests = [
    { id: "cbc", label: "Complete Blood Count (CBC)", description: "Basic blood screening test" },
    { id: "plateletCount", label: "Platelet Count", description: "Measures blood platelet levels" },
    { id: "urinalysis", label: "Urinalysis", description: "Examines urine composition" },
    { id: "fecalysis", label: "Fecalysis", description: "Stool examination" },
    { id: "xRay", label: "X-Ray", description: "Diagnostic imaging" },
    { id: "ecg12Leads", label: "ECG 12 Leads", description: "Heart activity recording" },
    { id: "drugTest", label: "Drug Test", description: "Substance screening" },
    { id: "others", label: "Other Tests", description: "Additional examinations" }
  ];

  return (
    <Card className="max-w-2xl">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Medical Test Requests
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
          <span className="w-4 h-4" />
          Select the required medical tests for the patient
        </p>
      </div>

      <div className="space-y-3">
        {medicalTests.map(({ id, label, description }) => (
          <div
            key={id}
            className="flex p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            <div className="flex items-center h-5">
              <input
                id={id}
                aria-describedby={`${id}-description`}
                type="checkbox"
                onChange={handleDocumentChange}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              />
            </div>
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
        ))}
      </div>
    </Card>
  );
};

export default LabForm;