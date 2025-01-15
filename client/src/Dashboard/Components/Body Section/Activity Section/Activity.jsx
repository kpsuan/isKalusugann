import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import { useEffect } from 'react';
import { Button, Badge, Card } from 'flowbite-react';
import './activity.css';
import parse  from 'html-react-parser';
import Select from 'react-select';


const Activity = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [announcements, setAnnouncements] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [limit, setLimit] = useState(9);
  const [selectedImage, setSelectedImage] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState(null);
  const [filter, setFilter] = useState("");


  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        let url = `/api/post/getposts?limit=${limit}&order=desc`;
  
        if (categoryFilter && categoryFilter.value) {
          url += `&category=${categoryFilter.value}`; 
        }
  
        if (filter) {
          url += `&searchTerm=${filter}`;
        }
  
        const res = await fetch(url);
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
  
        const data = await res.json();
  
        if (data.posts.length < limit) {
          setShowMore(false);
        }
        
        setAnnouncements(data.posts);
      } catch (error) {
        console.error('Failed to fetch:', error.message);
      }
    };
  
    fetchAnnouncements();
  }, [currentUser.isAdmin, limit, categoryFilter, filter]);
  

  const getBadge = (category) => {
    const baseClasses = "text-sm font-medium  py-1.5"; 
    switch (category.toLowerCase()) {
      case 'scheduling':
        return <Badge color="info" className={baseClasses}>Scheduling</Badge>;
      case 'general':
        return <Badge color="success" className={baseClasses}>General</Badge>;
      case 'emergency':
        return <Badge color="failure" className={baseClasses}>Emergency</Badge>;
      default:
        return <Badge color="gray" className={baseClasses}>Unknown</Badge>;
    }
  };

  const handleLoadMore = () => {
    setLimit((prevLimit) => prevLimit + 9);
  };

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };
  
  
  const handleCategoryFilterChange = (selectedOption) => {
    setCategoryFilter(selectedOption); // Store the whole object (value and label)
  };
  
  

  const handleFilterChange = (event) => {
    setFilter(event.target.value);
  };

  const categoryOptions = [
    { value: "", label: "All" },
    { value: "general", label: "General" },
    { value: "scheduling", label: "Scheduling Concerns" },
    { value: "emergency", label: "Emergency" },
  ];

  return (
    <>
      <div className="flex justify-start mb-4">
        <div className="flex items-center">
          <input
            type="text"
            placeholder="Search..."
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
  
      {announcements.length === 0 ? (
        <p className="text-center text-2xl mx-auto p-10 font-light">Nothing Found</p>
      ) : (
        announcements.map((announcement, index) => (
          <div key={index} className="flex flex-col md:flex-row border border-gray-300 mb-5 rounded-lg shadow bg-gray-50">
            <div className="relative w-full md:w-1/3 overflow-hidden ">
              <img 
                src={announcement.image || "https://via.placeholder.com/150"} 
                alt={announcement.title} 
                className="w-full object-cover h-full rounded-l-lg transition-transform duration-300 ease-in-out cursor-pointer hover:scale-125"
                onClick={() => handleImageClick(announcement.image)}
              />
            </div>
            <div className="w-full md:w-2/3 p-4">
              <Link to={`/post/${announcement.slug}`} target="_blank" rel="noopener noreferrer">
                <Card className="max-w-full p-5">
                  <div className="text-center w-24">
                    {getBadge(announcement.category)}
                  </div>
                  <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                    {announcement.title}
                  </h5>
                  <span className="text-sm text-gray-500 mb-2">
                    Posted on: {new Date(announcement.updatedAt).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                  <p className="font-normal text-gray-700 dark:text-gray-400">
                    {announcement.content ? parse(announcement.content) : "No content available."}
                  </p>
                </Card>
              </Link>
            </div>
          </div>
        ))
      )}
  
      {showMore && announcements.length > 0 && (
        <div className="flex justify-center my-4">
          <Button
            type="button"
            className="bg-cyan-500 text-white hover:bg-cyan-600"
            onClick={handleLoadMore}
          >
            Load More
          </Button>
        </div>
      )}
  
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="relative max-w-screen-lg max-h-screen">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white text-2xl font-bold"
            >
              &times;
            </button>
            <img
              src={selectedImage}
              alt="Full size"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
  
};

export default Activity;
