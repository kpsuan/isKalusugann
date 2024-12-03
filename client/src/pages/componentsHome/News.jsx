import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const News = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fetch posts when the component mounts
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts`);
        const data = await res.json();
        if (res.ok) {
          setUserPosts(data.posts); // Fetch all posts
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    fetchPosts();
  }, []);

  // Slide to the next set of posts
  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 3 >= userPosts.length ? 0 : prevIndex + 3
    );
  };

  // Slide to the previous set of posts
  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - 3 < 0 ? Math.max(0, userPosts.length - 3) : prevIndex - 3
    );
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <div className="text-center mb-8 items-center pt-8 px-4 mx-auto max-w-screen-xl lg:pt-16 lg:px-6">
        <span className="text-lg font-medium text-gray-600 dark:text-primary-500">
          Latest Updates
        </span>
        <h1 className="mb-2 text-4xl font-extrabold tracking-tight leading-none text-green-700 md:text-2xl lg:text-5xl dark:text-white">
          News and Activities
        </h1>
      </div>
      <div className="relative py-8 px-3 mx-auto max-w-screen-xl">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={handlePrev}
            className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold py-2 px-4 rounded transition"
          >
            Prev
          </button>
          <button
            onClick={handleNext}
            className="bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold py-2 px-4 rounded transition"
          >
            Next
          </button>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {userPosts.slice(currentIndex, currentIndex + 3).map((post) => (
            <div
              key={post.id}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col h-full transition-transform transform hover:scale-105 ease-in-out duration-300"
            >
              <img
                src={post.image}
                alt="Description of image"
                className="w-full h-64 object-cover"
              />
              <div className="p-6 flex flex-col flex-grow">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                  Posted on: {new Date(post.createdAt).toLocaleDateString()}
                </p>
                <div
                  className="text-gray-600 dark:text-gray-300 mb-4 overflow-hidden"
                  style={{
                    display: '-webkit-box',
                    WebkitLineClamp: 8,
                    WebkitBoxOrient: 'vertical',
                  }}
                >
                  <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
                </div>
                <div className="mt-auto">
                  <a
                    href={`/post/${post.slug}`}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                  >
                    Read more
                    <svg
                      className="ml-1 w-6 h-6"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      ></path>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default News;
