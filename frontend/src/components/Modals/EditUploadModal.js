import React from 'react';
import { Modal } from 'react-bootstrap/';
import { Button } from '../';
import "./modal.scss";

const EditUploadModal = (props) => {
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
                <input type="text" name="edit-description" id="edit-description"
                    placeholder="Sales Report" />
            </Modal.Body>
            <Modal.Footer>
                <div className='empty'></div>
                <div className='button-container'>
                    <Button add type="darken" text="Save" bold click={props.onHide} />
                    <Button add type="darken" text="Cancel" bold click={props.onHide} />
                </div>

            </Modal.Footer>
        </Modal>
    );
};

export default EditUploadModal;