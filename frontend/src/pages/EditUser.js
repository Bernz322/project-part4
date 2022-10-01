import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Navbar } from '../components';
import { DataContext } from '../context/Context';
import { ACTION_TYPE } from '../reducer/actionTypes';
import { editUserById, fetchUserById } from '../utils/api';
import { validateEmail } from '../utils/utils';

const EditUser = () => {
    const { dispatch, loading } = useContext(DataContext);
    const navigate = useNavigate();
    const { id } = useParams();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    useEffect(() => {
        const fetch = async () => {
            dispatch({ type: ACTION_TYPE.REQUEST_START });
            try {
                const res = await fetchUserById(id);
                setName(res[0].name);
                setEmail(res[0].email);
                dispatch({ type: ACTION_TYPE.REQUEST_SUCCESS });
            } catch (error) {
                dispatch({ type: ACTION_TYPE.REQUEST_ERROR });
                toast.error(error.response.data.message);
            }
        };
        fetch();
    }, [dispatch, id]);

    const handleEditUser = async (e) => {
        e.preventDefault();

        if (name.trim() === "") { return toast.warn("Name is required!"); }
        if (email.trim() === "") { return toast.warn("Email is required!"); }
        if (validateEmail(email)) { return toast.warn("Invalid Email!"); }

        const userDetails = {
            id,
            name: name.trim(),
            email: email.trim(),
        };

        dispatch({ type: ACTION_TYPE.REQUEST_START });
        try {
            await editUserById(userDetails);
            dispatch({ type: ACTION_TYPE.REQUEST_SUCCESS });
            navigate('/users-list', { replace: true });
        } catch (error) {
            dispatch({ type: ACTION_TYPE.REQUEST_ERROR });
            toast.error(error.response.data.message);
        }
    };

    return (
        <>
            <Navbar />
            <div className="container">
                <h3>Edit User Information</h3>
                <form className="global-form" onSubmit={handleEditUser}>
                    <div>
                        <label htmlFor="full-name">Full Name</label>
                        <input value={name} type="text" name="full-name" id="full-name" placeholder="Anne Hunter" onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input value={email} type="text" name="email" id="email" placeholder="anne.hunter@mail.com" onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <Button text="Save" type="cyan" bold loading={loading} />
                </form>
            </div>
        </>
    );
};

export default EditUser;