//==============================================
// ROUTES TO LOGOUT
//==============================================
module.exports = function(app, passport, db) {
  app.get('/logout', function(req, res) {
      req.logout();
      res.redirect('/');
  });
}
