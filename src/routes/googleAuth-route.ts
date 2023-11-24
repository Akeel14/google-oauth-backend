const router = require('express').Router();
const googleAuthController = require('../controllers').googleAuthController;
const passport = require('passport');
const { isLoggedIn } = require('../middlewares/auth-middleware')
const { dirname } = require('path');
const appDir = dirname(require.main.filename);
require("dotenv").config()

// router.get('/', (req, res)=>{
//     res.sendFile(appDir + '/index.html')
// })
router.get('/',
  passport.authenticate('google', {
    scope:
      ['email', 'profile']
  }
  )
);
// router.get('/callback',
//   passport.authenticate('google', {
//     successRedirect: '/auth/google/success',
//     failureRedirect: '/auth/google/failure'
//   })
// );
router.get('/failure', (req, res) => {
  res.send("Something went wrong!")
});
router.get('/success', isLoggedIn, (req, res) => {
  let name = req.user.userName;
  res.send(`Hello ${name}`);
})
const successRoute = process.env.FRONTEND_URL
  ? `${process.env.FRONTEND_URL}/list`
  : '/auth/google/success'
const failureRoute = process.env.FRONTEND_URL
  ? `${process.env.FRONTEND_URL}/`
  : '/auth/google/failure'

router.get('/test', (req, res) => {
  res.sendFile(appDir + '/index.html')
});

router.get('/', passport.authenticate('google', { scope: ['email', 'profile'] }));

router.get('/callback',
  passport.authenticate('google', {
    successRedirect: successRoute,
    failureRedirect: failureRoute,
  }),
  googleAuthController.loginSuccessCallback
);

router.get('/success', isLoggedIn, googleAuthController.success);

router.get('/failure', googleAuthController.failure);

router.get('/signout', googleAuthController.signout);

module.exports = router;
