import React from 'react';
import { Modal } from 'react-bootstrap/';
import { toast } from 'react-toastify';
import { Button } from '../';
import "./modal.scss";

const AddUploadModal = (props) => {

    const handleSubmit = (e) => {
        e.preventDefault();
        toast.warn("Hello!");
    };

    return (
        <>
            <Modal
                {...props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                dialogClassName="add-modal"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Upload
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <div>
                            <div className="modal-fields">
                                <label htmlFor="description">File Description</label>
                                <input type="text" name="description" id="description" placeholder="Sample File" />
                            </div>
                            <div className="modal-fields">
                                <label htmlFor="file">File Upload</label>
                                <input className="file-input" type="file" name="file" id="file" />
                            </div>
                        </div>
                        <div className="footer">
                            <Button add type="darken" text="Upload now" bold />
                            <Button add type="darken" text="Cancel" bold click={props.onHide} />
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default AddUploadModal;