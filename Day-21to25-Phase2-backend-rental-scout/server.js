import express from 'express'
import { inquiriesRouter } from './backend/routes/inquiries.js'
import { rentalsRouter } from './backend/routes/rentals.js'

const app = express()
const PORT = 4000

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204)
  }

  next()
})

app.use(express.json())

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Rental Scout API is running',
  })
})

app.get('/api', (req, res) => {
  res.json({
    message: 'Hello from the backend by anandh',
    app: 'Rental Scout API',
    routes: ['/api/rentals', '/api/rentals/:id', '/api/inquiries'],
  })
})

app.use('/api/rentals', rentalsRouter)
app.use('/api/inquiries', inquiriesRouter)

app.listen(PORT, () => {
  console.log(`Rental Scout API running at http://localhost:${PORT}`)
})
