const express = require('express')
const app = express()
const morgan= require('morgan')
require('dotenv').config()
const cors = require('cors')
const Person = require('./model/person')


app.use(express.json())
morgan.token('post',(req,res) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post'))

app.use(cors())

app.use(express.static('build'))

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

//const mongoose = require('mongoose')

//const url =process.env.MONGO_DB

///mongoose.connect(url)

/*const personSchema = new mongoose.Schema({
  name: String,
  number:String
})*/

//const Person = mongoose.model('Person', personSchema)

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
  app.get('/infos', (request, response) => {
    const length=persons.length
    const time=new Date()
    response.send(`<p>Phonebook has info for ${length} people</p><p>${time}</p>`)
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
  })
  const generateId = () => {
    const maxId = persons.length > 0
      ? Math.max(...persons.map(n => n.id))
      : 0
    return maxId + 1
  }
  
  app.post('/api/persons', (request, response) => {
    const body = request.body
  
    if (!body.number) {
      return response.status(400).json({ 
        error: 'number missing' 
      })
    }
    if (!body.name) {
      return response.status(400).json({ 
        error: 'name missing' 
      })
    }
    if (persons.find(person => person.name === body.name)) {
      return response.status(400).json({ 
        error: 'name must be unique'
      })
    }
    const person = {
      name:body.name,
      number:body.number,
      id: generateId()
    }
  
    persons = persons.concat(person)
  
    response.json(person)
  })
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})