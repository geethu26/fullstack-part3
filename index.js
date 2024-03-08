const express = require('express')
const morgan =require('morgan')
const app = express()
const cors = require('cors')

app.use(cors())
app.use(express.json())

morgan.token('postData', (req) => {
    if (req.method === 'POST') {
      return JSON.stringify(req.body)
    }
    return ''
  })
  app.use(morgan(':method :url :status :res[content-length] - :response-time ms :postData'));


let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.get('/',(request,response)=>{
    response.send('<h1>Hello World!</h1>')
})

app.get('/info',(request,response)=>{
    response.send(`<p>Phonebook has info for ${persons.length} people.
    <br/>
    ${Date()}</p>`)
})

app.get('/api/persons/:id',(request,response)=>{
    const id = request.params.id
    const person = persons.find(person=>person.id==id)
    if (person){
        response.json(person)
    }else{
        response.status(404).send("Person does not exist")
    }

})

app.delete('/api/persons/:id',(request,response)=>{
    const id = Number(request.params.id)
    persons = persons.filter(person=>person.id!==id)
    response.status(204).end()
})

const generateId = ()=>{
    const idValue = Math.floor(Math.random()*25)
    return idValue
}

app.post('/api/persons',(request,response)=>{
    const body = request.body

    if(!body.name || !body.number ){
        return response.status(400).json({
            error:'information is missing'
        })
    }

    const samePerson = persons.find(person=>person.name === body.name)
    if(samePerson){
        return response.status(400).json({
            error:'Person already exists.Use a new name.'
        })
    }

    const person ={
        id:generateId(),
        name:body.name,
        number:body.number
    }
    
    persons = persons.concat(person)
    console.log(person)
    response.json(person)
})

app.get('/api/persons',(request,response)=>{
    response.json(persons)
})


const PORT = process.env.PORT || 3003
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})