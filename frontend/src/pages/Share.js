import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button, Table, Navbar } from '../components';
import { DataContext } from '../context/Context';
import { ACTION_TYPE } from '../reducer/actionTypes';
import classes from "../styles/share.module.scss";
import { fetchUploadById, fetchUsers } from '../utils/api';

const Share = () => {
    const { dispatch, fetchAgain } = useContext(DataContext);
    const [upload, setUpload] = useState([]);
    const [users, setUsers] = useState([]);
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
            dispatch({ type: ACTION_TYPE.REQUEST_START });
            try {
                const upload = await fetchUploadById(currentUpload.id);
                setUpload(upload);
                const users = await fetchUsers();
                setUsers(users);
                dispatch({ type: ACTION_TYPE.REQUEST_SUCCESS });
            } catch (error) {
                dispatch({ type: ACTION_TYPE.REQUEST_ERROR });
                toast.error(error.response.data.message);
            }
        };
        fetch();
    }, [dispatch, fetchAgain, currentUpload.id]);

    let toShare = users.filter((user) => {
        return upload[0].sharedTo.filter((userSharedTo) => {
            return userSharedTo._id === user._id;
        }).length === 0;
    });

    let availToShare = toShare.filter((user) => {
        return user._id !== loggedUser.id;
    });

    return (
        <>
            <Navbar />
            <div className={classes.container}>
                <h3>Upload Sharing <span>: {upload[0]?.fileName}</span></h3>
                <Table data={upload[0]?.sharedTo} column={tableColumnShared} tableName="share" />

                <h3 className={classes.sharedHeader}>Add Sharing</h3>

                <div className={classes.sharingContainer}>
                    <label htmlFor="share-user">Choose User:</label>
                    <select name="share-user" id="share-user" className={classes.shareUser}>
                        <option value="0">--Select User--</option>
                        {availToShare.map(user => {
                            return (
                                <option key={user._id} value={user._id}>{user.name}</option>
                            );
                        })}
                    </select>
                    <Button unstyled text="Add Share" type="darken" />
                </div>
            </div>
        </>
    );
};

export default Share;