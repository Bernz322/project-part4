let mongoClient = require("mongodb").MongoClient;
const ObjectId = require('mongodb').ObjectId;

const getAllMessages = async (req, res) => {
    mongoClient.connect(process.env.MONGODB_URL, (err, db) => {
        if (err) throw err;
        let database = db.db(process.env.DB_NAME);
        database.collection("chats").aggregate([
            { $match: {} },
            {
                $lookup: {
                    from: "users",
                    localField: "user_id",
                    foreignField: "_id",
                    as: "sender"
                }
            }
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

const sendMessage = async (req, res) => {
    const { user_id, message, time } = req.body;

    if (!user_id || !message || !time) return res.status(400).json({ message: "Please enter all fields." });

    const messageData = {
        user_id: new ObjectId(user_id),
        message,
        time
    };
    mongoClient.connect(process.env.MONGODB_URL, (err, db) => {
        if (err) throw err;
        let database = db.db(process.env.DB_NAME);

        database.collection("chats").insertOne(messageData, (err, data) => {
            if (err) {
                res.status(400).json({ message: `Error sending message! : ${err}` });
            } else {
                res.status(200).json({ ...messageData, sender: [{ name: req.user.name }] });
            }
        });
    });
};

module.exports = { getAllMessages, sendMessage };