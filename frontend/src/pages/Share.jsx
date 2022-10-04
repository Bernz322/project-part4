import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Table } from '../components';
import { DataContext } from '../context/Context';
import { RequestError, RequestStart, RequestSuccess } from '../reducer/actions';
import classes from "../styles/share.module.scss";
import { fetchUploadById, fetchUsers, shareUploadToUser } from '../utils/api';

const Share = () => {
    const { dispatch, fetchAgain, setFetchAgain, loading } = useContext(DataContext);
    const [upload, setUpload] = useState([]);
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const currentUpload = useParams();
    const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

    const tableColumnShared = [
        {
            title: "Shared User"
        },
        {
            title: "Action"
        },
    ];

    useEffect(() => {
        const fetch = async () => {
            dispatch(RequestStart());
            try {
                const upload = await fetchUploadById(currentUpload.id);
                setUpload(upload);
                const users = await fetchUsers();
                setUsers(users);
                dispatch(RequestSuccess());
            } catch (error) {
                dispatch(RequestError());
                toast.error(error.response.data.message);
            }
        };
        fetch();
    }, [dispatch, fetchAgain, currentUpload.id]);

    const handleShareUpload = async () => {
        if (selectedUser.trim() === "") return toast.warn("Select a valid user");

        dispatch(RequestStart());
        const data = {
            uploadId: currentUpload.id,
            userId: selectedUser
        };
        try {
            await shareUploadToUser(data);
            dispatch(RequestSuccess());
            setSelectedUser("");
            setFetchAgain(!fetchAgain);
        } catch (error) {
            dispatch(RequestError());
            toast.error(error.response.data.message);
        }
    };

    let toShare = users.filter((user) => {
        return upload[0].sharedTo.filter((userSharedTo) => {
            return userSharedTo._id === user._id;
        }).length === 0;
    });

    let availToShare = toShare.filter((user) => {
        return user._id !== loggedUser.id;
    });

    return (
        <div className={classes.container}>
            <h3>Upload Sharing <span>: {upload[0]?.fileName}</span></h3>
            <Table data={upload[0]?.sharedTo} column={tableColumnShared} tableName="share" />

            <h3 className={classes.sharedHeader}>Add Sharing</h3>

            <div className={classes.sharingContainer}>
                <label htmlFor="share-user">Choose User:</label>
                <select value={selectedUser} name="share-user" id="share-user" className={classes.shareUser} onChange={(e) => setSelectedUser(e.target.value)}>
                    <option value="">--Select User--</option>
                    {availToShare.map(user => {
                        return (
                            <option key={user._id} value={user._id}>{user.name}</option>
                        );
                    })}
                </select>
                <Button type="unstyled" text="Add Share" variant="dark" click={handleShareUpload} loading={loading} />
            </div>
        </div>
    );
};

export default Share;