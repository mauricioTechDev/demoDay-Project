const Family = require('./models/Family.js');
const Homes = require('./models/Homes.js');
const Thoughts = require('./models/Thoughts.js');

module.exports = function(app, passport, db) {


// normal routes ===============================================================
    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

// =============================================================================
// RENDER APP PAGES
// =============================================================================

    // GET PROFILE PAGE  =========================
    app.get('/profile', isLoggedIn, function(req, res) {
      let uId = req.user._id
        Family.find({ createdBy: uId},(err, familyInfo) => {
          if (err) return console.log(err)
          // console.log("LOOK AT THIS"+userInfo.income);
          Homes.find({createdBy: uId},(err, homes) => {
            // console.log(homes)
            if (err) return console.log(err)
            // console.log(homes);
            for(const home of homes) {
              home.amount = parseFloat(home.amount);
              // console.table(home)
            }
            var uniqueHomes = homes.reduce((acc, current) => {
              const x = acc.find(item => item.homeWebPage === current.homeWebPage);
              if (!x) {
                return acc.concat([current]);
              } else {
                return acc;
              }
            }, []);
            // console.log(uniqueHomes)
            for(const user of familyInfo) {
              user.income = parseFloat(user.income);
            }
            res.render('profile.ejs', {
              user : req.user,
              familyInfo: familyInfo,
              homes: uniqueHomes
            })
          })
        })

    });

    // GET FAVORITE HOMES PAGE ================================
    app.get('/favoriteHomes', isLoggedIn, function(req, res) {
      let uId = req.user._id
        db.collection('favoriteHomes').find({createdBy: uId}).toArray((err, favoriteHomes) => {
          // console.log(result)
          // console.log(req.user)
          if (err) return console.log(err)
          res.render('favoriteHomes.ejs', {
            user : req.user,
            favoriteHomes: favoriteHomes
          })
        })
    });
    // ADD TO FAVORITE HOMES =====================================
    app.post('/favoriteHomes', (req, res) => {
      console.log(req.body)
      db.collection('favoriteHomes').save(
        {
          amount: req.body.amount,
          street: req.body.street,
          city: req.body.city,
          state: req.body.state,
          zipcode: req.body.zipcode,
          bathrooms: req.body.bathrooms,
          bedrooms: req.body.bedrooms,
          yearBuilt: req.body.yearBuilt,
          homeWebPage: req.body.homeWebPage,
          createdBy: req.user._id
        }, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/profile')
      })
    })

    // POST USER CURRENT POSITION =================================
        app.post('/userCordinatesApi', (req, res) => {
          // console.log('I got a request');
          const userLogInLocationData = req.body
          const timestamp = Date.now();
          userLogInLocationData.timestamp = timestamp
          db.collection('userLogInLocations').save(
            {
              latitude: req.body.currentUserLat,
              longitude: req.body.currentUserLon,
              timestamp: timestamp,
              createdBy: req.user._id
            }, (err, result) => {
              if (err) return console.log(err)
              console.log("saved to database")
              res.json({
               status: 'success',
               latitude: req.body.currentUserLat,
               longitude: req.body.currentUserLon
            })
          })
        })



    // DELETE HOMES FROM FAVORITES LIST ===========================
    app.delete('/deleteFavoriteHomes', (req, res) => {
      // console.log(req.body.title, req.body.commentArea)
      console.log('hello');
      console.log(req.body.street);
      console.log(req.body.city);
      console.log(req.body.zipcode);
      db.collection('favoriteHomes').findOneAndDelete({
      street: req.body.street,
      city: req.body.city,
      zipcode: req.body.zipcode
      }, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })



        // LOGOUT ================================================
        app.get('/logout', function(req, res) {
            req.logout();
            res.redirect('/');
        });
// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
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

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('index.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
