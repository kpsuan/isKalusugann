import React, { useState, useEffect } from 'react';
import { getStorage, ref, getMetadata } from 'firebase/storage';
import { useSelector } from 'react-redux';
import { BsFillFileEarmarkArrowDownFill } from 'react-icons/bs';
import FileSettings from "../Annual/components/FileSettings";
import { Card } from 'flowbite-react';

const GetDocsUser = () => {
  const { currentUser } = useSelector((state) => state.user);

  const [metadata, setMetadata] = useState({
    peForm: null,
    labResults: null,
    requestPE: null,
  });

  const titleMap = {
    peForm: "Periodic Health Examination Form",
    labResults: "Compressed Lab Results",
    requestPE: "Request for PE",
  };

  const storage = getStorage();

  // Function to remove numeric prefix
  const removeNumericPrefix = (fileName) => {
    return fileName.replace(/^\d+/g, '').trim();
  };

  // Convert bytes to megabytes
  const bytesToMB = (bytes) => {
    return (bytes / (1024 * 1024)).toFixed(2); // Convert bytes to MB and limit to 2 decimal places
  };

  // Function to fetch metadata
  const fetchMetadata = async (url, key) => {
    try {
      const filePath = decodeURIComponent(url.split('/o/')[1].split('?')[0]);
      const storageRef = ref(storage, filePath);
      const fileMetadata = await getMetadata(storageRef);

      setMetadata(prevMetadata => ({
        ...prevMetadata,
        [key]: {
          ...fileMetadata,
          name: removeNumericPrefix(fileMetadata.name),
          size: bytesToMB(fileMetadata.size), // Convert size to MB
        },
      }));
    } catch (error) {
      console.error('Error fetching metadata:', error);
    }
  };

  useEffect(() => {
    if (currentUser) {
      const { peForm, labResults, requestPE } = currentUser;

      if (peForm) fetchMetadata(peForm, 'peForm');
      if (labResults) fetchMetadata(labResults, 'labResults');
      if (requestPE) fetchMetadata(requestPE, 'requestPE');
    }
  }, [currentUser]);

  // Handler to stop click event from propagating
  const handleFileSettingsClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="flex flex-col">
      {/* Display documents */}
      {Object.entries(metadata).map(([key, doc]) => (
        <div key={key} className="flex mb-4">
          <div className="flex flex-col w-1/2">
            <h1 className="text-lg font-medium mb-4">
                      {titleMap[key] || key} {/* Display custom title */}
                    </h1>
              <Card className="p-5 bg-gray-50 transition duration-300 ease-in-out transform hover:shadow-lg cursor-pointer">
                <div className="flex">
                  <div className="flex items-center w-full">
                    <h5 className="text-2xl font-light tracking-tight text-gray-900 dark:text-white">
                      <BsFillFileEarmarkArrowDownFill />
                    </h5>
                    <div className="flex flex-col ml-4">
                    <a href={currentUser[key]} target="_blank" rel="noopener noreferrer" className="flex-1">
                      <p className="font-medium text-blue-500 dark:text-gray-400 hover:underline">
                        {doc ? doc.name : 'No file'}
                      </p>
                    </a>
                      <p className="font-normal text-sm text-gray-400 dark:text-gray-400">
                        {doc ? `${doc.size} MB | ${new Date(doc.updated).toLocaleString()}` : ''}
                      </p>
                    </div>
                  </div>
                  <div onClick={handleFileSettingsClick}>
                    <FileSettings />
                  </div>
                </div>
              </Card>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GetDocsUser;
