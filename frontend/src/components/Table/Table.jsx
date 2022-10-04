import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import Skeleton from 'react-loading-skeleton';
import { DeleteModal, AddUploadModal, EditUploadModal } from '..';
import { tablePopulate } from '../../utils/utils';
import classes from './table.module.scss';
import { DataContext } from '../../context/Context';

const Table = ({ data, column, tableName }) => {
    const { loggedUser, loading } = useContext(DataContext);
    const [rowData, setRowData] = useState({});
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const [editModalShow, setEditModalShow] = useState(false);
    const [addModalShow, setAddModalShow] = useState(false);

    const handleDeleteModal = (item, type) => {
        // To get row data and open delete modal
        setRowData({ ...item, type });
        setDeleteModalShow(true);
    };

    const handleEditUploadModal = (item) => {
        // To get row data and open edit upload modal
        setRowData(item);
        setEditModalShow(true);
    };

    const handleAddUpload = () => {
        // To open add upload modal
        setAddModalShow(true);
    };

    const tableData = tablePopulate(data);

    return (
        <div className={classes.relative}>
            {loading ?
                <Skeleton height={300} baseColor="#cccccc" highlightColor="#f5f5f5" />
                :
                <table className={classes.globalTable}>
                    <thead>
                        <tr>
                            {column.map((column, index) => {
                                return (
                                    <th key={index}>{column.title}</th>
                                );
                            })}
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((item, index) => {
                            return (
                                item ?
                                    <tr key={item._id}>
                                        <td style={{ display: "none" }}> {item._id} </td>
                                        <td>{item.name || item.label}</td>
                                        {(item.email || item.fileName) && <td>{item.email || <a href={`http://localhost:5000/uploads/single/file/${item.file}`}>{item.fileName}</a>}</td>}
                                        <td className={classes.tableActions}>
                                            {tableName === "users" &&
                                                <>
                                                    <Link to={`/edit-user/${item._id}`}>Edit</Link>
                                                    <span className={classes.actionSeparator}>|</span>
                                                    {item._id === loggedUser.id ?
                                                        <p className={classes.userDelete}>Delete</p>
                                                        :
                                                        <p className={classes.pointer} onClick={() => handleDeleteModal(item, "user")}>Delete</p>
                                                    }
                                                </>
                                            }
                                            {tableName === "docs" &&
                                                <>
                                                    <p className={classes.pointer} onClick={() => handleEditUploadModal(item)}>Edit</p>
                                                    <span className={classes.actionSeparator}>|</span>
                                                    <p className={classes.pointer} onClick={() => handleDeleteModal(item, "upload")}>Delete</p>
                                                    <span className={classes.actionSeparator}>|</span>
                                                    <Link to={`/share/${item._id}`}>Share</Link>
                                                </>
                                            }
                                            {tableName === "shared" &&
                                                <p>{item.uploader[0].email}</p>
                                            }
                                            {tableName === "share" &&
                                                <p className={classes.pointer} onClick={() => handleDeleteModal(item, "share")}>Remove</p>
                                            }
                                        </td>
                                    </tr>
                                    :
                                    <tr key={index}>
                                        <td>&nbsp;</td>
                                        <td>&nbsp;</td>
                                        {tableName !== "share" &&
                                            <td>&nbsp;</td>
                                        }
                                    </tr>
                            );
                        })}
                    </tbody>
                </table >
            }
            {tableName === "shared" &&
                <button className={classes.uploadButton} onClick={() => handleAddUpload()}>+ Add Upload</button>
            }
            <DeleteModal
                show={deleteModalShow}
                onHide={() => setDeleteModalShow(false)}
                data={rowData}
            />
            <EditUploadModal
                show={editModalShow}
                onHide={() => setEditModalShow(false)}
                data={rowData}
            />
            <AddUploadModal
                show={addModalShow}
                onHide={() => setAddModalShow(false)}
            />
        </div>
    );
};

export default Table;