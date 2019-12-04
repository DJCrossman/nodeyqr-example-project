const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  _id: Number,
  name: String,
  description: String,
  picture: String
});
module.exports = {
  UserSchema,
  UserModel: mongoose.model('user', UserSchema)
}