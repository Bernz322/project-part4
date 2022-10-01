import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Navbar, Table } from '../components';
import { DataContext } from '../context/Context';
import { ACTION_TYPE } from '../reducer/actionTypes';
import classes from '../styles/docs-list.module.scss';
import { fetchUploads, fetchUserUploads } from '../utils/api';

const DocList = () => {
    const { dispatch, fetchAgain } = useContext(DataContext);
    const [userUploads, setUserUploads] = useState([]);
    const [allUploads, setAllUploads] = useState([]);
    const { id } = JSON.parse(localStorage.getItem("loggedUser"));

    const tableColumnUploads = [
        {
            title: "Label"
        },
        {
            title: "File Name"
        },
        {
            title: "Action"
        }
    ];

    const tableColumnShare = [
        {
            title: "Label"
        },
        {
            title: "File Name"
        },
        {
            title: "Shared by"
        }
    ];

    let sharedToUser = allUploads.filter(upload => {
        return upload.sharedTo.find(item => item._id === id);
    });

    useEffect(() => {
        const fetch = async () => {
            dispatch({ type: ACTION_TYPE.REQUEST_START });
            try {
                const sharedUploads = await fetchUserUploads();
                setUserUploads(sharedUploads);
                const uploads = await fetchUploads();
                setAllUploads(uploads);
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
                <h3>My Uploads</h3>
                <Table data={userUploads} column={tableColumnUploads} tableName="docs" />
                <h3 className={classes.sharedHeader}>Shared Uploads</h3>
                <Table data={sharedToUser} column={tableColumnShare} tableName="shared" />
            </div>
        </>
    );
};

export default DocList;