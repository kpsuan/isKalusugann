import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button, Badge, Card, Spinner, Tooltip } from 'flowbite-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiArrowLeft, 
  HiArrowRight, 
  HiCalendar, 
  HiHeart,
  HiShare,
  HiBookmark,
  HiEye
} from 'react-icons/hi';

const NewsCard = ({ post }) => {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [views, setViews] = useState(Math.floor(Math.random() * 100));

  const handleLike = () => {
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
    setIsLiked(!isLiked);
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,
          text: 'Check out this article!',
          url: `/post/${post.slug}`
        });
      } catch (err) {
        console.error('Share failed:', err);
      }
    } else {
      // Fallback: Copy to clipboard
      navigator.clipboard.writeText(window.location.origin + `/post/${post.slug}`);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="h-full"
    >
      <Card className="h-full overflow-hidden group">
        <div className="relative overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-64 object-cover transform transition-all duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <Badge 
            color="success"
            className="absolute top-4 left-4 z-10"
          >
            New
          </Badge>
        </div>
        
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center text-sm text-gray-500">
              <HiCalendar className="mr-1" />
              {new Date(post.createdAt).toLocaleDateString()}
            </div>
            <div className="flex items-center gap-2">
              <Tooltip content={`${views} views`}>
                <div className="flex items-center text-gray-500">
                  <HiEye className="w-5 h-5 mr-1" />
                  <span>{views}</span>
                </div>
              </Tooltip>
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 hover:text-green-600 transition-colors">
            {post.title}
          </h2>

          <div 
            className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-4 prose prose-sm"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-auto pt-4 border-t">
            <div className="flex justify-between items-center mb-4">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleLike}
                className={`flex items-center gap-1 ${isLiked ? 'text-red-500' : 'text-gray-500'}`}
              >
                <HiHeart className={`w-6 h-6 transition-colors ${isLiked ? 'fill-current' : ''}`} />
                <span>{likes}</span>
              </motion.button>

              <div className="flex gap-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBookmark}
                  className={`${isBookmarked ? 'text-blue-500' : 'text-gray-500'}`}
                >
                  <Tooltip content={isBookmarked ? 'Bookmarked' : 'Add to bookmarks'}>
                    <HiBookmark className={`w-6 h-6 transition-colors ${isBookmarked ? 'fill-current' : ''}`} />
                  </Tooltip>
                </motion.button>

                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handleShare}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Tooltip content="Share article">
                    <HiShare className="w-6 h-6" />
                  </Tooltip>
                </motion.button>
              </div>
            </div>

            <Button
              as="a"
              href={`/post/${post.slug}`}
              className="w-full group"
            >
              <span className="mr-2 group-hover:mr-4 transition-all">Read Article</span>
              <HiArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

const News = () => {
  const { currentUser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('grid'); // 'grid' or 'list'

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts`);
        const data = await res.json();
        
        if (res.ok) {
          setUserPosts(data.posts);
        } else {
          setError('Failed to fetch posts');
        }
      } catch (error) {
        setError('Error loading posts');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 3 >= userPosts.length ? 0 : prevIndex + 3
    );
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - 3 < 0 ? Math.max(0, userPosts.length - 3) : prevIndex - 3
    );
  };

  return (
    <section className="bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
            News and Activities
          </h1>
          <p className="text-lg font-normal text-gray-600 lg:text-xl dark:text-gray-400 max-w-2xl mx-auto">
            Stay updated with the latest news and developments from UPV Health Services Unit
          </p>
        </motion.div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Spinner size="xl" />
          </div>
        ) : error ? (
          <Card>
            <p className="text-center text-red-500">{error}</p>
            <Button color="failure" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </Card>
        ) : (
          <>
            <AnimatePresence mode="wait">
              <div className={`grid gap-8 mb-8 ${
                view === 'grid' 
                  ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                  : 'grid-cols-1'
              }`}>
                {userPosts.slice(currentIndex, currentIndex + 3).map((post) => (
                  <NewsCard key={post.id} post={post} />
                ))}
              </div>
            </AnimatePresence>

            <div className="flex justify-center gap-4 mt-8">
              <Button
                onClick={handlePrev}
                disabled={currentIndex === 0}
                className="flex items-center gap-2 group"
              >
                <HiArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
                Previous
              </Button>
              <Button
                onClick={handleNext}
                disabled={currentIndex + 3 >= userPosts.length}
                className="flex items-center gap-2 group"
              >
                Next
                <HiArrowRight className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <motion.div 
              className="flex justify-center mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-sm text-gray-500">
                Showing {currentIndex + 1}-{Math.min(currentIndex + 3, userPosts.length)} of {userPosts.length} posts
              </p>
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
};

export default News;