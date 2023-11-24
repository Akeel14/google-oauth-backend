import { log } from 'console';

const { Bookmark } = require('../models');
const mongoose = require('mongoose');
const { ObjectId } = mongoose;
import { RequestHandler } from 'express';
const User = require('../models/User');

// Functions
module.exports.getUserBookmarks = async function (req, res) {
  try {
    const { _id:userId } = req.user;

    if (!userId) return res.status(400).send({ errorMessage: "Please login" })


    // Check if the user has bookmarked the event
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;

    const bookmarks = await Bookmark
      .find({ userId })
      .limit(limit)
      .skip(skip)
      .populate({
        path: "eventId",
        populate: [{
          path: 'mediaIds',
          model: 'Media'
        }]
      })
      .exec();
    console.log(bookmarks);
    res.status(200).send(bookmarks);
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports.bookmarkEvent = async function (req, res) {
  try {
    const { _id:userId } = req.user;
    const eventId = req.params.event_id;
    const isBookmark = req.params.is_bookmark == "1";

    if (!eventId) return res.status(400).send({ errorMessage: "Event is invalid" })

    // Check if the user has bookmarked the event
    const foundBookmark = await Bookmark.findOne({ eventId, userId }).exec();

    if (isBookmark) {

      if (foundBookmark) return res.status(200).send({ message: "User has bookmarked the event already", foundBookmark })

      // Create a new bookmark
      const newBookmark = new Bookmark(
        {
          eventId, userId,
          createAt: Date.now(), updateAt: Date.now(), ranking: 0
        }
      );
      console.log(newBookmark);

      const savedBookmark = await newBookmark.save();
      res.status(200).send({ message: "Bookmarked the event successfully", savedBookmark })

    }
    else {

      if (!foundBookmark) return res.status(200).send({ message: "User has unbookmarked the event already" })
      const deletedBookmark = await foundBookmark.deleteOne(foundBookmark._id);
      res.status(200).send({ message: "Unbookmarked the event successfully", deletedBookmark })

    }

  }
  catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}

module.exports.updateUserProfile = async (req, res, next) => {
  const { _id:userId } = req.user;
  const userProfile = (req.body as {
    userName: string,
    email: string,
    fixedLocation: string,
    tag: string[]
  });
  const result = await User.findOneAndUpdate({ _id: userId }, userProfile, { new: true });
  res.send(result);
};
module.exports.getProfile = async (req, res, next) => {
  const { _id:userId } = req.user;
  const user = await User.findById(userId).select('-_id -__v')
  res.send(user)
}
