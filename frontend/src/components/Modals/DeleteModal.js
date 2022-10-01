import React, { useContext } from 'react';
import { Modal } from 'react-bootstrap/';
import { toast } from 'react-toastify';
import { Button } from '..';
import img from '../../assets/delete-image.PNG';
import { DataContext } from '../../context/Context';
import { ACTION_TYPE } from '../../reducer/actionTypes';
import { deleteUserById } from '../../utils/api';
import "./modal.scss";

const DeleteModal = (props) => {
    const { dispatch, loading, fetchAgain, setFetchAgain } = useContext(DataContext);

    const handleDeleteUser = async () => {
        dispatch({ type: ACTION_TYPE.REQUEST_START });
        try {
            await deleteUserById(props.data._id);
            dispatch({ type: ACTION_TYPE.REQUEST_SUCCESS });
            setFetchAgain(!fetchAgain);
            props.onHide();
        } catch (error) {
            dispatch({ type: ACTION_TYPE.REQUEST_ERROR });
            toast.error(error.response.data.message);
        }
    };

    const handleDeleteUpload = () => {
        console.log("Delete Upload");
    };

    const handleRemoveShare = () => {
        console.log("Remove Share");
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
                {props.data.type === "user"
                    ?
                    <Button del text="ok" click={handleDeleteUser} loading={loading} />
                    :
                    props.data.type === "upload"
                        ?
                        <Button del text="ok" click={handleDeleteUpload} loading={loading} />
                        :
                        <Button del text="ok" click={handleRemoveShare} loading={loading} />
                }
                <Button del text="Cancel" click={props.onHide} />
            </Modal.Footer>
        </Modal>
    );
};

export default DeleteModal;