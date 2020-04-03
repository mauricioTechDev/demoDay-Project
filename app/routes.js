const Family = require('./models/Family.js');
const Homes = require('./models/Homes.js');
const Thoughts = require('./models/Thoughts.js');

module.exports = function(app, passport, db) {

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
