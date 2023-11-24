const mongoose = require("mongoose");
const { Schema, ObjectId } = mongoose;

const commentSchema = new Schema(
  {
    id: Number,
    comment: String,
    createdAt: Date,
    updatedAt: Date,
    mediaIds: [
      {
        type: ObjectId,
        ref: "Media",
      },
    ],
    eventId: {
      type: ObjectId,
      ref: "Event",
    },
    userId: {
      type: ObjectId,
      ref: "User",
    },
  },
  { collection: "comments" }
);

module.exports = mongoose.model("Comment ", commentSchema);
