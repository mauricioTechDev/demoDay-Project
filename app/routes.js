module.exports = function(app, passport, db) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
      let uId = req.user._id
        db.collection('userInfo').find({createdBy: uId}).toArray((err, result) => {
          console.log(result)
          if (err) return console.log(err)
          res.render('profile.ejs', {
            user : req.user,
            userInfo: result
          })
        })
    });

    // LOGOUT ==============================
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

// message board routes ===============================================================

    app.post('/userInfoIntake', (req, res) => {
      // console.log(req.body)
      db.collection('userInfo').save(
        {
          income: req.body.income,
          race: req.body.race,
          name: req.body.name,
          createdBy: req.user._id,
        }, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/profile')
      })
    })

    app.post('/favoriteCity', (req, res) => {
      console.log(req.body)
      db.collection('interestedLocations').save(
        {
          nameOfTheCity: req.body.nameOfTheCity,
          // zillowIndex: req.body.zillowIndex,
        }, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/profile')
      })
    })

// to post the users current position
    app.post('/userCordinatesApi', (req, res) => {
      console.log('I got a request');
      // user lat and lon
      console.log(req.body);
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




    app.put("/updateUser", (req, res) => {
   console.log("check update", req.body);
   db.collection("userInfo").findOneAndUpdate(
     { createdBy: req.user._id },
     {
       $set: {
         income: req.body.income,
         race: req.body.race,
         name: req.body.name,
         createdBy: req.user._id
       }
     },
     { new: true,  upsert: true },
     (err, result) => {
       if (err) {
         console.log("err", err);
         return res.send(err);
       }
       console.log("res", result);
       res.send(result);
     }
   );
 });
    // NOT NEEDED RIGHT NOW
    // app.put('/messages', (req, res) => {
    //   db.collection('userInfo')
    //   .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
    //     $set: {
    //       thumbUp:req.body.thumbUp + 1
    //     }
    //   }, {
    //     sort: {_id: -1},
    //     upsert: true
    //   }, (err, result) => {
    //     if (err) return res.send(err)
    //     res.send(result)
    //   })
    // })

    app.delete('/messages', (req, res) => {
      console.log(res)
      db.collection('userInfo').findOneAndDelete({income: req.body.income, race: req.body.race, name: req.body.name}, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })

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
  // console.log(req)
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
