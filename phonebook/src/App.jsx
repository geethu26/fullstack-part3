import { useState, useEffect } from 'react'
import noteService from './services/persons'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import Filter from './components/Filter'
import Message from './components/Message'



const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [numbers, setNumbers] = useState('')
  const [searchName, setSearchName] = useState('')
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null) // New state for message type

  useEffect(() => {
    noteService.getAll().then(initialPerson => {
      setPersons(initialPerson)
    })
  }, []) // Fix the dependency array to avoid unnecessary re-renders
   
  const addName = (event) => {
    event.preventDefault()

    const existingPerson = persons.find((person) => person.name === newName);

    if (existingPerson) {
      const confirmReplace = window.confirm(
        `${newName} is already added to the phonebook. Do you want to replace the old number?`
      );
      if (confirmReplace === true) {
        setMessage(`${newName} number updated in phonebook!`)
        setMessageType('success') // Set message type to success
        setTimeout(() => {
          setMessage(null)
          setMessageType(null)
        }, 5000)
      }
      if (!confirmReplace) {
        return;
      }

      const updatedPerson = { ...existingPerson, number: numbers }

      noteService
        .update(existingPerson.id, updatedPerson)
        .then((returnedPerson) => {
          setPersons(
            persons.map((person) =>
              person.id !== existingPerson.id ? person : returnedPerson
            )
          );
          setNewName('')
          setNumbers('');
        })
        .catch((error) => {
          console.log("Couldn't update person", error)
        });
    } else {
      const nameObject = {
        name: newName,
        number: numbers,
      };

      noteService
        .create(nameObject)
        .then((returnedPerson) => {
          setPersons(persons.concat(returnedPerson))
          setNewName('')
          setNumbers('')
          setMessage(`${returnedPerson.name} successfully added to phonebook!`)
          setMessageType('success') // Set message type to success
          setTimeout(() => {
            setMessage(null)
            setMessageType(null)
          }, 5000)
        })
        .catch((error) => {
          console.log("Couldn't create person", error)
        })
    }
  }

  const deletePerson = (id) => {
    console.log("Deleting person with id: ", id);
    noteService
      .remove(id)
      .then(() => {
        setPersons((prevPersons) =>
          prevPersons.filter((person) => person.id !== id)
        );
  
        const deletedPerson = persons.find((person) => person.id === id);
        setMessage(`${deletedPerson.name} deleted from phonebook!`);
        setMessageType('error'); // Set message type to error
        setTimeout(() => {
          setMessage(null);
          setMessageType(null);
        }, 5000);
      })
      .catch((error) => {
        console.log("Couldn't delete person ", error);
      });
  };
  

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }
  const handleNumberChange = (event) => {
    setNumbers(event.target.value)
  }
  const handleSearch = (event) => {
    setSearchName(event.target.value)
  }
  const filterPerson = persons.filter((person) =>
    person.name.toLowerCase().includes(searchName.toLowerCase())
  )
  return (
    <div>
      <h2>Phonebook</h2>
      <Message message={message} type={messageType} />
      <Filter onChange={handleSearch} value={searchName} />
      <h2>Add new person</h2>
      <PersonForm
        onSubmit={addName}
        onNameChange={handleNameChange}
        nameValue={newName}
        onNumberChange={handleNumberChange}
        numberValue={numbers}
      />
      <h2>Numbers</h2>

      {filterPerson.map((person) =>
        <Persons person={person} key={person.id} deletePerson={() => deletePerson(person.id)} />
      )}

    </div>
  )
}

export default App
