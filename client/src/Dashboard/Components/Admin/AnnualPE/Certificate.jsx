import React, { useState, useEffect, useCallback, useRef  } from "react";
import './certificate.css'
import certificateTemplate from '../../../../assets/medcert.jpg'
import { useParams } from "react-router-dom";
import { toPng } from 'html-to-image';
import { useNavigate } from 'react-router-dom';



const Certificate = () => {
  const ref = useRef(null)
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(null);
  const navigate = useNavigate();

  const onButtonClick = useCallback(() => {
    if (ref.current === null) {
      return
    }

    toPng(ref.current, { cacheBust: true, })
      .then((dataUrl) => {
        const fileName = `${user.lastName}_medcert.png`
        const link = document.createElement('a')
        link.download = fileName
        link.href = dataUrl
        link.click()
        navigate(`/user-status/${user._id}`);
      })
      .catch((err) => {
        console.log(err)
      })
  }, [navigate, ref, user]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch(`/api/user/${userId}`);
        const userData = await res.json();
        if (res.ok) {
          setUser(userData);
        } else {
          // Handle error if user not found or fetch fails
          console.error("Error fetching user data:", userData.message);
        }
      } catch (error) {
        console.error("Error fetching user data:", error.message);
      } finally {
        // Set loading state to false after fetching user data
        setLoading(false);
      }
    };

    const currentDate = new Date();
    setCurrentDate(currentDate.toLocaleDateString());

    fetchUser();
  }, [userId]);


  return (
    <div>
      {user ? (
      <div className="container-cert" ref = {ref}>
        <img src={certificateTemplate} alt="certificate"  />
        <div className="content-cert">
          <p className="date2day">{currentDate}</p>
          <h1>{`${user.firstName} ${user.middleName || ""} ${user.lastName}`}</h1>
          <p className="gender">{user.gender}</p>
          <p className="dob">{user.dateOfBirth}</p>
          <p className="date">{currentDate}</p>
        </div>
        
        <button className="btn-cert" onClick={onButtonClick}>Download</button>
        </div>
      
       ) : (
        <div>User not found.</div>
      )}
    </div>

    

  )
};

export default Certificate