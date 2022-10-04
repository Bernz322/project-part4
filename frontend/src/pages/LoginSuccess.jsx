import React, { useContext, useEffect, useState } from 'react';
import { DataContext } from '../context/Context';
import { RequestError, RequestStart, RequestSuccess } from '../reducer/actions';
import { fetchLoggedInUser } from '../utils/api';
import { toast } from 'react-toastify';
import classes from '../styles/login-success.module.scss';

const LoginSuccess = () => {
    const { dispatch } = useContext(DataContext);
    const [user, setUser] = useState({});

    // Fetch current user, not in the local storage
    useEffect(() => {
        const fetch = async () => {
            dispatch(RequestStart());
            try {
                const user = await fetchLoggedInUser();
                setUser(user[0]);
                dispatch(RequestSuccess());
            } catch (error) {
                dispatch(RequestError());
                toast.error(error.response.data.message);
            }
        };
        fetch();
    }, [dispatch]);

    return (
        <div className={classes.container}>
            <h3>Login Successful</h3>
            <p className="login-success-p">Welcome ! <span>{user.email}</span></p>
        </div>
    );
};

export default LoginSuccess;