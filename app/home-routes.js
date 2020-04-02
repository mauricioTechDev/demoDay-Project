const Homes = require('./models/Homes.js');

module.exports = function(app, passport, db) {

  // =============================================================================
  // Saved Home Routes (CONTROLLER)
  // =============================================================================

  // POSTING HOMES TO PROFILE =============================================

  app.post('/saveHouse', (req, res) => {
    console.log("saved home to the database")
    const newHome = new Homes({
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
    newHome.save()
    .then(homes => {
      console.log(homes);
    })
    .catch(err => console.log(err));
  })

  // DELETING HOMES TO PROFILE =============================================

  app.delete('/deleteHome', (req, res) => {
    Homes.findOneAndDelete({
    street: req.body.street,
    city: req.body.city,
    zipcode: req.body.zipcode
    },
      (err, result) => {
        if (err) return res.send(500, err)
        res.send(result)
      })
  })
};
