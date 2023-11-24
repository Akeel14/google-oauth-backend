const mongoose = require("mongoose");
const { Schema, ObjectId } = mongoose;

const attendanceSchema = new Schema({
  id: Number,
  userId: {
    type: ObjectId,
    ref: "User"
  },
  eventId: {
    type: ObjectId,
    ref: "Event"
  }
}, { collection: "attendances" });

module.exports = mongoose.model("Attendance", attendanceSchema)