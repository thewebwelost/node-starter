const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  roles: {
    user: {
      type: Number,
      default: 3030,
    },
    editor: Number,
    admin: Number,
  },
  pwd: { type: String, required: true },
  refreshToken: [String],
});

module.exports = mongoose.model('User', userSchema);
