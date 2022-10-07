import React, { useContext, useRef } from 'react';
import { toast } from 'react-toastify';
import { Button } from "../components";
import classes from "../styles/login.module.scss";
import { setCookie, validateEmail } from '../utils/utils';
import { DataContext } from '../context/Context';
import { login } from '../utils/api';
import { LoginError, LoginStart, LoginSuccess } from '../reducer/actions';

const Login = () => {
    const { dispatch, loading } = useContext(DataContext);
    const email = useRef();
    const password = useRef();

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!email.current.value) { return toast.warn("Email is required!"); }
        if (validateEmail(email.current.value)) { return toast.warn("Invalid Email!"); }
        if (!password.current.value) { return toast.warn("Password is required!"); }

        const loginDetails = {
            email: email.current.value,
            password: password.current.value
        };

        dispatch(LoginStart());
        try {
            const res = await login(loginDetails);
            setCookie("accessToken", res.token, 1);
            dispatch(LoginSuccess({ id: res._id }));
        } catch (error) {
            dispatch(LoginError());
            toast.error(error.response.data.message);
        }
    };

    return (
        <div className={classes.container}>
            <h3>Login</h3>
            <form className="global-form" onSubmit={handleLogin}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="text" name="email" id="email" placeholder="anne.hunter@mail.com" ref={email} />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" placeholder="******" ref={password} />
                </div>
                <Button text="Login" variant="cyan" bold loading={loading} />
            </form>
        </div>
    );
};

export default Login;;