import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/use-auth.js'

function PrivateRoute({ children }) {
    const { userIsAuthenticated } = useAuth();
    return userIsAuthenticated() ? children : <Navigate to="/sign-in" />
}

export default PrivateRoute