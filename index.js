require('dotenv').config()
const express = require('express')
const morgan =require('morgan')
const app = express()
const cors = require('cors')
const Person = require('./models/persons') 

app.use(cors())
app.use(express.json())
app.use(express.static('dist'))

morgan.token('postData', (req) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  return ''
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'))


app.get('/',(request,response)=>{
  response.send('<h1>Hello World!</h1>')
})

app.get('/info',(request,response)=>{
  Person.find({}).then(persons => 
    response.send(`<p>Phonebook has info for ${persons.length} people.
        <br/>
        ${Date()}</p>`))
   
})


app.get('/api/persons', (request, response) => {
  Person.find({})
    .then((persons) => {
      response.json(persons.map((person) => person.toJSON()))
    })
})
  
app.get('/api/persons/:id', (request, response,next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person.toJSON())
      } else {
        response.status(404).end()
      }
    })
    .catch((error) =>  next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  
  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'Information is missing',
    })
  }
  
  const person = new Person({
    name: body.name,
    number: body.number,
  })
  
  person.save()
    .then((savedPerson) => savedPerson.toJSON())
    .then((savedAndFormattedPerson) => {
      console.log(`Added ${savedAndFormattedPerson.name} number ${savedAndFormattedPerson.number} to phonebook`)
      response.json(savedAndFormattedPerson)
    })
    .catch((error) => next(error))
})
  
app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  const person = {
    name: body.name,
    number: body.number,
  }
  
  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      if (updatedPerson) {
        response.json(updatedPerson.toJSON())
      } else {
        response.status(404).end()
      }
    })
    .catch((error) => next(error))
})
  

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})
  
const errorHandler = (error, request, response, next)=>{
  console.log(error.message)
  if (error.name === 'CastError'){
    return response.status(400).send({error:'malformatted id'})
  }else if (error.name==='ValidationError'){
    return response.status(400).json({error:error.message})
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})










// let persons = [
//     { 
//       "id": 1,
//       "name": "Arto Hellas", 
//       "number": "040-123456"
//     },
//     { 
//       "id": 2,
//       "name": "Ada Lovelace", 
//       "number": "39-44-5323523"
//     },
//     { 
//       "id": 3,
//       "name": "Dan Abramov", 
//       "number": "12-43-234345"
//     },
//     { 
//       "id": 4,
//       "name": "Mary Poppendieck", 
//       "number": "39-23-6423122"
//     }
// ]

// app.get('/',(request,response)=>{
//     response.send('<h1>Hello World!</h1>')
// })

// app.get('/info',(request,response)=>{
//     Person.find({}).then(persons => 
//         response.send(`<p>Phonebook has info for ${persons.length} people.
//         <br/>
//         ${Date()}</p>`))
   
// })

// app.get('/api/persons',(request,response)=>{
//     Person.find({}).then((persons) => {
//         response.json(persons.map((person) => person.toJSON()))
//       }).catch(error => {
//         console.error('Error fetching persons from the database:', error)
//         response.status(500).json({ error: 'Internal Server Error' })
//       })

// })

// app.get('/api/persons/:id', (request, response) => {
//     Person.findById(request.params.id).then(person => {
//       response.json(person)
//     })
//   })

// app.delete('/api/persons/:id',(request,response,next)=>{
//     // const id = Number(request.params.id)
//     // persons = persons.filter(person=>person.id!==id)
//     // response.status(204).end()
//     Person.findByIdAndRemove(request.params.id)
//     .then(()=>{
//         response.status(204).end()
//     })
//     .catch(error => next(error))
// })

// // const generateId = ()=>{
// //     const idValue = Math.floor(Math.random()*25)
// //     return idValue
// // }

// app.post('/api/persons',(request,response)=>{
//     const body = request.body

//     if(!body.name || !body.number ){
//         return response.status(400).json({
//             error:'information is missing'
//         })
//     }

//     // const samePerson = persons.find(person=>person.name === body.name)
//     // if(samePerson){
//     //     return response.status(400).json({
//     //         error:'Person already exists.Use a new name.'
//     //     })
//     // }

//     // const person ={
//     //     id:generateId(),
//     //     name:body.name,
//     //     number:body.number
//     // }
//     const person = new Person({
//         name:body.name,
//         number:body.number
//     }) 
//     person.save()
//     .then(savedPerson =>  savedPerson.toJSON())
//     .then(savedAndFormattedPerson => {
//         console.log(`added ${savedAndFormattedPerson.name} number ${savedAndFormattedPerson.number} to phonebook`)
//         response.json(savedAndFormattedPerson)
//         })
//     .catch(error => next(error))
    
// persons = persons.concat(person)
// console.log(person)
    
// })

// app.get('/api/persons',(request,response)=>{
//     response.json(persons)
// })