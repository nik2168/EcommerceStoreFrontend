import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectRoute = ({children, user=true, redirect="/login"}) => {
 
 if(!user) return <Navigate to={redirect}></Navigate>
 return children ? children : <Outlet />
 // outlet will replace the page according to route if children is not there. ...
}

export default ProtectRoute