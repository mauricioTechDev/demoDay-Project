module.exports = function(app, passport, db) {

// normal routes ===============================================================

    // show the home page (will also have our login links)
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function(req, res) {
      let uId = req.user._id
        db.collection('userInfo').find({createdBy: uId}).toArray((err, userInfo) => {
          if (err) return console.log(err)
          db.collection('saveHomeList').find({createdBy: uId}).toArray((err, homes) => {
            if (err) return console.log(err)
            console.log(userInfo);
            console.log(homes);
            for(const home of homes) {
              home.amount = parseFloat(home.amount);
              console.table(home)
            }
            res.render('profile.ejs', {
              user : req.user,
              userInfo: userInfo,
              homes: homes
            })
          })
        })

    });

    // SHARE YOUR THOUGHTS SECTIONS =========================

    app.get('/shareYourThoughts', isLoggedIn, function(req, res) {
        db.collection('shareYourThoughts').find().toArray((err, result) => {
          // console.log(result)
          // console.log(req.user)
          if (err) return console.log(err)
          res.render('shareYourThoughts.ejs', {
            user : req.user,
            shareYourThoughts: result
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
      db.collection('userInfo').save(
        {
          income: req.body.income,
          name: req.body.name,
          interestedInTheCityOf: req.body.interestedInTheCityOf,
          createdBy: req.user._id,
        }, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/profile')
      })
    })

    app.post('/shareYourThoughts', (req, res) => {

      console.log("hi world"+req.user.local.email)
      db.collection('shareYourThoughts').save(
        {
          title: req.body.title,
          commentArea: req.body.commentArea,
          name: req.body.name,
          email: req.user.local.email
          // fireUp: 0,
          // email: req.session.passport.user.local.email,
          // createdBy: req.user.email,
        }, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/shareYourThoughts')
      })
    })

// UPDATE THE USER PROFILE
    app.put("/updateUser", (req, res) => {
   console.log("check update", req.body);
   db.collection("userInfo").findOneAndUpdate(
     { createdBy: req.user._icd },
     {
       $set: {
         income: req.body.income,
         name: req.body.name,
         interestedInTheCityOf: req.body.interestedInTheCityOf,
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



// UPDATE FIRE RANK
  // app.put('/shareYourThoughts', (req, res) => {
  //     db.collection('shareYourThoughts')
  //     .findOneAndUpdate({title: req.body.title, commentArea: req.body.commentArea, createdBy: req.user._id}, {
  //       $set: {
  //         fireUp:req.body.fireUp + 1
  //       }
  //     }, {
  //       // sort: {_id: -1},
  //       upsert: false
  //     }, (err, result) => {
  //       if (err) return res.send(err)
  //       res.send(result)
  //     })
  //   })

  // SAVING THE FOUND address
  app.post('/saveHouse', (req, res) => {
    // console.log("Home Request")
    // console.log(req.body)
    db.collection('saveHomeList').save(
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
        console.log("saved home to the database")
        res.json({
         status: 'success',
         amount: req.body.amount,
         street: req.body.street,
         city: req.body.city,
         state: req.body.state,
         zipcode: req.body.zipcode,
         bathrooms: req.body.bathrooms,
         bedrooms: req.body.bedrooms,
         yearBuilt: req.body.yearBuilt,
         homeWebPage: req.body.homeWebPage,
      })
    })
  })



// post the users current position
    app.post('/userCordinatesApi', (req, res) => {
      // console.log('I got a request');
      // user lat and lon
      // console.log(req.body);
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
      db.collection('userInfo').findOneAndDelete({income: req.body.income, race: req.body.race, name: req.body.name}, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })
    app.delete('/deleteHome', (req, res) => {
      // console.log(req.body.title, req.body.commentArea)
      console.log('hello');
      console.log(req.body.street);
      console.log(req.body.city);
      console.log(req.body.zipcode);
      db.collection('saveHomeList').findOneAndDelete({
      street: req.body.street,
      city: req.body.city,
      // state: req.body.state,
      zipcode: req.body.zipcode
      // bathrooms: req.body.bathrooms,
      // bedrooms: req.body.bedrooms,
      // yearBuilt: req.body.yearBuilt,
      // homeWebPage: req.body.homeWebPage,
      }, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })
    app.delete('/deleteShareYourThoughts', (req, res) => {
      console.log(req.body.title, req.body.commentArea)
      db.collection('shareYourThoughts').findOneAndDelete({title: req.body.title, commentArea: req.body.commentArea}, (err, result) => {
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
