const router = require('express').Router();
const facebookAuthController = require('../controllers').facebookAuthController;
const passport = require('passport');

const successLoginUrl = `${process.env.FRONTEND_URL}/list`;
const errorLoginUrl = `${process.env.FRONTEND_URL}/login/error`;

router.get('/', passport.authenticate('facebook', { scope: 'email' }));

router.get(
  '/callback',
  passport.authenticate('facebook', {
    failureMessage: 'Cannot login to Facebook, please try again later!',
    // failureRedirect: '/auth/facebook/error',
    failureRedirect: errorLoginUrl,
    // successRedirect: successLoginUrl,
  }),
  facebookAuthController.loginSuccessCallback
);

router.get('/success', facebookAuthController.loginSuccess);

router.get('/error', facebookAuthController.error);

router.get('/signout', facebookAuthController.signout);

module.exports = router;
