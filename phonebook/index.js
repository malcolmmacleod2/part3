const express = require('express')
const app = express()
const morgan = require('morgan')

app.use(express.json());
app.use(morgan("tiny"))

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

  app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p => p.id === id)

    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }  
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

    const person = {
      name: body.name,
      number: body.number,
      id: generateId(),
    }

    persons = persons.concat(person)

    response.json(person)
  })

  const PORT = 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })