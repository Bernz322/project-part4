import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Table } from '../components';
import { DataContext } from '../context/Context';
import { RequestError, RequestStart, RequestSuccess } from '../reducer/actions';
import classes from '../styles/docs-list.module.scss';
import { fetchUploads, fetchUserUploads } from '../utils/api';

const DocList = () => {
    const { loggedUser, dispatch, fetchAgain } = useContext(DataContext);
    const [userUploads, setUserUploads] = useState([]);
    const [allUploads, setAllUploads] = useState([]);

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
        return upload.sharedTo.find(item => item._id === loggedUser.id);
    });

    useEffect(() => {
        const fetch = async () => {
            dispatch(RequestStart());
            try {
                const sharedUploads = await fetchUserUploads();
                setUserUploads(sharedUploads);
                const uploads = await fetchUploads();
                setAllUploads(uploads);
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
            <h3>My Uploads</h3>
            <Table data={userUploads} column={tableColumnUploads} tableName="docs" />
            <h3 className={classes.sharedHeader}>Shared Uploads</h3>
            <Table data={sharedToUser} column={tableColumnShare} tableName="shared" />
        </div>
    );
};

export default DocList;