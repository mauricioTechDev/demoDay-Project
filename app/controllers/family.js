//==============================================
// FAMILY INFO CONTROLLERS 
//==============================================


const Family = require('../models/Family.js');

const familyController = {
    create (req, res) {
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
    },
    update (req, res) {
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
    },
    remove (req, res) {
      Family.findOneAndDelete({income: req.body.income, name: req.body.name},
        (err, result) => {
          if (err) return res.send(500, err)
          res.send(result)
        })
    }
};

module.exports = familyController;
