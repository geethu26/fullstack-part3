require('dotenv').config
const mongoose = require("mongoose")
const uniqueValidator = require('mongoose-unique-validator')

// if (process.argv.length < 3) {
//   console.log('give password as argument');
//   process.exit(1);
// }
// const password = process.argv[2];

const url = process.env.MONGODB_URI

console.log('connecting to ',url);
    

mongoose.set('strictQuery', false);
mongoose.connect(url)
.then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const phonebookSchema = new mongoose.Schema({
  name: {
    type:String,
    minLength:3,
    required:true,
    unique:true
  },
  number:{
  type: String,
  minLength:8,
  required:true,
  validate:{
    validator:function(value){
      return /^[0-9]{2,3}-[0-9]{8,}$/.test(value);
    },
    message:'Invalid phone number format.Use format XX-XXXXXXX'
  }
}
})

phonebookSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })
const Person = mongoose.model('Person', phonebookSchema);

phonebookSchema.plugin(uniqueValidator)

module.exports = mongoose.model('Person', phonebookSchema)
// if (process.argv.length === 3) {
//   // Display all entries in the phonebook
//   Person.find({}).then((persons) => {
//     console.log('phonebook:');
//     persons.forEach((person) => {
//       console.log(`${person.name} ${person.number}`);
//     });
//     mongoose.connection.close();
//   });
// } else if (process.argv.length === 5) {
//   // Add new entry to the phonebook
//   const person = new Person({
//     name: process.argv[3],
//     number: process.argv[4],
//   });

//   person.save().then(() => {
//     console.log(`added ${person.name} number ${person.number} to phonebook`);
//     mongoose.connection.close();
//   });
// } else {
//   console.log('Invalid number of arguments. Usage: node mongo.js <password> <name> <number>');
//   mongoose.connection.close();
// }
