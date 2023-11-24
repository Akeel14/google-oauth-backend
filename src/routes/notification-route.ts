// Router
const router = require("express").Router();
// Import - notification TEST controller
const fcmController = require("../controllers/notifications/notification-controller");

// POST Request
// Send a notification
router.post("/", fcmController.notify);
// Subscribe to a topic
router.post("/subscribe", fcmController.subscribe);

module.exports = router;
