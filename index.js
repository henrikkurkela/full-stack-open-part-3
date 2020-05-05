require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')
const app = express()
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
app.use(cors())
app.use(express.static('build'))

morgan.token('data', (request) => {
    return JSON.stringify(request.body)
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons.map(person => person.toJSON()))
    })
})

app.post('/api/persons', (request, response, next) => {
    if (request.body.name === undefined || request.body.number === undefined) {
        response.status(400).json({ error: 'Missing fields in request' })
    } else {
        const person = new Person({
            name: request.body.name,
            number: request.body.number,
            id: Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)
        })

        person.save()
            .then(savedPerson => {
                response.json(savedPerson.toJSON())
            })
            .catch(error => next(error))
    }
})

app.put('/api/persons/:id', (request, response, next) => {
    if (request.body.id === undefined || request.body.number === undefined) {
        response.status(400).json({ error: 'Missing fields in request' })
    } else {
        const person = {
            number: request.body.number
        }

        Person.findByIdAndUpdate(request.params.id, person, { new: true })
            .then(updatedPerson => {
                response.json(updatedPerson.toJSON())
            })
            .catch(error => next(error))
    }
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person.toJSON())
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndDelete(request.params.id)
        .then(person => {
            response.json(person.toJSON())
        })
        .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
    Person.countDocuments({})
        .then(count => {
            let res =
                `<div>
                    <p>Phonebook has info for ${count} people</p>
                    <p>${Date()}</p>
                </div>`
            response.send(res)
        })
        .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).send({ error: 'validation error' })
    }

    next(error)
}

app.use(errorHandler)

const port = process.env.PORT
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})