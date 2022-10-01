const router = require("express").Router();
const { validateToken } = require("../middlewares/jwt");

const { getAllUsers, register, login, getUserById, updateUserById, deleteUserById, getCurrentLoggedUser, logout } = require("../controllers/usersControllers");

router.get('/', validateToken, getAllUsers);
router.get('/me', validateToken, getCurrentLoggedUser);
router.get('/:id', validateToken, getUserById);
router.put('/:id', validateToken, updateUserById);
router.delete('/:id', validateToken, deleteUserById);
router.post('/login', login);
router.post('/register', register);
router.get('/logout', validateToken, logout);

module.exports = router;