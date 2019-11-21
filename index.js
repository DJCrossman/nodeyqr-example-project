const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const port = 3000
const urlencodedParser = bodyParser.urlencoded({extended: false})

app.use(express.static('public'))
app.use(urlencodedParser)

const user = {id: 1, name: 'Cliford', description: 'Loves belly rubs.', picture: '/img/dogs/dog_1.jpg'}
const dogs = [
  {id: 2, name: 'Patches', description: 'Loves belly rubs.', picture: '/img/dogs/dog_2.jpg'},
  {id: 3, name: 'Spot', description: 'Loves belly rubs.', picture: '/img/dogs/dog_3.jpg'},
  {id: 4, name: 'Rover', description: 'Loves belly rubs.', picture: '/img/dogs/dog_4.jpg'},
  {id: 5, name: 'Charles', description: 'Loves belly rubs.', picture: '/img/dogs/dog_5.jpg'},
]
const matches = [
  {id: 6, name: 'Terry', description: 'Loves belly rubs.', picture: '/img/dogs/dog_3.jpg'},
  {id: 7, name: 'Florence', description: 'Loves belly rubs.', picture: '/img/dogs/dog_4.jpg'},
  {id: 8, name: 'Roxie', description: 'Loves belly rubs.', picture: '/img/dogs/dog_5.jpg'},
]

app.get('/api/v1/matches', (req, res) => {
  res.status(200).json(matches)
})

app.get('/api/v1/me', (req, res) => {
  res.status(200).json(user)
})

app.get('/api/v1/dogs', (req, res) => {
  res.status(200).json(dogs)
})

app.post('/api/v1/dogs/:id/like', (req, res) => {
  const dog = dogs.find(d => d.id === +req.params.id)
  if (dog) {
    matches.push(dog)
    var index = dogs.indexOf(dog);
    if (index > -1) {
      dogs.splice(index, 1);
    }
    res.status(200).json()
  } else {
    res.status(400).json({status: 404, message: 'Dog not found'})
  }
})

app.post('/api/v1/dogs/:id/dislike', (req, res) => {
  const dog = dogs.find(d => d.id === +req.params.id)
  if (dog) {
    var index = dogs.indexOf(dog);
    if (index > -1) {
      dogs.splice(index, 1);
    }
    res.status(200).json()
  } else {
    res.status(400).json({status: 404, message: 'Dog not found'})
  }
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})