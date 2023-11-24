// Router
const router = require("express").Router();
// Import - event controller
const eventController = require("../controllers").eventController;

// Get Request
// Get all the events
router.get("/", eventController.getAllEvents)
// Get the details of an event
router.get("/:event_id", eventController.getEventDetails);
// Get user's event history
router.get("/host", eventController.getUserEventHistory);
// Get a user being voted record
router.get("/rating", eventController.getUserVoteHistory);
// Get an event vote records
router.get("/votes/:event_id", eventController.getEventVotes);
// Get attendance record of an event
router.get("/attend/:event_id", eventController.getAttendance);
// POST Request
// Create a new event
router.post("/", eventController.addNewEvent);
// Vote Event
router.post("/eventRating/:event_id/type/:type", eventController.voteEvent)
// Attend Event
router.post("/attend/:event_id", eventController.attendEvent);

// Exports
module.exports = router;