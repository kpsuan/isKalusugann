import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import Select from 'react-select';

const GetAllDocs = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userDocs, setUserDocs] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [filter, setFilter] = useState(''); // Add filter state
  const [categoryFilter, setCategoryFilter] = useState(null); // Add category filter state

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        let url = `/api/docs/getdocuments?`;
        
        if (categoryFilter && categoryFilter.value) {
          url += `&category=${categoryFilter.value}`;
        }
  
        if (filter) {
          url += `&searchTerm=${filter}`;
        }
  
        const res = await fetch(url);
        const data = await res.json();
        if (res.ok) {
          setUserDocs(data.docs);
          if (data.docs.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchDocs();
  }, [filter, categoryFilter]); // Re-fetch when filter or category changes

  const handleShowMore = async () => {
    const startIndex = userDocs.length;
    try {
      const res = await fetch(`/api/docs/getdocuments?startIndex=${startIndex}`);
      const data = await res.json();
      if (res.ok) {
        setUserDocs((prev) => [...prev, ...data.docs]);
        if (data.docs.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleCategoryFilterChange = (selectedOption) => {
    setCategoryFilter(selectedOption);
  };

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const categoryOptions = [
    { value: "", label: "All" },
    { value: "general", label: "General" },
    { value: "medical", label: "Medical" },
    { value: "permits", label: "Permits" },
  ];

  return (
    <>
      <div className="flex justify-start mb-4">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search for a file to download"
            value={filter}
            onChange={handleFilterChange}
            className="w-80 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
          />
        </div>
        <div className="flex items-center ml-4 w-40">
          <Select
            id="category"
            value={categoryFilter}
            onChange={handleCategoryFilterChange}
            options={categoryOptions}
            placeholder={categoryFilter ? categoryFilter.label : "Category"}
            className="w-full"
          />
        </div>
      </div>

      <div className='table-auto overflow-x-scroll md:mx-auto p-3'>
        {userDocs.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {userDocs.map(docs => (
                <div key={docs._id} className="bg-gray-100 p-10 rounded-md flex flex-col border-2">
                  <Link to={docs.content} className="flex-grow">
                    <img
                      src={docs.image}
                      alt={docs.title}
                      className="w-full h-auto object-cover mb-2"
                    />
                  </Link>
                  <h3 className="text-sm font-semibold mb-2">{docs.title}</h3>
                  <Link to={docs.content} target="_blank" rel="noopener noreferrer" className="block w-full mt-2 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 text-sm text-center">
                    View
                  </Link>
                </div>
              ))}
            </div>

            {showMore && (
              <button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm py-7">Load more</button>
            )}
          </>
        ) : (
          <p>No documents found</p>
        )}
      </div>
    </>
  );
};

export default GetAllDocs;
