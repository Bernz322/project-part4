import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Navbar, Table } from '../components';
import { DataContext } from '../context/Context';
import { ACTION_TYPE } from '../reducer/actionTypes';
import classes from '../styles/users-list.module.scss';
import { fetchUsers } from '../utils/api';

const UsersList = () => {
    const { dispatch, fetchAgain } = useContext(DataContext);
    const [users, setUsers] = useState([]);
    const tableColumn = [
        {
            title: "Name"
        },
        {
            title: "User Email ID"
        },
        {
            title: ""
        }
    ];

    useEffect(() => {
        const fetch = async () => {
            dispatch({ type: ACTION_TYPE.REQUEST_START });
            try {
                const res = await fetchUsers();
                setUsers(res);
                dispatch({ type: ACTION_TYPE.REQUEST_SUCCESS });
            } catch (error) {
                dispatch({ type: ACTION_TYPE.REQUEST_ERROR });
                toast.error(error.response.data.message);
            }
        };
        fetch();
    }, [dispatch, fetchAgain]);

    return (
        <>
            <Navbar />
            <div className={classes.container}>
                <h3>Users</h3>
                <Table data={users} column={tableColumn} tableName="users" />
            </div>
        </>
    );
};

export default UsersList;