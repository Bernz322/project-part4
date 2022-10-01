const router = require("express").Router();
const multer = require('multer');
const path = require('path');

const { validateToken } = require("../middlewares/jwt");
const { getAllUploads, getMyUploads, getUploadById, postUpload, editUploadById, deleteUploadById, shareUploadToUser, removeUploadToUser, getFile } = require("../controllers/uploadsControllers");

const uploadFolder = path.join(__dirname, "../uploads");

const storage = multer.diskStorage({
    destination: uploadFolder, // use it when uploading
    filename: (req, file, cb) => {
        let [filename, extension] = file.originalname.split('.');   // --> upload.mp4
        let nameFile = filename + "-" + Date.now() + "." + extension; // --> give "upload-1622181268053.mp4"
        cb(null, nameFile);
    }
});

const upload = multer({ storage: storage });

router.get('/', validateToken, getAllUploads);
router.get('/:id', validateToken, getMyUploads);
router.get('/single/:id', validateToken, getUploadById);
router.post('/', validateToken, upload.single('file'), postUpload);
router.put('/single/edit/:id', validateToken, editUploadById);
router.delete('/single/delete/:id', validateToken, deleteUploadById);
router.put('/single/share/:id', validateToken, shareUploadToUser);
router.put('/single/remove/:id', validateToken, removeUploadToUser);
router.get('/single/file/:filename', getFile);

module.exports = router;
