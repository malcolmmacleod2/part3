require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const PhoneBook = require('./models/phoneBook')


app.use(express.json())
app.use(cors())
app.use(morgan('tiny'))

app.use(express.static('build'))

morgan.token('body', (req, res) => JSON.stringify(req.body))

let persons = [
    {
      "name": "Ada Lovelace",
      "number": "39-44-5323523",
      "id": 2
    },
    {
      "name": "Dan Abramov",
      "number": "12-43-234345",
      "id": 3
    },
    {
      "name": "Mary Poppendieck",
      "number": "39-23-6423122",
      "id": 4
    }
  ]

  app.get('/api/persons', (request, response) => {

    PhoneBook.find({}).then(persons => {
      response.json(persons)
    })
  })

  app.get('/info', (request, response) => {
    const count = persons.length
    const time = new Date().toString()

    response.send(`<p>Phonebook has info for ${count} people.</p><p>${time}</p>`)
  })

  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    PhoneBook.find({_id: id}).then(persons => {
      if (persons.length === 1) {
        response.json(persons[0])
      } else {
        response.status(404).end()
      }  
    })
  })

  app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)

    if (person) {
      persons = persons.filter(p => p.id !== id)
      response.status(204).end()
    } else {
      response.status(404).end()
    }  
  })

  const generateId = () => {
    return Math.floor(Math.random() * Math.floor(Number.MAX_SAFE_INTEGER));
  }

  app.post('/api/persons', (request, response) => {

    const body = request.body
    console.log(body)

    if (!body.name) {
      return response.status(400).json({ 
        error: 'name missing' 
      })
    }

    if (!body.number) {
      return response.status(400).json({ 
        error: 'number missing' 
      })
    }

    const found = persons.find(p => p.name === body.name)

    if (found) {
      return response.status(400).json({ 
        error: 'name exists' 
      })
    } 

    const phoneBook = new PhoneBook({
      name: body.name,
      number: body.number
    })

    phoneBook.save().then(result => {
      console.log(`added ${result.name} number ${result.number} to the database!`)
    })

    response.json(phoneBook)
  })

  const PORT = process.env.PORT
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })