import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Table } from '../components';
import { DataContext } from '../context/Context';
import { RequestError, RequestStart, RequestSuccess } from '../reducer/actions';
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
            dispatch(RequestStart());
            try {
                const res = await fetchUsers();
                setUsers(res);
                dispatch(RequestSuccess());
            } catch (error) {
                dispatch(RequestError());
                toast.error(error.response.data.message);
            }
        };
        fetch();
    }, [dispatch, fetchAgain]);

    return (
        <div className={classes.container}>
            <h3>Users</h3>
            <Table data={users} column={tableColumn} tableName="users" />
        </div>
    );
};

export default UsersList;