require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const PhoneBook = require('./models/phoneBook')



app.use(express.static('build'))
app.use(express.json())
app.use(cors())
app.use(morgan('tiny'))



morgan.token('body', (req, res) => JSON.stringify(req.body))

  app.get('/api/persons', (request, response) => {

    PhoneBook.find({}).then(persons => {
      response.json(persons)
    })
  })

  app.get('/info', (request, response, error) => {
    let count = 0
    const time = new Date().toString()

    PhoneBook.find({}).then(persons => {
      count = persons.length
      response.send(`<p>Phonebook has info for ${count} people.</p><p>${time}</p>`)
    })
    .catch(error => next(error))
  })

  app.get('/api/persons/:id', (request, response, next) => {
    PhoneBook.findById(request.params.id)
      .then(entry => {
        if (entry) {
          response.json(entry)
        } else {
          response.status(404).end()
        }
      })
      .catch(error => next(error))
  })

  app.delete('/api/persons/:id', (request, response, next) => {
     PhoneBook.findByIdAndRemove(request.params.id)
      .then(result => {
        response.status(204).end()
      })
      .catch(error => next(error))
  })

  app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body

    const entry = {
      name: body.name,
      number: body.number
    }
     PhoneBook.findByIdAndUpdate(request.params.id, entry, { new: true, runValidators: true })
      .then(updatedEntry => {
        response.json(updatedEntry).end()
      })
      .catch(error => next(error))
  })

  app.post('/api/persons', (request, response, next) => {

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

    const phoneBook = new PhoneBook({
      name: body.name,
      number: body.number
    })

    phoneBook.save().then(result => {
      console.log(`added ${result.name} number ${result.number} to the database!`)
      response.json(result).end()
    })
    .catch(error => next(error))
  })

  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }

  // handler of requests with unknown endpoint
  app.use(unknownEndpoint)

  const errorHandler = (error, request, response, next) => {
    console.error(error.name)

    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' })
    } 
    else if (error.name === 'ValidationError') {
      return response.status(400).send({ error: error.message })
    }

    next(error)
  } 

  app.use(errorHandler)

  const PORT = process.env.PORT
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })