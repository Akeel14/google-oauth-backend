import { getMessaging } from "firebase-admin/messaging";
import { adminApp } from "../../config/firebase";
import { sendMessage } from "./admin-send-message";

/**
 * Subscribe Controller
 */
exports.subscribe = async function (req, res) {
  try {
    const {token, topic} = req.body;
    // getMessaging().subscribeToTopic("fnDG__-KpiQJqI8SvKVSj1:APA91bGLTM-NHNQ3eOlW4zKIe-3_34TrZpZiRK0HheYFxws-HmjimOHzwii8-0pQf9t68ZtuQ7-sL6EiK0U3A9WxjJhQ32v4bNTgS_a5I9wSYfrf9CQEZJnOh3Umh977z8XQfjBVO-RD", "all_users");
    getMessaging().subscribeToTopic(token, topic).then(res.status(200).send({ message: "Subscribed Successfully."})).catch(err => res.status(500).send(err));
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
}

exports.notify = async function (req, res) {
  try {
    const cloudMessage = {
      notification: {
        title: "WhatNow: New Event Posted",
        body: "An event is happening around you. Check it now.",
      },
      topic: "all_users",
      // token: "fnDG__-KpiQJqI8SvKVSj1:APA91bGLTM-NHNQ3eOlW4zKIe-3_34TrZpZiRK0HheYFxws-HmjimOHzwii8-0pQf9t68ZtuQ7-sL6EiK0U3A9WxjJhQ32v4bNTgS_a5I9wSYfrf9CQEZJnOh3Umh977z8XQfjBVO-RD",
    };
    const admin = adminApp;
    sendMessage(cloudMessage, admin);
    res.status(200).send({ message: "Notify Successfully.", cloudMessage });
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

exports.receive = async function (req, res) {};
