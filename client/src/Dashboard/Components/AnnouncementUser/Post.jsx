import React from 'react';
import { Button, Spinner } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Sidebar from '../SideBar Section/Sidebar';
import { Clock, Calendar, BookOpen } from 'lucide-react';

const PostContent = ({ post }) => (
  <div className='prose prose-lg max-w-none w-full post-content'>
    <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
  </div>
);

const PostMetadata = ({ date, readTime }) => (
  <div className='flex items-center gap-6 text-gray-600 my-6'>
    <div className='flex items-center gap-2'>
      <Calendar className='w-4 h-4' />
      <span>{new Date(date).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}</span>
    </div>
    <div className='flex items-center gap-2'>
      <Clock className='w-4 h-4' />
      <span>{readTime} min read</span>
    </div>
  </div>
);

const RecentPostCard = ({ post }) => (
  <Link 
    to={`/post/${post.slug}`}
    className="group relative block overflow-hidden rounded-xl bg-white shadow-lg transition-all hover:-translate-y-1 hover:shadow-xl"
  >
    <div className="relative pt-[50%]">
      <img
        src={post.image}
        alt={post.title}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
    <div className="p-4">
      <Button color="gray" size="xs" pill>
        {post.category}
      </Button>
      <h3 className="mt-3 text-lg font-medium text-gray-900 group-hover:text-blue-600">
        {post.title}
      </h3>
    </div>
  </Link>
);

export default function Post() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState(null);
  const [recentPosts, setRecentPosts] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getposts?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setPost(data.posts[0]);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    try {
      const fetchRecentPosts = async () => {
        const res = await fetch(`/api/post/getposts?limit=3`);
        const data = await res.json();
        if (res.ok) {
          setRecentPosts(data.posts);
        }
      };
      fetchRecentPosts();
    } catch (error) {
      console.log(error.message);
    }
  }, []);

  if (loading) {
    return (
      <div className='flex flex-col items-center justify-center min-h-screen gap-3'>
        <Spinner size="xl" />
        <span className="text-gray-600">Loading post...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-red-500 text-lg">Failed to load post</div>
        <Button color="gray" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="dashboard min-h-screen flex bg-gray-100">
      <div className="dashboardContainer flex flex-1">
        <Sidebar />
        <div className="flex-1 overflow-y-auto">
          <div className="px-4 py-8 sm:px-6 lg:px-8">
            <article className="mx-auto max-w-4xl">
              <header className="mb-8">
                <div className="space-y-4">
                  <div></div>
                  
                  <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
                    {post?.title}
                  </h1>
                  
                  
                  <PostMetadata 
                    date={post?.createdAt} 
                    readTime={(post?.content.length / 1000).toFixed(0)} 
                  />
                </div>
                
                <div className="aspect-w-16 aspect-h-9 mt-8 overflow-hidden rounded-xl bg-gray-100">
                  <img
                    src={post?.image}
                    alt={post?.title}
                    className="object-cover"
                  />
                </div>
              </header>

              <div className="prose prose-lg prose-gray mx-auto">
                <PostContent post={post} />
              </div>
              
              {recentPosts && (
                <section className="mt-16 pt-16 border-t border-gray-200">
                  <h2 className="text-2xl font-bold tracking-tight text-gray-900">
                    Recent Posts
                  </h2>
                  <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {recentPosts.map((post, idx) => (
                      <RecentPostCard key={idx} post={post} />
                    ))}
                  </div>
                </section>
              )}
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}