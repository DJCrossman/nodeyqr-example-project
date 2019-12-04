const mongoose = require('mongoose');
const UserSchema = require('./user.model').UserSchema

const MatchSchema = new mongoose.Schema({
  _id: Number,
  connection: [UserSchema],
  created: { type: Date, default: Date.now }
});

module.exports = {
  MatchSchema,
  MatchModel: mongoose.model('matches', MatchSchema)
}