const express = require('express')
const app = express()
app.use(express.json())
app.use(express.static('build'))
let morgan = require('morgan')
app.use(morgan('tiny'))
const cors = require('cors')

app.use(cors())
let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]
app.get('/', (request, response) => {
    response.send('<h1>Hello World!</h1>')
  })
  
  app.get('/api/notes', (request, response) => {
    response.json(notes)
  })
  
  const PORT = process.env.PORT || 3001
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
  })
 







  app.get("/api/notes/:id", (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(note => note.id ===id)
    if (note) {
        response.json(note)
      } else {
        const jsonError = {
            error: "resource not found"
        }
        //response.statusMessage = "Oops this is a dead endpoint, this resource doesnt exist";
        //response.status(400).end()
        response.status(400).send('Oops this is a dead endpoint, this resource doesnt exist');
      }
   
  })


  app.delete("/api/notes/:id", (request,response) => {
    const id = Number(request.params.id) //params is http path
    console.log("delete for ", id)
    notes = notes.filter(note => note.id !== id)
    response.status(204).end()

  })
  const generateId = () => {
    const maxId = notes.length > 0
      ? Math.max(...notes.map(n => n.id))
      : 0
    return maxId + 1
  }

  

  app.post('/api/notes', (request, response) => {
    const body = request.body
  
    if (!body.content) {
      return response.status(400).json({ 
        error: 'content missing' 
      })
    }
  
    const note = {
      content: body.content,
      important: body.important || false,
      id: generateId(),
    }
  
    notes = notes.concat(note)
  
    response.json(note)
  })

  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
  app.use(unknownEndpoint)