
import {Alert, Button, Modal, ModalBody, TextInput, Table, TableCell} from 'flowbite-react'

import { HiOutlineExclamationCircle } from 'react-icons/hi';
import {Link} from 'react-router-dom'
import { useEffect, useState  } from "react"
import { useSelector } from 'react-redux';
import { set } from 'mongoose';

const DashAnnouncement = () => {
  const {currentUser} = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([])
  const [showMore, setShowMore] = useState(true);


  useEffect(() => {
    
    const fetchPosts = async () => {
      try {
        const res = await fetch(`/api/post/getposts`);
        const data = await res.json();
        if(res.ok){
          setUserPosts(data.posts);
          if (data.posts.length < 9) {
            setShowMore(false);
          }
        }      
      } catch (error) {
        console.log(error.message)
      }
    }; 
    
      fetchPosts();
    
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(
        `/api/post/getposts?startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };


  return (
    <div className='table-auto overflow-x-scroll md:mx-auto p-3 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {userPosts.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head>
              <Table.HeadCell>Date updated</Table.HeadCell>
              <Table.HeadCell>Post image</Table.HeadCell>
              <Table.HeadCell>Post title</Table.HeadCell>
              <Table.HeadCell>Category</Table.HeadCell>
            </Table.Head>
            {userPosts.map((post) => (
              <Table.Body className="divide-y">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800">
                  <Table.Cell className="">{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                  <Table.Cell className="">
                    <Link to ={`/post/${post.slug}`}>
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className=" w-20 h-10 object-cover bg-gray-500"/>
                    </Link>
                    </Table.Cell>
                    <Table.Cell >
                      <Link className="text-right font-medium text-gray-900 hover:underline" to ={`/post/${post.slug}`}>
                        {post.title}
                      </Link>
                    </Table.Cell>
                    <Table.Cell className="">{post.category}</Table.Cell>
                </Table.Row>
              </Table.Body>
            ))

            }
          </Table>
          {showMore && (
            <button onClick={handleShowMore} className="w-full text-teal-500 self-center text-sm py-7">Load more</button>
          )}
        </>
      ):(
        <p>You have no posts yet! </p>
      )}
  
    </div>
    
  );
}


export default DashAnnouncement