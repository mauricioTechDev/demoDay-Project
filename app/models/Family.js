const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// ==================================
// FAMILY MODEL
// ==================================

const FamilySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  income: {
    type: Number,
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    required: true
  }
});


//Name of my Model is Family.  In the quotes is the name of the collection
//and the collection will be modeled after my FamilySchema
const Family = mongoose.model('familyInfo', FamilySchema);


// Here I am exporting the Model to acsess in other files
module.exports = Family;
