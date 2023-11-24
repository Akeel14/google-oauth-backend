// Router & Multer
const router = require("express").Router();
const multer = require("multer");
// Import - storage controller
const storageController = require("../controllers/file_storage/storage-controller");
const upload = multer();
// POST Request
// Make a new Comment to an Event
router.post("/upload", upload.single("media"), storageController.uploadBinary);

// GET Request
// Get media from fs
router.get("/retrieve", storageController.getMedia);

module.exports = router;
