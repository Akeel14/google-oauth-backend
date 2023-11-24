const mongoose = require("mongoose");
const { Schema, ObjectId } = mongoose;

const mediaSchema = new Schema(
  {
    id: Number,
    url: String,
    path: String,
    createdAt: Date,
    updatedAt: Date,
    userId: {
      type: ObjectId,
      ref: "User",
    },
  },
  { collection: "medias" }
);

module.exports = mongoose.model("Media", mediaSchema);
