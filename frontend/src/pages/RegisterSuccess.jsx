import React from 'react';
import { Link } from 'react-router-dom';
import classes from "../styles/login.module.scss";

const RegisterSuccess = () => {
    return (
        <div className={classes.container}>
            <h3>Registration Successful</h3>
            <p>Thank you for your registration</p>
            <Link to="/">
                Click to return to home page
            </Link>
        </div>
    );
};

export default RegisterSuccess;