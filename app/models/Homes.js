const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// ===================================
// HOMES MODEL
// ===================================

const HomesSchema = new Schema({
  amount: {
    type: String,
    required: true
  },
  street: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  state: {
    type: String,
    required: true
  },
  zipcode: {
    type: String,
    required: true
  },
  bathrooms: {
    type: String,
    required: true
  },
  bedrooms: {
    type: String,
    required: true
  },
  yearBuilt: {
    type: String,
    required: true
  },
  homeWebPage: {
    type: String,
    required: true
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    required: true
  },
});


//Name of my Model is Family.  In the quotes is the name of the collection
//and the collection will be modeled after my FamilySchema
const Homes = mongoose.model('saveHome', HomesSchema);


// Here I am exporting the Model to acsess in other files
module.exports = Homes;
