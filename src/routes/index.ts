const { isUserAuthenticated } = require("../middlewares/auth-middleware");

module.exports = {
  eventRouter: require("./event-route"),
  reportRouter: require("./report-route"),
  googleAuthRouter: require("./googleAuth-route"),
  faceBookAuthRouter: require("./facebookAuth-route"),
  userRouter: require("./user-route"),
  authRouter: require("./auth-route"),
};
const router = require("express").Router();
const eventRouter = require("./event-route");
const reportRouter = require("./report-route");
const userRouter = require("./user-route");
const googleAuthRouter = require("./googleAuth-route");
const faceBookAuthRouter = require("./facebookAuth-route");
const twitterAuthRouter = require("./twitter-auth-route");
const commentRouter = require("./comment-route");
const storageRouter = require("./storage-route");
const testRouter = require("./notification-route");
const authRouter = require("./auth-route");

// Routing Control
module.exports = function (app) {
  app.use("/event", isUserAuthenticated, eventRouter);
  app.use("/report", isUserAuthenticated, reportRouter);
  app.use("/user", isUserAuthenticated, userRouter);
  app.use("/auth/facebook", faceBookAuthRouter);
  app.use("/auth/google", googleAuthRouter);
  app.use("/auth/twitter", twitterAuthRouter);
  app.use("/comment", isUserAuthenticated, commentRouter);
  app.use("/storage", isUserAuthenticated, storageRouter);
  app.use("/notify", testRouter);
  app.use('/auth', authRouter)
};
