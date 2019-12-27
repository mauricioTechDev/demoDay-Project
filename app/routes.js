// const ObjectId = require('mongodb').ObjectId;
// TO make enviornemntal variables



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
        db.collection('userInfo').find({createdBy: uId}).toArray((err, userInfo) => {
          if (err) return console.log(err)
          // console.log("LOOK AT THIS"+userInfo.income);
          db.collection('saveHomeList').find({createdBy: uId}).toArray((err, homes) => {
            if (err) return console.log(err)
            // console.log(homes);
            for(const home of homes) {
              home.amount = parseFloat(home.amount);
              console.table(home)
            }
            console.table(userInfo);
            for(const user of userInfo) {
              user.income = parseFloat(user.income);
            }
            res.render('profile.ejs', {
              user : req.user,
              userInfo: userInfo,
              homes: homes
            })
          })
        })

    });

    // GET SHARE YOUR THOUGHTS PAGE  =========================

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



// =============================================================================
// Profile routes
// =============================================================================

    // POSTING  PROFILE =============================================
    app.post('/userInfoIntake', (req, res) => {
      db.collection('userInfo').save(
        {
          income: req.body.income,
          name: req.body.name,
          createdBy: req.user._id,
        }, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/profile')
      })
    })

    // UPDATE THE USER PROFILE =====================================
        app.put("/updateUser", (req, res) => {
       console.log("check update", req.body);
       db.collection("userInfo").findOneAndUpdate(
         { createdBy: req.user._id },
         {
           $set: {
             income: req.body.income,
             name: req.body.name,
             // createdBy: req.user._id
           }
         },
         { new: true, upsert: true },
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

    // SAVING THE FOUND HOMES ======================================
    app.post('/saveHouse', (req, res) => {
      // console.log("Home Request")
      console.log(req.body)
      console.log("hi world"+req.user.local.email)
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
           createdBy: req.user._id
        })
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

// =============================================================================
// Share your thoughts route
// =============================================================================

    // POST TO SHARE YOUR THOUGHTS ================================
    app.post('/shareYourThoughts', (req, res) => {

      console.log("hi world"+req.user.local.email)
      db.collection('shareYourThoughts').save(
        {
          title: req.body.title,
          commentArea: req.body.commentArea,
          email: req.user.local.email

        }, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.redirect('/shareYourThoughts')
      })
    })


// =============================================================================
// Delete routes
// =============================================================================

    // DELETE THE USER INFO ON PROFILE PAGE =========================
    app.delete('/messages', (req, res) => {
      db.collection('userInfo').findOneAndDelete({income: req.body.income, name: req.body.name}, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })

    // DELETE A HOME FROM PROFILE PAGE =============================
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

    // DELETE INDIVIDUAL POST FROM PUBLIC BOARD ====================
    app.delete('/shareYourThoughts', (req, res) => {
      console.log("hi world"+req.user.local.email)
      if(req.body.email === req.user.local.email) {
        console.log(req.body.title);
        console.log(req.body.commentArea);
        // query to delete data that meets criteria below
        db.collection('shareYourThoughts').deleteOne({email: req.body.email, title: req.body.title}, (err, result) => {
          console.log('deleted from database');
          if (err) return res.send(500, err)
          res.send('Message deleted!')
        });
      } else {
        res.render('favoriteHomes.ejs')
      }
    });


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
  // console.log(req)
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
