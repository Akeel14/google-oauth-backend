const router = require("express").Router();
const passport = require('passport');

router.get('/logged_in', ((req, res)=>{
  res.json({
    loggedIn: !!req.user,
    user: req.user || {}
  })
}))

module.exports = router;