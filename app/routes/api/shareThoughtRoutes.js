//==============================================
// SHARE THOUGHT ROUTES 
//==============================================


const shareThoughtsController = require('../../controllers/shareThoughts')
// console.log("THIS IS A TEST")

module.exports = function(app, passport, db) {

  app.get('/shareYourThoughts', shareThoughtsController.all)

  app.post('/shareYourThoughts', shareThoughtsController.create);

  app.delete('/shareYourThoughts', shareThoughtsController.remove)
}
