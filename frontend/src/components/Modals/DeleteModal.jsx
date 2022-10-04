import React, { useContext } from 'react';
import { Modal } from 'react-bootstrap/';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Button } from '..';
import img from '../../assets/delete-image.PNG';
import { DataContext } from '../../context/Context';
import { RequestError, RequestStart, RequestSuccess } from '../../reducer/actions';
import { deleteUserById, deleteUploadById, unshareUploadToUser } from '../../utils/api';
import "./modal.scss";

const DeleteModal = (props) => {
    const { dispatch, loading, fetchAgain, setFetchAgain } = useContext(DataContext);
    const currentUpload = useParams();

    const handleDeleteUser = async () => {
        dispatch(RequestStart());
        try {
            await deleteUserById(props.data._id);
            dispatch(RequestSuccess());
            setFetchAgain(!fetchAgain);
            props.onHide();
        } catch (error) {
            dispatch(RequestError());
            toast.error(error.response.data.message);
        }
    };

    const handleDeleteUpload = async () => {
        dispatch(RequestStart());
        try {
            await deleteUploadById(props.data._id);
            dispatch(RequestSuccess());
            setFetchAgain(!fetchAgain);
            props.onHide();
        } catch (error) {
            dispatch(RequestError());
            toast.error(error.response.data.message);
        }
    };

    const handleRemoveShare = async () => {
        dispatch(RequestStart());
        const data = {
            uploadId: currentUpload.id,
            userId: props.data._id
        };
        try {
            await unshareUploadToUser(data);
            dispatch(RequestSuccess());
            setFetchAgain(!fetchAgain);
            props.onHide();
        } catch (error) {
            dispatch(RequestError());
            toast.error(error.response.data.message);
        }
    };

    return (
        <Modal
            {...props}
            size="sm"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            dialogClassName="delete-modal"
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {props.data.type === "upload" ? "Confirm File Deletion" : props.data.type === "user" ? "Confirm User Deletion" : "Confirm From Web Page"}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <img src={img} alt="question-mark" />
                <p>Are you Sure?</p>
            </Modal.Body>
            <Modal.Footer>
                {props.data.type === "user" && <Button type="delete" text="ok" click={handleDeleteUser} loading={loading} />}
                {props.data.type === "upload" && <Button type="delete" text="ok" click={handleDeleteUpload} loading={loading} />}
                {props.data.type === "share" && <Button type="delete" text="ok" click={handleRemoveShare} loading={loading} />}
                <Button type="delete" text="Cancel" click={props.onHide} />
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteModal;