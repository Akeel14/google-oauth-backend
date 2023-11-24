import { firebaseConfig } from "../../config/firebase";

interface CloudMessage {
  notification: { title: string; body: string };
  // token: string;
  topic: string;
}

function sendMessage(message: CloudMessage, admin) {
  // Compose the message
  const newEventMessage: CloudMessage = {

    notification: {
        title: "WhatNow: New Event Posted",
        body: "An event is happening around you. Check it now.",
    },
    topic: "all_user",
    // token: "recipient-device-token", // Token: A Registration Token belongs to A certain User
  };
  admin
    .messaging()
    .send(message)
    .then((response) => {
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      console.error("Error sending message:", error);
    });
}

export { sendMessage, CloudMessage };
