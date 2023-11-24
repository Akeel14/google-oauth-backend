const mongoose = require("mongoose");
const { Schema, ObjectId } = mongoose;

const bookmarkSchema = new Schema({
  id: Number,
  userId: {
    type: ObjectId,
    ref: "User"
  },
  eventId: {
    type: ObjectId,
    ref: "Event"
  }
}, { collection: "bookmarks" });

module.exports = mongoose.model("Bookmark", bookmarkSchema);
