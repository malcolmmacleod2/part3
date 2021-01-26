const express = require('express')
const app = express()

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
    },
    {
      "id": "febe",
      "name": "febe",
      "number": "5543322"
    },
    {
      "id": "me",
      "name": "me",
      "number": "23422342367"
    },
    {
      "id": "hghg",
      "name": "hghg",
      "number": "34234"
    },
    {
      "id": "jim",
      "name": "jim",
      "number": "23423432423"
    },
    {
      "id": "hiwer",
      "name": "hiwer",
      "number": "54543"
    },
    {
      "id": "gffg",
      "name": "gffg",
      "number": "3443"
    }
  ]

  app.get('/api/persons', (request, response) => {
      response.json(persons)
  })

  app.get('/info', (request, response) => {
    const count = persons.length
    const time = new Date().toString()

    response.send(`<p>Phonebook has info for ${count} people.</p><p>${time}</p>`)
  })

  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })