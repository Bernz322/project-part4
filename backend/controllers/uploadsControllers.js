let mongoClient = require("mongodb").MongoClient;
const ObjectId = require('mongodb').ObjectId;
const path = require('path');
const fs = require('fs'); // file system

const getAllUploads = async (req, res) => {
    mongoClient.connect(process.env.MONGODB_URL, (err, db) => {
        if (err) throw err;
        let database = db.db(process.env.DB_NAME);
        database.collection("uploads").aggregate([
            { $match: {} },
            {
                $lookup: {
                    from: "users",
                    localField: "uploader",
                    foreignField: "_id",
                    as: "uploader"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "sharedTo",
                    foreignField: "_id",
                    as: "sharedTo"
                },
            },
            { $project: { "uploader.password": 0, "sharedTo.password": 0, "sharedTo.email": 0 } }
        ]).toArray((err, data) => {
            if (err) throw err;
            if (data) {
                res.status(200).json(data);
            } else {
                res.status(404).json({ message: "User doesn't exist" });
            }
        });
    });
};

const getMyUploads = async (req, res) => {
    const { id } = req.params;
    const o_id = new ObjectId(id);

    mongoClient.connect(process.env.MONGODB_URL, (err, db) => {
        if (err) throw err;
        let database = db.db(process.env.DB_NAME);

        database.collection("uploads").aggregate([
            { $match: { uploader: o_id } },
            {
                $lookup: {
                    from: "users",
                    localField: "uploader",
                    foreignField: "_id",
                    as: "uploader"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "sharedTo",
                    foreignField: "_id",
                    as: "sharedTo"
                }
            },
            { $project: { "uploader.password": 0, "sharedTo.password": 0, "sharedTo.email": 0 } }
        ]).toArray((err, data) => {
            if (err) throw err;
            if (data) {
                res.status(200).json(data);
            } else {
                res.status(404).json({ message: "User doesn't exist" });
            }
        });
    });

};

const getUploadById = async (req, res) => {
    const { id } = req.params;
    const o_id = new ObjectId(id);

    mongoClient.connect(process.env.MONGODB_URL, (err, db) => {
        if (err) throw err;
        let database = db.db(process.env.DB_NAME);
        database.collection("uploads").aggregate([
            { $match: { _id: o_id } },
            {
                $lookup: {
                    from: "users",
                    localField: "uploader",
                    foreignField: "_id",
                    as: "uploader"
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "sharedTo",
                    foreignField: "_id",
                    as: "sharedTo"
                }
            },
            { $project: { "uploader.password": 0, "sharedTo.password": 0, "sharedTo.email": 0 } }
        ]).toArray((err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                res.status(200).json(data);
            } else {
                res.status(404).json({ message: "Upload with that ID doesn't exist!" });
            }
        });
    });
};

const shareUploadToUser = async (req, res) => {
    const { id } = req.params;
    const { toShareId } = req.body;
    const o_id = new ObjectId(id);
    const o_idToShare = new ObjectId(toShareId);

    mongoClient.connect(process.env.MONGODB_URL, (err, db) => {
        if (err) throw err;
        let database = db.db(process.env.DB_NAME);
        database.collection("uploads").updateOne({ _id: o_id }, { $push: { 'sharedTo': o_idToShare } }, (err, data) => {
            if (err) {
                res.status(400).json({ message: `Error sharing upload to that user! : ${err}` });
            } else {
                if (data.matchedCount === 0) {
                    res.status(200).json({ message: "Upload doesn't exist." });
                } else {
                    res.status(200).json({ message: "Upload has been shared to that user successfully." });
                }
            }
        });
    });
};

const removeUploadToUser = async (req, res) => {
    const { id } = req.params;
    const { toRemoveId } = req.body;
    const o_id = new ObjectId(id);
    const o_idToRemove = new ObjectId(toRemoveId);

    mongoClient.connect(process.env.MONGODB_URL, (err, db) => {
        if (err) throw err;
        let database = db.db(process.env.DB_NAME);
        database.collection("uploads").findOneAndUpdate({ _id: o_id }, { $pull: { 'sharedTo': o_idToRemove } }, { returnOriginal: false }, (err, data) => {
            console.log(data);
            if (err) {
                res.status(400).json({ message: `Error removing shared upload to that user! : ${err}` });
            } else {
                if (data.matchedCount === 0) {
                    res.status(200).json({ message: "Upload doesn't exist." });
                } else {
                    // res.status(200).json({ message: "Upload has been removed to that user successfully." });
                    res.status(200).json(data);
                }
            }
        });
    });
};

const postUpload = async (req, res) => {
    const { label, fileName, uploaderId } = req.body;
    const file = req.file.filename;
    const uploader = new ObjectId(uploaderId);

    if (!label || !fileName || !uploaderId || !file) return res.status(400).json({ message: "Please enter all fields." });

    const uploadData = {
        label,
        fileName,
        file,
        uploader,
        sharedTo: []
    };

    mongoClient.connect(process.env.MONGODB_URL, (err, db) => {
        if (err) throw err;
        let database = db.db(process.env.DB_NAME);
        database.collection("uploads").insertOne(uploadData, (err, data) => {
            if (err) {
                res.status(400).json({ message: `Error creating upload! : ${err}` });
            } else {
                res.status(200).json(uploadData);
            }
        });
    });
};

const editUploadById = async (req, res) => {
    const { label } = req.body;
    const id = req.params;
    const o_id = new ObjectId(id);  // upload id

    mongoClient.connect(process.env.MONGODB_URL, (err, db) => {
        if (err) throw err;
        let database = db.db(process.env.DB_NAME);
        database.collection("uploads").updateOne({ _id: o_id }, { $set: { label } }, { returnDocument: 'after' }, (err, data) => {
            if (err) {
                res.status(400).json({ message: `Error updating upload! : ${err}` });
            } else {
                if (data.matchedCount === 0) {
                    res.status(200).json({ message: "Upload doesn't exist." });
                } else {
                    res.status(200).json(data);
                }
            }
        });
    });
};

const deleteUploadById = async (req, res) => {
    const id = req.params;
    const o_id = new ObjectId(id);  // upload id

    mongoClient.connect(process.env.MONGODB_URL, (err, db) => {
        if (err) throw err;
        let database = db.db(process.env.DB_NAME);

        database.collection("uploads").find({ _id: o_id }).toArray((err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                database.collection("uploads").deleteOne({ _id: o_id }, (err, item) => {
                    if (err) {
                        res.status(400).json({ message: `Error deleting upload! : ${err}` });
                    } else {
                        if (item.deletedCount === 0) {
                            res.status(200).json({ message: "Upload doesn't exist." });
                        } else {
                            try {
                                fs.unlinkSync(path.join(__dirname, `../uploads/${data[0].file}`));
                                res.status(200).json({ message: "Upload has been deleted successfully." });
                            } catch (err) {
                                console.log(err);
                            }
                        }
                    }
                });
            } else {
                res.status(404).json({ message: "Upload doesn't exist!" });
            }
        });
    });
};

const getFile = (req, res) => {
    const { filename } = req.params;
    const file = path.join(__dirname, `../uploads/${filename}`);
    res.download(file);
};

module.exports = { getAllUploads, getMyUploads, getUploadById, shareUploadToUser, removeUploadToUser, postUpload, editUploadById, deleteUploadById, getFile };