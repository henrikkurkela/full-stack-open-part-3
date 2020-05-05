const mongoose = require('mongoose')

if (process.argv.length < 4) {
    console.log('Usage: node mongo.js start password')
    process.exit(1)
}

const password = process.argv[3]

const url =
    `mongodb+srv://fullstack:${password}@cluster0-y7i30.mongodb.net/persons?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const personsSchema = new mongoose.Schema({
    name: String,
    number: String
})

const Person = mongoose.model('Person', personsSchema)

if (process.argv.length == 4) {
    Person.find({}).then(result => {
        console.log("Phonebook:")
        result.forEach(person => {
          console.log(person.name, " ", person.number)
        })
        mongoose.connection.close()
      })
} else if (process.argv.length == 6) {
    const person = new Person({
        name: process.argv[4],
        number: process.argv[5]
    })

    person.save().then(response => {
        console.log(`${process.argv[4]} added to phonebook`)
        mongoose.connection.close()
    })
}

