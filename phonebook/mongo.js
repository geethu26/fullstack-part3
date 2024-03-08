import mongoose from "mongoose"

if (process.argv.length < 3) {
  console.log('give password as argument');
  process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://phonebook:${password}@cluster0.fasghgl.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.connect(url);

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
});

const Person = mongoose.model('Person', phonebookSchema);

if (process.argv.length === 3) {
  // Display all entries in the phonebook
  Person.find({}).then((persons) => {
    console.log('phonebook:');
    persons.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length === 5) {
  // Add new entry to the phonebook
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  });

  
  person.save().then(() => {
    console.log(`added ${person.name} number ${person.number} to phonebook`);
    mongoose.connection.close();
  });
} else {
  console.log('Invalid number of arguments. Usage: node mongo.js <password> <name> <number>');
  mongoose.connection.close();
}
