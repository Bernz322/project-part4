import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Navbar } from '../components';


const PrivateRoutes = ({ token }) => {
    return (
        token ? <><Navbar /> <Outlet /></> : <Navigate to='/' replace />
    );
};

export default PrivateRoutes;