const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const UserModel = require('./models/user.model').UserModel
const MatchModel = require('./models/match.model').MatchModel

require('dotenv').config()
const app = express()
const port = process.env.PORT || 3000
const urlencodedParser = bodyParser.urlencoded({extended: false})

var mongoDB = process.env.MONGO_CONNECT_URI
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(express.static('public'))
app.use(urlencodedParser)
app.set('view engine', 'pug');

const _id = 1

app.get('', (req, res) => {
  Promise.all([
    UserModel.findById(_id).exec(),
    MatchModel.find({"connection._id": _id}).exec(),
  ]).then(([user, matches]) => {
    matches = matches.map(m => m.connection.find(c => c._id !== _id))
    res.render('index', {user, matches})
  })
})

app.get('/login', (req, res) => {
  res.render('login', {})
})

app.get('/profile', (req, res) => {
  Promise.all([
    UserModel.findById(_id).exec(),
    MatchModel.find({"connection._id": _id}).exec(),
  ]).then(([user, matches]) => {
    matches = matches.map(m => m.connection.find(c => c._id !== _id))
    res.render('profile', {user, matches})
  })
})

app.get('/dogs/:id', (req, res) => {
  res.status(500).send('Not implemented yet.')
})

app.get('/api/v1/matches', (req, res) => {
  MatchModel.find({"connection._id": _id}).exec((err, matches) => {
    matches = matches.map(m => m.connection.find(c => c._id !== _id))
    res.status(200).json(matches)
  })
})

app.get('/api/v1/me', (req, res) => {
  UserModel.findById(_id).exec((err, user) => {
    res.status(200).json(user)
  })
})

app.get('/api/v1/dogs', (req, res) => {
  Promise.all([
    UserModel.find({}).exec(),
    MatchModel.find({"connection._id": _id}).exec(),
  ]).then(([users, matches]) => {
    matches = matches.map(m => {
      let otherUser = m.connection.find(c => c._id !== _id) || {}
      return otherUser._id
    })
    let dogs = users.filter(u => !matches.includes(u._id) && u._id !== _id)
    res.status(200).json(dogs)
  })
})

app.post('/api/v1/dogs/:id/like', (req, res) => {
  const likeId = +req.params.id
  Promise.all([
    MatchModel.countDocuments(),
    UserModel.findById(_id).exec(),
    UserModel.findById(likeId).exec(),
  ]).then(([count, currentUser, otherUser]) => {
    console.log(currentUser._id, otherUser._id)
    MatchModel.create({
      _id: count++,
      connection: [currentUser, otherUser]
    }).then(() => {
      res.status(200).json()
    })
  }).catch(() => {
    res.status(404).json({status: 404, message: 'Dog not found'})
  })
})

app.post('/api/v1/dogs/:id/dislike', (req, res) => {
  res.status(200).json()
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})