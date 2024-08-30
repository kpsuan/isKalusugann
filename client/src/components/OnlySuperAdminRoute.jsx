import {useSelector} from 'react-redux'
import { Outlet, Navigate } from 'react-router-dom'

export default function OnlySuperAdminPrivateRoute() {
    const {currentUser} = useSelector(state => state.user)
  return currentUser.isSuperAdmin ? <Outlet/> : <Navigate to='/sign-in'/>
}
