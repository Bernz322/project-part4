const mongoClient = require("mongodb").MongoClient;
const ObjectId = require('mongodb').ObjectId;
const path = require('path');
const bcrypt = require('bcrypt');
const fs = require('fs'); // file system
const { createToken } = require('../middlewares/jwt');

const getAllUsers = async (req, res) => {
    mongoClient.connect(process.env.MONGODB_URL, (err, db) => {
        if (err) throw err;
        let database = db.db(process.env.DB_NAME);
        database.collection("users").find({}, { projection: { password: 0 } }).toArray((err, data) => {
            if (err) throw err;
            res.json(data);
        });
    });
};

const getUserById = async (req, res) => {
    const { id } = req.params;
    const o_id = new ObjectId(id);

    mongoClient.connect(process.env.MONGODB_URL, (err, db) => {
        if (err) throw err;
        let database = db.db(process.env.DB_NAME);
        database.collection("users").find({ _id: o_id }, { projection: { password: 0 } }).toArray((err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                res.json(data);
            } else {
                res.status(404).json({ message: "User doesn't exist!" });
            }
        });
    });
};

const updateUserById = async (req, res) => {
    const { id } = req.params;
    const o_id = new ObjectId(id);
    const { name, email } = req.body;

    const user = {
        name,
        email
    };

    mongoClient.connect(process.env.MONGODB_URL, (err, db) => {
        if (err) throw err;
        let database = db.db(process.env.DB_NAME);

        database.collection("users").findOne({ email }, (err, data) => {
            if (err) throw err;
            if (data && data._id != id) {
                res.status(409).json({ message: "User email already exists!" });
            } else {
                database.collection("users").findOneAndUpdate({ _id: o_id }, { $set: user }, { returnOriginal: false }, (err, data) => {
                    console.log(data);
                    if (err) {
                        res.status(400).json({ message: `Error updating user! : ${err}` });
                    } else {
                        if (data.matchedCount === 0) {
                            res.status(200).json({ message: "User doesn't exist." });
                        } else {
                            res.status(200).json({ message: "User has been updated successfully." });
                        }
                    }
                });
            }
        });
    });
};

const deleteUserById = async (req, res) => {
    const { id } = req.params;
    const o_id = new ObjectId(id);
    mongoClient.connect(process.env.MONGODB_URL, (err, db) => {
        if (err) throw err;
        let database = db.db(process.env.DB_NAME);

        database.collection("users").deleteOne({ _id: o_id }, (err, data) => {
            if (err) {
                res.status(400).json({ message: `Error deleting user! : ${err}` });
            } else {
                if (data.deletedCount === 0) {
                    res.status(200).json({ message: "User doesn't exist." });
                } else {
                    database.collection("chats").deleteMany({ user_id: o_id }, (err, data) => {
                        database.collection("uploads").find({ uploader: o_id }).toArray((err, uploads) => {
                            if (err) throw err;
                            if (uploads) {
                                database.collection("uploads").deleteMany({ uploader: o_id }, (err, data) => {
                                    try {
                                        uploads.forEach(upload => {
                                            fs.unlinkSync(path.join(__dirname, `../uploads/${upload.file}`));
                                        });
                                    } catch (err) {
                                        console.error(err);
                                    }
                                    res.status(200).json({ message: "User deleted!" });
                                });
                            } else {
                                res.status(404).json({ message: "No uploads" });
                            }
                        });
                    });
                }
            }
        });
    });
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: "Please enter all fields." });

    mongoClient.connect(process.env.MONGODB_URL, (err, db) => {
        if (err) throw err;
        let database = db.db(process.env.DB_NAME);
        database.collection("users").find({ email }).toArray((err, data) => {
            if (err) throw err;
            if (data.length > 0) {
                let user = data[0];

                bcrypt.compare(password, user.password, function (err, result) {
                    if (result) {
                        const { password, ...userData } = user; // exclude password when returning the user
                        const token = createToken(userData);
                        res.cookie("accessToken", token, { maxAge: 60 * 60 * 1000 * 24 });
                        res.status(200).json({ ...userData, token });
                    } else {
                        res.status(401).json({ message: "Wrong credentials!" });
                    }
                });
            } else {
                res.status(401).json({ message: "Wrong credentials!" });
            }
        });
    });
};

const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) return res.status(400).json({ message: "Please enter all fields." });

    const hashed = await bcrypt.hash(password, 10);

    const userData = {
        name,
        email,
        password: hashed
    };

    mongoClient.connect(process.env.MONGODB_URL, (err, db) => {
        if (err) throw err;
        let database = db.db(process.env.DB_NAME);
        database.collection("users").findOne({ email }, (err, data) => {
            if (err) throw err;
            if (data) {
                res.status(409).json({ message: "User email already exists!" });
            } else {
                database.collection("users").insertOne(userData, (err, data) => {
                    if (err) {
                        res.status(400).json({ message: `Error registering user! : ${err}` });
                    } else {
                        res.status(200).json({ message: "User registered successfully." });
                    }
                });
            }
        });
    });
};

const logout = async (req, res) => {
    let cookie = req.cookies;
    for (let prop in cookie) {
        if (!cookie.hasOwnProperty(prop)) {
            continue;
        }
        res.cookie(prop, '', { expires: new Date(0) });
    }
    return res.status(200).json({ message: "Logout" });
};

const getCurrentLoggedUser = async (req, res) => {
    res.status(200).json(req.user);
};

module.exports = { getAllUsers, getUserById, login, register, updateUserById, deleteUserById, getCurrentLoggedUser, logout };