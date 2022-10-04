import React, { useContext, useState } from 'react';
import { Modal } from 'react-bootstrap/';
import { toast } from 'react-toastify';
import { Button } from '..';
import { DataContext } from '../../context/Context';
import { RequestError, RequestStart, RequestSuccess } from '../../reducer/actions';
import { addUpload } from '../../utils/api';
import "./modal.scss";

const AddUploadModal = (props) => {
    const { dispatch, loading, fetchAgain, setFetchAgain } = useContext(DataContext);
    const [description, setDescription] = useState("");
    const [file, setFile] = useState(null);
    const { id } = JSON.parse(localStorage.getItem("loggedUser"));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (description.trim() === "") { return toast.warn("Description is required!"); }
        if (file === null) { return toast.warn("File is required!"); }

        dispatch(RequestStart());

        const form = new FormData();
        form.append('file', file);
        form.append('label', description.trim());
        form.append('fileName', file.name);
        form.append('uploaderId', id);

        try {
            await addUpload(form);
            dispatch(RequestSuccess());
            setDescription("");
            setFile(null);
            setFetchAgain(!fetchAgain);
            props.onHide();
        } catch (error) {
            dispatch(RequestError());
            toast.error(error.response.data.message);
        }
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
                                <input type="text" value={description} name="description" id="description" placeholder="Sample File" onChange={(e) => setDescription(e.target.value)} />
                            </div>
                            <div className="modal-fields">
                                <label htmlFor="file">File Upload</label>
                                <input className="file-input" type="file" name="file" id="file" onChange={(e) => setFile(e.target.files[0])} />
                            </div>
                        </div>
                        <div className="footer">
                            <Button type="add" variant="dark" text="Upload now" bold loading={loading} />
                            <Button type="add" variant="dark" text="Cancel" bold click={props.onHide} />
                        </div>
                    </form>
                </Modal.Body>
            </Modal>
        </>
    );
};

export default AddUploadModal;