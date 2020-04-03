//==============================================
// FAMILY ROUTES 
//==============================================


const familyController = require('../../controllers/family')
// console.log("THIS IS A TEST")

module.exports = function(app, passport, db) {

app.post('/userInfoIntake', familyController.create);

app.put('/updateUser', familyController.update)

app.delete('/deleteFamily', familyController.remove)
}
