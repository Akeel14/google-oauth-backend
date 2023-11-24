const { Report } = require("../models");

module.exports.report = async function (req, res) {
  const { description, type } = req.body;
  const eventId = req.params.event_id;
  // Temporary User Id
  const { _id:userId } = req.user;
  try {
    // check if the user reported the event before
    const foundReport = await Report.findOne({ userId, eventId }).exec();
    if (foundReport) {
      return res.status(500).send({ message: "You reported it before" });
    }

    const newReport = new Report({
      userId, eventId, description, type
    });

    const savedReport = await newReport.save();

    return res.status(200).send({ message: "Your report is created", savedReport });
  }
  catch (err) {
    console.log(err);
    return res.status(400).send({ err })
  }
}

