const mongoose = require("mongoose");
const { Schema, ObjectId } = mongoose;

const eventSchema = new Schema(
  {
    id: Number,
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Music", "Entertainment", "Art", "Food", "Party", "Accident", "Nerd"],
    },
    createdAt: Date,
    updatedAt: Date,
    location: String,
    lag: String,
    lng: String,
    description: String,
    mediaIds: [
      {
        type: ObjectId,
        ref: "Media",
      },
    ],
    ranking: {
      like: {
        type: Number,
        default: 0,
      },
      dislike: {
        type: Number,
        default: 0
      }
    },
    attendance: {
      type: Number,
      default: 0,
    },
    userId: {
      type: ObjectId,
      ref: "User",
    },
  },
  { collection: "events" }
);

module.exports = mongoose.model("Event", eventSchema);
