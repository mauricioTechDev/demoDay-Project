const Thoughts = require('./models/Thoughts.js');

module.exports = function(app, passport, db) {
      // =============================================================================
      // SHAREE YOUR THOUGHT (CONTROLLER)
      // =============================================================================


      // =============================================================================
      // POST THOUGHTS
      // =============================================================================
      app.post('/shareYourThoughts', (req, res) => {
        const newThought = new Thoughts({
          title: req.body.title,
          commentArea: req.body.commentArea,
          email: req.user.local.email
        })
        newThought.save()
        .then(thought => {
          console.log(thought);
        })
        .catch(err => console.log(err));
      })

      // =============================================================================
      // GET THOUGHTS
      // =============================================================================
      app.get('/shareYourThoughts', isLoggedIn, function(req, res) {
          Thoughts.find((err, result) => {
            // console.log(result)
            // console.log(req.user)
            console.log(result)
            if (err) return console.log(err)
            res.render('shareYourThoughts.ejs', {
              user : req.user,
              shareYourThoughts: result
            })
        })
      });
      // =============================================================================
      // DELETE THOUGHTS
      // =============================================================================
      app.delete('/shareYourThoughts', (req, res) => {
        Thoughts.findOneAndDelete({
          email: req.body.email,
          title: req.body.title
        },
        (err, result) => {
          if (err) return res.send(500, err)
          res.send(result)
        })
      })
    };




    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();

        res.redirect('/');
      }
