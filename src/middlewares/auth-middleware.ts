const isLoggedIn = (req, res, next) => {
  console.log('middleware ran');
  req.user ? next() : res.sendStatus(401);
};

const isUserAuthenticated = (req, res, next) => {
  console.log('isUserAuthenticated::req.session.passport', req.session.passport)
  console.log('isUserAuthenticated::req.user', req.user)
  if (req.user) {
    next();
  } else {
    res.status(401).send('you must login first');
  }
};

module.exports = {
  isLoggedIn,
  isUserAuthenticated,
};
