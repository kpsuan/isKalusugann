import React, { useState, useEffect } from 'react';
import axios from 'axios';


const ScheduledForToday = () => {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsersScheduledForToday = async () => {
      try {
        const response = await axios.get('/api/user/scheduled-for-today');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users scheduled for today:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersScheduledForToday();
  }, []);

  return (
    <div>
      
      <h2>Users Scheduled for Today</h2>
      {loading ? (
        <p>Loading...</p>
      ) : users.length === 0 ? (
        <p>Empty</p>
      ) : (
        <ul>
          {users.map(user => (
            <li key={user._id}>
              {user.firstName} {user.lastName}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ScheduledForToday;
