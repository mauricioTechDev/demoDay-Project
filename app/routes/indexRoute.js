//==============================================
// ROUTES TO MAIN PAGE(INDEX)
//==============================================

module.exports = function(app, passport, db) {
  console.log("It is a great day")
app.get('/', function(req, res) {
    res.render('index.ejs');
});
}
