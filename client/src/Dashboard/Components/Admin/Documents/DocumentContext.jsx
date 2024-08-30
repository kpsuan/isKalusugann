import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const DocumentContext = createContext();

export const useDocument = () => useContext(DocumentContext);

export const DocumentProvider = ({ children }) => {
  const [docs, setDocs] = useState([]);

  useEffect(() => {
    // Fetch documents on mount
    const fetchDocs = async () => {
      try {
        const response = await axios.get('/api/docs/getdocuments');
        setDocs(response.data.docs);
      } catch (error) {
        console.error("Error fetching documents:", error);
      }
    };

    fetchDocs();
  }, []);

  const refreshDocs = async () => {
    try {
      const response = await axios.get('/api/docs/getdocuments');
      setDocs(response.data.docs);
    } catch (error) {
      console.error("Error refreshing documents:", error);
    }
  };

  return (
    <DocumentContext.Provider value={{ docs, refreshDocs }}>
      {children}
    </DocumentContext.Provider>
  );
};
