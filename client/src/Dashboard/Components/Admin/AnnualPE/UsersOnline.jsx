import Sidebar from "../../SideBar Section/Sidebar";
import Top from "../../Profile/Components/Header";
import "../../Annual/annual.css";
import {Alert, Button, Modal, ModalBody, TextInput, Table, TableCell} from 'flowbite-react'

import { HiOutlineExclamationCircle } from 'react-icons/hi';
import {Link} from 'react-router-dom'
import { useEffect, useState  } from "react"
import { useSelector } from 'react-redux';
import { set } from 'mongoose';

const UsersOnline = () => {
  const {currentUser} = useSelector((state) => state.user);
  const [users, setUsers] = useState([])
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [totalUsers, setTotalUsers] = useState(0);

  useEffect(() => {
    
    const fetchUsers = async () => {
      try {
        const res = await fetch(`/api/user/getusers`);
        const data = await res.json();
        if(res.ok){
          setUsers(data.users);
          setTotalUsers(data.totalOnlinePE);
          if (data.users.length < 9) {
            setShowMore(false);
          }
        }      
      } catch (error) {
        console.log(error.message)
      }
    }; 
    if (currentUser.isAdmin) {
        fetchUsers();
    }
  }, [currentUser._id]);

  const handleShowMore = async () => {
    const startIndex = users.length;
    try {
      const res = await fetch(
        `/api/user/getusers?startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUsers((prev) => [...prev, ...data.users]);
        if (data.users.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div>
        <p className="font-bold my-4">Total Users: {totalUsers}</p>
    
    <div className='table-auto overflow-x-scroll md:mx-auto p-1 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
      {currentUser.isAdmin && users.length > 0 ? (
        <>
          <Table hoverable className='shadow-md'>
            <Table.Head className="text-left px-3">
              <Table.HeadCell>User image </Table.HeadCell>
              <Table.HeadCell>Name </Table.HeadCell>
              <Table.HeadCell>Sex </Table.HeadCell>
              <Table.HeadCell>Year Level </Table.HeadCell>
              <Table.HeadCell>Degree Program </Table.HeadCell>
              <Table.HeadCell>College </Table.HeadCell>
              <Table.HeadCell>Annual PE Form </Table.HeadCell>
              <Table.HeadCell>Lab Results </Table.HeadCell>
              <Table.HeadCell>Request for PE </Table.HeadCell>
              <Table.HeadCell>Medcert</Table.HeadCell>
              <Table.HeadCell>
                <span>Status </span>
              </Table.HeadCell>
            </Table.Head>
            {users.map((user) => (
              <Table.Body className="divide-y my-4">
                <Table.Row className="bg-white dark:border-gray-700 dark:bg-gray-800 ">
                  <Table.Cell className="text-center">
                    <Link to ={`/user/${user.slug}`}>
                      <img 
                        src={user.profilePicture} 
                        alt={user.username}
                        className=" w-12 h-10 object-cover bg-gray-500"/>
                    </Link>
                    </Table.Cell>
                    <Table.Cell >
                      <Link className="text-right font-medium text-gray-900 hover:underline" to ={`/users/${user.slug}`}>
                      {`${user.firstName} ${user.middleName || ''} ${user.lastName}`}
                      </Link>
                    </Table.Cell>
                    <Table.Cell className="text-left">{user.gender}</Table.Cell>
                    <Table.Cell className="text-left">{user.yearLevel}</Table.Cell>
                    <Table.Cell className="text-left">{user.degreeProgram}</Table.Cell>
                    <Table.Cell className="text-left">{user.college}</Table.Cell>
                    <Table.Cell className="text-left">
                    {user.peForm ? (
                            <Link className="text-teal-500 hover:underline" to={user.peForm}>
                              {user.lastName}_peForm.pdf
                            </Link>
                          ) : (
                            <span className="text-gray-400">Empty</span>
                          )}
                    </Table.Cell>
                    <Table.Cell className="text-left">
                      {user.labResults ? (
                            <Link className="text-teal-500 hover:underline" to={user.labResults}>
                              {user.lastName}_labResults.pdf
                            </Link>
                          ) : (
                            <span className="text-gray-400">Empty</span>
                          )}
                    </Table.Cell>
                    <Table.Cell className="text-left">
                      {user.requestPE ? (
                          <Link className="text-teal-500 hover:underline" to={user.requestPE}>
                            {user.lastName}_requestPE.pdf
                          </Link>
                        ) : (
                          <span className="text-gray-400">Empty</span>
                        )}
                    </Table.Cell>
                    <Table.Cell className="text-left">
                      {user.medcert ? (
                        <Link className="text-teal-500 hover:underline" to={user.medcert}>
                          {user.lastName}_medcert.pdf
                        </Link>
                      ) : (
                        <span className="text-gray-400">Empty</span>
                      )}
                    </Table.Cell>

                    <Table.Cell className="text-center px-2">
                        <div style={{ backgroundColor: user.status === 'approved' ? 'green' : user.status === 'denied' ? 'red' : '#888888' }} className="px-2 py-1 rounded">
                            <Link className="text-white hover:underline" to={`/user-status/${user._id}`}>
                                <span>{user.status}</span>
                            </Link>
                        </div>
                    </Table.Cell>     
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
    </div>
    
  );
}


export default UsersOnline