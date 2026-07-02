import { Router } from 'express'
import { rentals } from '../data/rentals.js'

export const rentalsRouter = Router()

rentalsRouter.get('/', (req, res) => {
  res.json(rentals)
})

rentalsRouter.get('/:id', (req, res) => {
  const rental = rentals.find((item) => item.id === req.params.id)

  if (!rental) {
    return res.status(404).json({
      error: 'Rental not found',
    })
  }

  res.json(rental)
})
