// Router
const router = require("express").Router();
// Import - comment controller
const commentController = require("../controllers/comment-controller");

// POST Request
// Make a new Comment to an Event
router.post("/", commentController.createComment);

// GET Request
// Get all comments of an Event
router.get("/event/:event_id", commentController.getCommentsforEvent);
// Get the comment's detail
router.get("/detail/:comment_id", commentController.getCommentDetail);
// Get the user's comment history
router.get("/user", commentController.getCommentsforUser);

module.exports = router;
