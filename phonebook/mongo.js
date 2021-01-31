const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://fullstac-user:${password}@myfullstackopencluster.sqiz4.mongodb.net/phoneBook?retryWrites=true&w=majority&ssl=true`

const phoneBookSchema = new mongoose.Schema({
  name: String,
  number: String
})

const PhoneBook = mongoose.model('PhoneBook', phoneBookSchema)

const findPhonebookEntries = () => {
  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

  PhoneBook
  .find({})
  .then(entries=> {
    entries.forEach(entry => console.log(entry))
    mongoose.connection.close()
  })
}

const addPhonebookEntry = (name, number) => {
  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

  const phoneBook = new PhoneBook({
    name: name,
    number: number
  })

  phoneBook.save().then(result => {
    console.log(`added ${result.name} number ${result.number} to the database!`)
    mongoose.connection.close()
  })
}

if (process.argv.length === 3) {
  findPhonebookEntries()
} else {
  const name = process.argv[3]

  const number = process.argv[4]

  addPhonebookEntry(name, number)
}

