import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { Navbar } from '../components';


const PrivateRoutes = ({ token, setToken }) => {
    return (
        token ? <><Navbar setToken={setToken} /> <Outlet /></> : <Navigate to='/' replace />
    );
};

export default PrivateRoutes;