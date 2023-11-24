// Router
const router = require("express").Router();
// Import Controller
const {reportController} = require("../controllers");

// Post Request
// Report an event
router.post("/:event_id", reportController.report);

// Exports
module.exports = router;