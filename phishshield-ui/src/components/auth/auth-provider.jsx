import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/reducers/authSlice';

const AuthProvider = ({ children }) => {
    const dispatch = useDispatch();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user) {
            dispatch(setUser(user));
        }
    }, [dispatch]);

    return <>{children}</>;
};

export default AuthProvider;