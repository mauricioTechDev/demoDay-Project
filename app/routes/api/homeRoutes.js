//==============================================
// HOME ROUTES
//==============================================

const houseController = require('../../controllers/home')
// console.log("THIS IS A TEST")
module.exports = function(app, passport, db) {

  console.log(houseController)

  app.post('/saveHouse', houseController.create);

  app.delete('/deleteHome', houseController.remove)

}
