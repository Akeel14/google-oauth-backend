import express from 'express';
require('dotenv').config();
const { connectToMongo } = require('./src/config/mongoose');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const cors = require('cors');
import helmet from 'helmet';
const User = require('./src/models/User');
const path = require('path');
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
const TwitterStrategy = require('passport-twitter').Strategy;
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const app = express();

const expressSession = session({
  secret: process.env.SESSION_SECRET,
  name: 'user',
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: null,
    expires: null,
    httpOnly: process.env.NODE_ENV === "development" ? false : true,
    secure: process.env.NODE_ENV === "development" ? false : true,
    sameSite: process.env.NODE_ENV === "development" ? "" : "none",
  }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(helmet());
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use(expressSession);
app.use(passport.initialize());
app.use(passport.session());

const {
  facebookAuthController,
  twitterAuthController,
  googleAuthController,
} = require('./src/controllers');

const {
  facebookConfig,
  googleConfig,
  twitterConfig,
} = require('./src/config/passport');

// Passport OAuth
passport.use(
  new FacebookStrategy(
    facebookConfig,
    facebookAuthController.handleFacebookAuthentication
  )
);

// Twitter OAuth
passport.use(
  new TwitterStrategy(
    twitterConfig,
    twitterAuthController.handleTwitterAuthentication
  )
);

passport.use(
  new GoogleStrategy(googleConfig, googleAuthController.handleAuthentication)
);

passport.serializeUser((user, cb) => {
  console.log('Serializing user:', user);
  cb(null, user._id);
});

passport.deserializeUser(async (id, cb) => {
  console.log('DeserializeUser::id', id);
  const user = await User.findOne({
    _id: id,
  }).catch((err) => {
    console.log('Error deserializing', err);
  });
  console.log('DeserializeUser::user', user);
  if (user) cb(null, user);
});

// Routing Control
app.get('/', (req, res) => {
  res.send('Welcome!');
});

const port = process.env.PORT || 8080;
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

require('./src/routes')(app);
app.listen(port, async () => {
  console.log('The server is running on ' + port);
  connectToMongo();
});

//  For Test
// const { User } = require('./src/models');

// const updateDB = async () => {
//   const user = await User.create({
//     userId: 1,
//     nameName: '8798789',
//     password: '3',
//     email: '4',
//     fixedLocation: '5',
//     tag: ['A', 'B'],
//     provider: 'facebook',
//   });

//   console.log(user);
// };

// app.listen(8080, async () => {
//   console.log('The server is running on 8080');
//   connectToMongo();
//   await updateDB();
// });
