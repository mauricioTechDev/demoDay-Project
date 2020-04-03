//==============================================
// HOME DATA CONTROLLERS 
//==============================================


const Homes = require('../models/Homes.js');

const houseController = {
    create (req, res) {
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
    },
    remove (req, res) {
      Homes.findOneAndDelete({
      street: req.body.street,
      city: req.body.city,
      zipcode: req.body.zipcode
      },
        (err, result) => {
          if (err) return res.send(500, err)
          res.send(result)
        })
    }
};

module.exports = houseController;
