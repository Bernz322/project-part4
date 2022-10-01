import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Navbar } from '../components';
import { DataContext } from '../context/Context';
import { ACTION_TYPE } from '../reducer/actionTypes';
import classes from '../styles/login-success.module.scss';
import { fetchLoggedInUser } from '../utils/api';

const LoginSuccess = () => {
    const { dispatch } = useContext(DataContext);
    const [user, setUser] = useState({});

    // Fetch current user, not in the local storage
    useEffect(() => {
        const fetch = async () => {
            dispatch({ type: ACTION_TYPE.REQUEST_START });
            try {
                const user = await fetchLoggedInUser();
                setUser(user[0]);
                dispatch({ type: ACTION_TYPE.REQUEST_SUCCESS });
            } catch (error) {
                dispatch({ type: ACTION_TYPE.REQUEST_ERROR });
                toast.error(error.response.data.message);
            }
        };
        fetch();
    }, [dispatch]);

    return (
        <>
            <Navbar />
            <div className={classes.container}>
                <h3>Login Successful</h3>
                <p className="login-success-p">Welcome ! <span>{user.email}</span></p>
            </div>
        </>
    );
};

export default LoginSuccess;