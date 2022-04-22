const express = require('express')
const app = express()
const morgan= require('morgan')
require('dotenv').config()
const cors = require('cors')
const Person = require('./model/person')
const person = require('./model/person')


app.use(express.json())
morgan.token('post',(req,res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post'))

app.use(cors())

app.use(express.static('build'))

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
  })
  /*app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    Person = Person.filter(person => person.id !== id)
  
    response.status(204).end()
  })*/
  app.post('/api/persons', (request, response) => {
    const body = request.body

    if (body.name === undefined) {
      return response.status(400).json({ error: 'content missing' })
    }  

    const person = new Person({
      name: body.name,
      number:body.number,
    })
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})
const PORT = process.env.localport
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})