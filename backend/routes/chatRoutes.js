const router = require("express").Router();
const { validateToken } = require("../middlewares/jwt");

const { getAllMessages, sendMessage } = require("../controllers/chatsControllers");

router.get('/', validateToken, getAllMessages);
router.post('/', validateToken, sendMessage);

module.exports = router;
