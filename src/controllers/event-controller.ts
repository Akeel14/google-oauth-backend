import { log } from 'console';

const { Event, Upvote, Downvote, Attendance } = require('../models');
const mongoose = require('mongoose');
const { ObjectId } = mongoose;

// Functions
module.exports.getAllEvents = async function (req, res) {
  try {
    let { location, keyword, category, sort } = req.query;
    const queryObject: { location?: Object, $or?: Object, category?: Object, sort?: string, } = {};

    // Keyword Searching
    if (location) {
      queryObject.location = { $regex: location, $options: "i" };
    }

    // Keyword for both name
    if (keyword) {
      queryObject.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } }
      ];

    }

    // Filtering
    if (category) {
      queryObject.category = { $regex: category, $options: "i" }
    }

    // Pagination
    const page = req.query.page || 1;
    const limit = req.query.limit || 10;
    const skip = (page - 1) * limit;

    // Sorting for distance
    if (sort === "distance") {
      // Default CN Tower
      const lag = req.query.lag || 43.642698159339595;
      const lng = req.query.lng || -79.38703534570423;

      // Aggregation
      const aggregationPipeline = [
        {
          $match: queryObject
        },
        {
          $addFields: {
            distance: {
              $sqrt: {
                $add: [
                  {
                    $pow: [
                      {
                        $subtract: [
                          { $toDouble: '$lag' },
                          lag
                        ]
                      },
                      2
                    ]
                  },
                  {
                    $pow: [
                      {
                        $multiply: [
                          {
                            $subtract: [
                              { $toDouble: '$lng' },
                              lng
                            ]
                          },
                          0.0174533
                        ]
                      },
                      2
                    ]
                  }
                ]
              }
            }
          }
        },
        // {
        //   $lookup: {
        //     from: "users", 
        //     localField: "userId",
        //     foreignField: "_id",
        //     as: "user"
        //   }
        // },
        // {
        //   $unwind: "$user"
        // },
        // {
        //   $lookup: {
        //     from: "medias", 
        //     localField: "mediaIds",
        //     foreignField: "_id",
        //     as: "media"
        //   }
        // },
        { $sort: { distance: -1 } },
        { $limit: 10 } // limit ten results
      ];

      const foundEvents = await Event.aggregate(aggregationPipeline);
      console.log(foundEvents);

      return res.status(200).send({ data: foundEvents });
    }

    if (sort === "createdAt") {
      sort = "-createdAt"
    }


    const foundEvents = await Event.find({ ...queryObject })
      .sort(sort)
      .limit(limit)
      .skip(skip)
      .populate('userId', ['userName'])
      .populate("mediaIds", ["url"])
      .exec();
    return res.status(200).send({ data: foundEvents });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

module.exports.getUserEventHistory = async function (req, res) {
  const { _id: userId } = req.user;
  try {
    const foundEvents = await Event.find({ userId })
      .populate('userId', ['userName'])
      .exec();
    res.status(200).send({ data: foundEvents });
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports.getEventDetails = async function (req, res) {
  const _id = req.params.event_id;
  try {
    const foundEvent = await Event.findOne({ _id })
      .populate('userId', ['userName'])
      .populate("mediaIds", ["url"])
      .exec();
    const foundUpvote = await Upvote.find({ eventId: _id });
    const foundDownvote = await Downvote.find({ eventId: _id });

    res.status(200).send({ data: foundEvent, like: foundUpvote.length, dislike: foundDownvote.length });
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports.voteEvent = async function (req, res) {
  try {
    const { _id: userId } = req.user;
    if (!userId)
      return res.status(400).send({ errorMessage: 'You are not logged in' });
    const eventId = req.params.event_id;
    const { type } = req.params;

    const foundEvent = await Event.findOne({ _id: eventId });


    if (type === 'upvote') {
      // Check if user up-voted before
      const foundUpvote = await Upvote.findOne({ userId, eventId }).exec();

      if (foundUpvote) {
        return res.status(400).send('You up-voted it before');
      }
      // Check if user down-voted before
      // if yes, remove it
      const foundDownvote = await Downvote.findOne({ userId, eventId }).exec();

      if (foundDownvote) {
        await Downvote.findOneAndDelete({ _id: foundDownvote._id }).exec();
        foundEvent.ranking.dislike -= 1;
      }

      const newUpvote = new Upvote({ userId, eventId });
      const savedUpvote = await newUpvote.save();
      // Update the ranking of an event
      foundEvent.ranking.like += 1;

      await foundEvent.save();

      return res
        .status(200)
        .send({ message: 'The up-vote is created', data: savedUpvote });
    } else if (type === 'downvote') {
      const foundDownvote = await Downvote.findOne({ userId, eventId }).exec();

      if (foundDownvote) {
        return res.status(400).send('You down-voted it before');
      }

      const foundUpvote = await Upvote.findOne({ userId, eventId }).exec();

      if (foundUpvote) {
        await Upvote.findOneAndDelete({ _id: foundUpvote._id }).exec();
        foundEvent.ranking.like -= 1
      }

      const newDownvote = new Downvote({ userId, eventId });
      const savedDownvote = await newDownvote.save();

      foundEvent.ranking.dislike += 1;
      await foundEvent.save();

      return res
        .status(200)
        .send({ message: 'The down-vote is created', data: savedDownvote });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

module.exports.addNewEvent = async function (req, res) {
  try {
    const { name, category, location, lag, lng, description, posterJson, mediaIds } = req.body;
    const { _id: userId } = req.user;
    const newEvent = new Event({
      name,
      category,
      location,
      lag,
      lng,
      description,
      userId,
      mediaIds,
      createdAt: new Date(),
      updatedAt: new Date(),
      ranking: 0,
    });

    const savedEvent = await newEvent.save();

    res
      .status(200)
      .send({ message: 'The event is created successfully', data: savedEvent });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

module.exports.getUserVoteHistory = async function (req, res) {
  try {
    const { _id: userId } = req.user;
    // Find out the event user created
    const eventIdList = await Event.find({ userId }).select("_id").exec();

    const upVotesPromises = eventIdList.map(async (item) => {
      const singleEventUpvote = await Upvote.find({ eventId: item._id });
      return singleEventUpvote;
    });

    const downVotesPromises = eventIdList.map(async (item) => {
      const singleEventDownvote = await Downvote.find({ eventId: item._id });
      return singleEventDownvote;
    });

    const upVotes = await Promise.all(upVotesPromises);
    const downVotes = await Promise.all(downVotesPromises);

    const totalUpVotes = upVotes.reduce((total, votes) => total + votes.length, 0);
    const totalDownVotes = downVotes.reduce((total, votes) => total + votes.length, 0);

    res.status(200).send({
      upVoteAmount: totalUpVotes,
      downVoteAmount: totalDownVotes,
      upVotes,
      downVotes,
    });
  }
  catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}

module.exports.getEventVotes = async function (req, res) {
  try {
    const eventId = req.params.event_id;
    const upVotes = await Upvote.find({ eventId });
    const downVotes = await Downvote.find({ eventId });

    res.status(200).send({ upVoteAmount: upVotes.length, downVoteAmount: downVotes.length, upVotes, downVotes });
  }
  catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}

module.exports.attendEvent = async function (req, res) {
  try {
    const { _id: userId } = req.user;
    const eventId = req.params.event_id;

    const foundAttendance = await Attendance.findOne({ userId, eventId }).exec();

    if (foundAttendance) {
      res.status(400).send({ message: "You already attended to this event" });
    }

    const newAttendance = new Attendance({
      userId, eventId
    });
    const foundEvent = await Event.findOne({ _id: eventId });
    foundEvent.attendance += 1;
    const savedAttendance = await newAttendance.save();
    await foundEvent.save();


    res.status(200).send({ data: savedAttendance });
  }
  catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}

module.exports.getAttendance = async function (req, res) {
  try {
    const eventId = req.params.event_id;
    const foundAttendance = await Attendance.find({ eventId }).exec();

    if (foundAttendance.length > 0) {
      return res.status(200).send({ data: foundAttendance, attendanceAmount: foundAttendance.length })
    }
    return res.status(200).send({ message: `There is no attendance record of this event${eventId}` })
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }

}

module.exports.checkoutEvent = async function (req, res) {
  const userId = req.user._id;
  const eventId = req.params.event_id;

  const foundAttendance = await Attendance.findOneAndDelete({ userId, eventId }).exec();
  if (!foundAttendance) {
    return res.status(400).send({ message: "You haven't attended this event before" });
  }

  const foundEvent = await Event.findOne({ eventId }).exec();
  foundEvent.attendance -= 1;
  await foundEvent.save();

  return res.status(200).send({ data: foundEvent });
}