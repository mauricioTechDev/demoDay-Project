//==============================================
// ROUTES TO LOGIN
//==============================================


module.exports = function(app, passport, db) {
      // show the login form
      app.get('/login', function(req, res) {
          res.render('index.ejs', { message: req.flash('loginMessage') });
      });

      // process the login form
      app.post('/login', passport.authenticate('local-login', {
          successRedirect : '/profile', // redirect to the secure profile section
          failureRedirect : '/', // redirect back to the signup page if there is an error
          failureFlash : true // allow flash messages
      }));
}
