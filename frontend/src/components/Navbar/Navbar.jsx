import React, { useContext } from 'react';
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { DataContext } from '../../context/Context';
import { Logout } from '../../reducer/actions';
import "./navbar.scss";

const Navbar = ({ setToken }) => {
    const { dispatch } = useContext(DataContext);
    const location = useLocation();
    const navigate = useNavigate();
    const path = location.pathname.split("/")[1]; // 3000/edit-ser

    const handleLogout = async () => {
        await dispatch(Logout());
        setToken();
        navigate('/logout');
    };

    return (
        <nav>
            <ul id="nav-list">
                <NavLink className={(navData) => (navData.isActive ? 'nav-link-active' : '')} to="/group-chat">
                    <li>Group Chat</li>
                </NavLink>
                <NavLink className={(navData) => (navData.isActive || path === 'edit-user' ? 'nav-link-active' : '')} to="/users-list">
                    <li>Manage Users</li>
                </NavLink>
                <NavLink className={(navData) => (navData.isActive || (path === 'share') ? 'nav-link-active' : '')} to="/docs-list">
                    <li>Manage Documents</li>
                </NavLink>
                <NavLink className={(navData) => (navData.isActive ? 'nav-link-active' : '')} to="/logout" onClick={handleLogout}>
                    <li>Logout</li>
                </NavLink>
            </ul>
        </nav>
    );
};

export default Navbar;