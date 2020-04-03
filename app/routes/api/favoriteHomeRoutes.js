//==============================================
// FAVORITE HOME ROUTES 
//==============================================


const favoriteHomesController = require('../../controllers/favoriteHomes')
// console.log("THIS IS A TEST")
module.exports = function(app, passport, db) {

  app.get('/favoriteHomes', favoriteHomesController.all)

  app.post('/favoriteHomes', favoriteHomesController.create);

  app.delete('/deleteFavoriteHomes', favoriteHomesController.remove)

}
