const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const dudeSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  copy: { type: String, required: false },
});

module.exports = mongoose.model('Dude', dudeSchema);
