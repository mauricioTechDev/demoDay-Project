//==============================================
// SHARE THOUGHT CONTROLLERS
//==============================================


const Thoughts = require('../models/Thoughts.js');

const shareThoughtsController = {
  all(req, res) {
    Thoughts.find((err, result) => {
      console.log(result)
      if (err) return console.log(err)
      res.render('shareYourThoughts.ejs', {
        user: req.user,
        shareYourThoughts: result
      })
    })
  },
  create(req, res) {
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
  },
  remove(req, res) {
    Thoughts.findOneAndDelete({
        email: req.body.email,
        title: req.body.title
      },
      (err, result) => {
        if (err) return res.send(500, err)
        res.send(result)
      })
  }
};

module.exports = shareThoughtsController;
