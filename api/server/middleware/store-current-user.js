var LoopBackContext = require('loopback-context');

module.exports = function(options) {
  return function storeCurrentUser(req, res, next) {
    var app = req.app;
    if (!req.accessToken) {
      return next();
    }
    app.models.profile.findById(req.accessToken.userId, function(err, user) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(new Error('No user with this access token was found.'));
      }
      var loopbackContext = LoopBackContext.getCurrentContext();
      if (loopbackContext) {
        loopbackContext.set('currentUser', user);
      }
      next();
    });
  };
};
