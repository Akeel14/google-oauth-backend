require('dotenv').config();

const facebookConfig = {
  clientID: process.env.FACEBOOK_CLIENT_ID,
  clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
  callbackURL: process.env.FACEBOOK_CALLBACK_URL,
  profileFields: ['email', 'name'],
};

const twitterConfig = {
  consumerKey: process.env.TWITTER_CONSUMER_API_KEY,
  consumerSecret: process.env.TWITTER_CONSUMER_API_SECRET_KEY,
  callbackURL: process.env.TWITTER_CALLBACK_URL
}

const googleConfig = {
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
  passReqToCallback: true
};

module.exports = {
  facebookConfig,
  googleConfig,
  twitterConfig
}

// console.log(facebookConfig);

// const passport = require('passport');
// const FacebookStrategy = require('passport-facebook').Strategy;
// const express = require('express');
// const User = require('../models/User.ts');

// require('dotenv').config();

// console.log(passport);

// passport.use(
//   new FacebookStrategy(
//     {
//       clientID: process.env.FACEBOOK_CLIENT_ID,
//       clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
//       callbackURL: process.env.FACEBOOK_CALLBACK_URL,
//     },
//     async function (accessToken, refreshToken, profile, cb) {
//       const user = await User.findOne({
//         accountId: profile.id,
//         provider: 'facebook',
//       });
//       if (!user) {
//         console.log('Adding new facebook user to DB..');
//         const user = new User({
//           accountId: profile.id,
//           name: profile.displayName,
//           provider: profile.provider,
//         });
//         await user.save();
//         // console.log(user);
//         return cb(null, profile);
//       } else {
//         console.log('Facebook User already exist in DB..');
//         // console.log(profile);
//         return cb(null, profile);
//       }
//     }
//   )
// );

// console.log('==================================================');

// console.log(passport);
