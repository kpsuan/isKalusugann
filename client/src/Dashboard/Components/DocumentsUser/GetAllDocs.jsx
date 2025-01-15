import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import Select from 'react-select';
import { Button, Spinner } from 'flowbite-react';
import { Search, FileText, ExternalLink, Filter } from 'lucide-react';
import { getStorage, ref, getDownloadURL } from "firebase/storage";


const DocumentCard = ({ docs }) => (
  <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100">
    <div className="aspect-w-16 aspect-h-12 overflow-hidden">
      <iframe
        src={docs.content}
        title={docs.title}
        className="w-full h-full border-none"
        loading="lazy"
      />
    </div>
    <div className="p-4">
      <div className="flex items-start justify-between">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 flex-grow">
          {docs.title}
        </h3>
        <FileText className="w-4 h-4 text-gray-400 flex-shrink-0 ml-2" />
      </div>
      <div className="mt-3  grid flex gap-2">
        <Link
          to={docs.content}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex flex-grow items-center justify-center gap-2 rounded-lg bg-green-500 px-4 py-2.5 text-sm font-medium text-white hover:bg-green-600 transition-colors duration-200"
        >
          View Document
          <ExternalLink className="w-4 h-4" />
        </Link>
        
      </div>
    </div>
  </div>
);


const EmptyState = () => (
  <div className="text-center py-12">
    <FileText className="w-12 h-12 mx-auto text-gray-400 mb-4" />
    <h3 className="text-lg font-medium text-gray-900 mb-2">No documents found</h3>
    <p className="text-gray-500">Try adjusting your search or filter criteria</p>
  </div>
);

export default function GetAllDocs() {
  const { currentUser } = useSelector((state) => state.user);
  const [userDocs, setUserDocs] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [filter, setFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const fetchDocs = async (startIndex = 0) => {
    try {
      setLoading(true);
      let url = `/api/docs/getdocuments?startIndex=${startIndex}`;
      
      if (categoryFilter?.value) {
        url += `&category=${categoryFilter.value}`;
      }

      if (filter) {
        url += `&searchTerm=${filter}`;
      }

      const res = await fetch(url);
      const data = await res.json();
      
      if (res.ok) {
        if (startIndex === 0) {
          setUserDocs(data.docs);
        } else {
          setUserDocs(prev => [...prev, ...data.docs]);
        }
        setShowMore(data.docs.length >= 9);
      }
    } catch (error) {
      console.log(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Clear any existing timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Set a new timeout to delay the API call
    const timeout = setTimeout(() => {
      fetchDocs(0);
    }, 300); // 300ms delay

    setSearchTimeout(timeout);

    // Cleanup function
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [filter, categoryFilter]);

  const handleShowMore = () => fetchDocs(userDocs.length);

  const categoryOptions = [
    { value: "", label: "All Categories" },
    { value: "general", label: "General" },
    { value: "medical", label: "Medical" },
    { value: "permits", label: "Permits" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
        <div className="relative flex-grow max-w-lg">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search documents..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        
        <div className="w-full sm:w-48">
          <Select
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={categoryOptions}
            placeholder="Category"
            className="text-sm"
            theme={(theme) => ({
              ...theme,
              colors: {
                ...theme.colors,
                primary: '#22c55e',
                primary25: '#dcfce7',
              },
            })}
          />
        </div>
      </div>

      {loading && userDocs.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <Spinner size="xl" />
        </div>
      ) : userDocs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {userDocs.map(docs => (
              <DocumentCard key={docs._id} docs={docs} />
            ))}
          </div>

          {showMore && (
            <div className="mt-8 text-center">
              <Button
                color="gray"
                onClick={handleShowMore}
                disabled={loading}
                className="inline-flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <Spinner size="sm" />
                    Loading...
                  </>
                ) : (
                  'Load more documents'
                )}
              </Button>
            </div>
          )}
        </>
      ) : (
        <EmptyState />
      )}
    </div>
  );
}