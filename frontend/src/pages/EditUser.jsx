import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from '../components';
import { DataContext } from '../context/Context';
import { RequestError, RequestStart, RequestSuccess } from '../reducer/actions';
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
            dispatch(RequestStart());
            try {
                const res = await fetchUserById(id);
                setName(res[0].name);
                setEmail(res[0].email);
                dispatch(RequestSuccess());
            } catch (error) {
                dispatch(RequestError());
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

        dispatch(RequestStart());
        try {
            await editUserById(userDetails);
            dispatch(RequestSuccess());
            navigate('/users-list', { replace: true });
        } catch (error) {
            dispatch(RequestError());
            toast.error(error.response.data.message);
        }
    };

    return (
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
                <Button text="Save" variant="cyan" bold loading={loading} />
            </form>
        </div>
    );
};

export default EditUser;