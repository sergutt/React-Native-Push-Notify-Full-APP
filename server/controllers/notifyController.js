// const User = require("../models/userModel");
const { Expo } = require("expo-server-sdk");
let expo = new Expo();
module.exports = {
  testNotify: async (req, res) => {
    // Expo stuff goes in here. You should be able to test it by
    // hitting the route "http://localhost:5000/notify/notification"

    // Change the empty string to a string that contains your push notification token

    // const findUser = await User.find({
    //   id: req.body.id
    // });
    // const pushNotificationToken = findUser[0].pushToken;

    const pushNotificationToken = req.body.token;

    if (pushNotificationToken === "") {
      throw new Error("You forgot to add your push notification token");
    }

    if (!Expo.isExpoPushToken(pushNotificationToken)) {
      res.json(`expo-push-token is not a valid Expo push token`);
    }

    const messages = [];
    const message = {
      to: pushNotificationToken,
      data: { extraData: "Some data" },
      title: req.body.title,
      body: req.body.body,
    };

    messages.push(message);

    const chunks = expo.chunkPushNotifications(messages);

    const tickets = [];

    (async () => {
      // Send the chunks to the Expo push notification service. There are
      // different strategies you could use. A simple one is to send one chunk at a
      // time, which nicely spreads the load out over time:
      for (let chunk of chunks) {
        try {
          let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
          console.log(ticketChunk);
          tickets.push(...ticketChunk);
          // NOTE: If a ticket contains an error code in ticket.details.error, you
          // must handle it appropriately. The error codes are listed in the Expo
          // documentation:
          // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
        } catch (error) {
          console.error(error);
        }
      }
    })();
    res.json({ msg: "successful test of push notification route" });
  },
};
