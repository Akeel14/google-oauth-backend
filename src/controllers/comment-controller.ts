// get comment create comment
const { Comment } = require("../models");
const mongoose = require("mongoose");
const { ObjectId } = mongoose;

exports.createComment = async function (req, res) {
  try {
    const { comment, eventId, mediaIds } = req.body;
    const { _id: userId } = req.user;
    const newComment = new Comment({
      comment,
      eventId,
      mediaIds,
      createAt: new Date(),
      updatedAt: new Date(),
      userId,
      // userId,
    });

    const addComment = await newComment.save();
    res.status(200).send({ message: "Commented Successfully.", addComment });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

exports.getCommentDetail = async function (req, res) {
  try {
    const _id = req.params.comment_id;
    const comments = await Comment.findOne({ _id })
      .populate("userId", "userName avatar")
      .exec();
    console.log(comments);
    res.status(200).send(comments);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

exports.getCommentsforEvent = async function (req, res) {
  try {
    const _id = req.params.event_id;
    const comments = await Comment.find({ eventId: _id })
      .populate("userId", "userName avatar")
      .exec();
    console.log(comments);
    res.status(200).send(comments);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

// Not necessary at this Stage.
exports.getCommentsforUser = async function (req, res) {
  try {
    const { _id: userId } = req.user;
    const comments = await Comment.find({ userId: userId }).exec();
    console.log(comments);
    res.status(200).send(comments);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};
