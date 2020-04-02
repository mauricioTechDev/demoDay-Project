const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// =======================================
// FAMILY MODEL
// =======================================
const ThoughtSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  commentArea: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  }
});


//Name of my Model is Family.  In the quotes is the name of the collection
//and the collection will be modeled after my FamilySchema
const Thoughts = mongoose.model('shareThought', ThoughtSchema);


// Here I am exporting the Model to acsess in other files
module.exports = Thoughts;
