import React, { useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from '../components';
import { DataContext } from '../context/Context';
import { RegisterError, RegisterStart, RegisterSuccess } from '../reducer/actions';
import { register } from '../utils/api';
import { validateEmail } from '../utils/utils';
import classes from "../styles/login.module.scss";

const Register = () => {
    const { dispatch, loading } = useContext(DataContext);
    const navigate = useNavigate();
    const name = useRef();
    const email = useRef();
    const password = useRef();
    const confirmPassword = useRef();

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!name.current.value) { return toast.warn("Full name is required!"); }
        if (!email.current.value) { return toast.warn("Email is required!"); }
        if (validateEmail(email.current.value)) { return toast.warn("Invalid Email!"); }
        if (!password.current.value) { return toast.warn("Password is required!"); }
        if (!confirmPassword.current.value) { return toast.warn("Confirm your password!"); }
        if (confirmPassword.current.value !== password.current.value) { return toast.warn("Your passwords do not match!"); }

        const registerDetails = {
            name: name.current.value,
            email: email.current.value,
            password: password.current.value
        };

        dispatch(RegisterStart());
        try {
            await register(registerDetails);
            dispatch(RegisterSuccess());
            navigate('/register-success', { replace: true });
        } catch (error) {
            dispatch(RegisterError());
            toast.error(error.response.data.message);
        }

    };

    return (
        <div className={classes.container}>
            <h3>Register</h3>
            <form className="global-form" onSubmit={handleRegister}>
                <div>
                    <label htmlFor="full-name">Full Name</label>
                    <input type="text" name="full-name" id="full-name" placeholder="Anne Hunter" ref={name} />
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="text" name="email" id="email" placeholder="anne.hunter@mail.com" ref={email} />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" id="password" placeholder="******" ref={password} />
                </div>
                <div>
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <input type="password" name="confirm-password" id="confirm-password"
                        placeholder="******" ref={confirmPassword} />
                </div>
                <Button text="Register" variant="cyan" bold loading={loading} />
            </form>
        </div>);
};

export default Register;