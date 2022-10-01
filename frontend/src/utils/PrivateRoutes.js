import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';


const PrivateRoutes = ({ token }) => {
    return (
        token ? <Outlet /> : <Navigate to='/' replace />
    );
};

export default PrivateRoutes;