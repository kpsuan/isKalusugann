import React, { useState, useEffect } from 'react';
import { getStorage, ref, getMetadata, deleteObject } from 'firebase/storage';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  Calendar, 
  FileWarning,
  Trash2,
  Upload,
  ExternalLink
} from 'lucide-react';

const GetDocsUser = () => {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  const [metadata, setMetadata] = useState({
    peForm: null,
    labResults: null,
    requestPE: null,
  });

  const titleMap = {
    peForm: "Periodic Health Examination Form",
    labResults: "Laboratory Results",
    requestPE: "Request for Physical Examination",
  };

  const iconMap = {
    peForm: "📋",
    labResults: "🔬",
    requestPE: "📝",
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

  // Handle file removal
  const handleFileRemove = async (fileType) => {
    const fileUrl = currentUser[fileType]; // Get the file URL from currentUser
    if (!fileUrl) return;

    try {
      const filePath = decodeURIComponent(fileUrl.split('/o/')[1].split('?')[0]);
      const fileRef = ref(storage, filePath);

      // Delete the file from Firebase Storage
      await deleteObject(fileRef);
      console.log(`${fileType} deleted successfully`);

      // Update metadata state after deletion
      setMetadata((prevMetadata) => ({
        ...prevMetadata,
        [fileType]: null,
      }));
    } catch (error) {
      console.error(`Error deleting ${fileType}:`, error);
    }
  };

  const redirectToFileSubmissions = () => {
    navigate('/fileSubmissions'); // Redirect to the file submission page
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };



  return (
    <div className="min-h-screen bg-gray-50 p-2">
      <div className="max-w-6xl mx-auto">
        
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 w-3/4 gap-4">
          {Object.entries(metadata).map(([key, doc], index) => (
            <motion.div
              key={key}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
              onHoverStart={() => setHoveredCard(key)}
              onHoverEnd={() => setHoveredCard(null)}
              className="relative p-3"
            >
              <div className={`
                bg-gray-50 rounded-xl shadow-sm p-6 
                transform transition-all duration-300
                ${hoveredCard === key ? 'shadow-xl scale-105' : ''}
              `}>
                <div className="flex items-center mb-4">
                  <span className="text-2xl mr-3">{iconMap[key]}</span>
                  <h2 className="text-lg font-semibold text-gray-800">{titleMap[key]}</h2>
                </div>

                {doc ? (
                  <div className="space-y-4">
                    <div className="flex items-center text-gray-600">
                      <FileText className="w-4 h-4 mr-2" />
                      <span className="truncate">{doc.name}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-500 text-sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{new Date(doc.updated).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-500 text-sm">
                      <Download className="w-4 h-4 mr-2" />
                      <span>{doc.size} MB</span>
                    </div>

                    <div className="flex space-x-3 mt-6">
                      <a
                        href={currentUser[key]}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View
                      </a>

                      {showDeleteConfirm === key ? (
                        <button
                          onClick={() => handleFileRemove(key)}
                          className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Confirm Delete
                        </button>
                      ) : (
                        <button
                          onClick={() => handleFileRemove(key)}
                          className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <motion.div
                    className="flex flex-col items-center py-8 text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <FileWarning className="w-12 h-12 mb-4" />
                    <p className="text-center mb-4">No file uploaded yet</p>
                    <button
                      onClick={() => navigate('/fileSubmissions')}
                      className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Now
                    </button>
                  </motion.div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GetDocsUser;