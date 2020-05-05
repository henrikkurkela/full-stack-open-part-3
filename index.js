const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
app.use(cors())
app.use(express.static('build'))

morgan.token('data', (request, response) => {
    return JSON.stringify(request.body)
})

app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.post('/api/persons', (request, response) => {
    if (request.body.name === undefined || request.body.number === undefined) {
        response.status(400).json({error: "Missing fields in request"})
    } else if (persons.map(contact => contact.name).includes(request.body.name)) {
        response.status(400).json({error: "Person exists in phonebook"})
    } else {
        const person = {
            name: request.body.name,
            number: request.body.number,
            id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
        }

        persons = persons.concat(person)
        response.json(person)
    }
})

app.put('/api/persons/:id', (request, response) => {
    if (request.body.id === undefined || request.body.number === undefined) {
        response.status(400).json({error: "Missing fields in request"})
    } else if (persons.map(contact => contact.id).includes(Number(request.body.id))) {
        let index = persons.findIndex(person => person.id === Number(request.body.id))
        persons[index].number = request.body.number
        response.json(persons[index])
    } else {
        response.status(400).json({error: "Person does not exist in phonebook"})
    }
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

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})

app.get('/info', (request, response) => {
    let res = `<div>
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${Date()}</p>
    </div>`
    response.send(res)
})

let persons = [
        {
            name: "Arto Hellas",
            number: "040-123456",
            id: 1
        },
        {
            name: "Ada Lovelace",
            number: "39-44-5323523",
            id: 2
        },
        {
            name: "Dan Abramov",
            number: "12-43-234345",
            id: 3
        },
        {
            name: "Mary Poppendieck",
            number: "39-23-6423122",
            id: 4
        }
    ]

const port = process.env.PORT || 3001
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})