import React, { useContext } from 'react'
import { UserContext } from '../context/userContext';

const Home = () => {
  const {user} = useContext(UserContext)
  console.log(user);

  return (
    <div>
      <h1>Dashboard</h1>
      {!!user && <h2>Hi {user.name}!</h2>}
      
    </div>
    
  )
}

export default Home