import React, { useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { Modal } from 'react-bootstrap/';
import { Button } from '../';
import { DataContext } from '../../context/Context';
import { editUploadById } from '../../utils/api';
import { RequestError, RequestStart, RequestSuccess } from '../../reducer/actions';
import "./modal.scss";

const EditUploadModal = (props) => {
    const { dispatch, loading, fetchAgain, setFetchAgain } = useContext(DataContext);
    const [label, setLabel] = useState("");

    const handleEditUpload = async () => {
        if (label.trim() === "" || label.trim() === props.data.label) { return toast.warn("Description is required, if you wish to not do any changes, click cancel."); }

        dispatch(RequestStart());
        const data = {
            id: props.data._id,
            label
        };
        try {
            await editUploadById(data);
            dispatch(RequestSuccess());
            setFetchAgain(!fetchAgain);
            setLabel("");
            props.onHide();
        } catch (error) {
            dispatch(RequestError());
            toast.error(error.response.data.message);
        }
    };

    return (
        <Modal
            {...props}
            size='lg'
            aria-labelledby="contained-modal-title-vcenter"
            centered
            dialogClassName="edit-modal"
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Edit
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <label htmlFor="edit-description">File Description</label>
                <input defaultValue={props.data.label} type="text" name="edit-description" id="edit-description" placeholder={props?.data?.label} onChange={(e) => setLabel(e.target.value)} />
            </Modal.Body>
            <Modal.Footer>
                <div className='empty'></div>
                <div className='button-container'>
                    <Button type="add" variant="dark" text="Save" bold click={handleEditUpload} loading={loading} />
                    <Button type="add" variant="dark" text="Cancel" bold click={props.onHide} />
                </div>

            </Modal.Footer>
        </Modal>
    );
};

export default EditUploadModal;