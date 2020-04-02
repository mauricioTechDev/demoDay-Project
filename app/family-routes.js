const Family = require('./models/Family.js');

module.exports = function(app, passport, db) {
// =============================================================================
// Fammily Profile Routes (CONTROLLER)
// =============================================================================

    // POSTING FAMILY PROFILE =============================================
    app.post('/userInfoIntake', (req, res) => {
      const newFamily = new Family({
        income: req.body.income,
        name: req.body.name,
        createdBy: req.user._id,
      })
      newFamily.save()
        .then(family => {
          console.log(family);
        })
        .catch(err => console.log(err));
    })
    // =============================================================================
    // Delete routes
    // =============================================================================

    // UPDATE THE FAMILY PROFILE =====================================
      app.put('/updateUser', (req, res) => {
        Family.findOneAndUpdate({createdBy: req.user._id},
          {
            $set: {
              income: req.body.income,
              name: req.body.name,
            }
          },
          { new: true, upsert: true },
          (err, result) => {
          if (err) return res.send(err)
          res.send(result);
          })
      })
// =============================================================================
// Delete routes
// =============================================================================

    // DELETE THE USER FAMILY INFO ON PROFILE PAGE =========================
    app.delete('/deleteFamily', (req, res) => {
      Family.findOneAndDelete({income: req.body.income, name: req.body.name},
        (err, result) => {
          if (err) return res.send(500, err)
          res.send(result)
        })
    })
};
