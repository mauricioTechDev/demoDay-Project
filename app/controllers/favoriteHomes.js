//==============================================
// FAVORITE HOME CONTROLLERS 
//==============================================


const FavoriteHomes = require('../models/FavoriteHomes.js');

const favoriteHomesController = {
  all (req, res) {
    let uId = req.user._id
    FavoriteHomes.find({createdBy: uId},(err, favoriteHomes) => {
      // console.log(result)
      // if (err) return console.log(err)
      res.render('favoriteHomes.ejs', {
        user: req.user,
        favoriteHomes: favoriteHomes
      })
    })
  },
    create (req, res) {
      const favoriteHome = new FavoriteHomes({
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
      favoriteHome.save()
      .then(homes => {
        console.log(homes);
      })
      .catch(err => console.log(err));
    },
    remove (req, res) {
      FavoriteHomes.findOneAndDelete({
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

module.exports = favoriteHomesController;
