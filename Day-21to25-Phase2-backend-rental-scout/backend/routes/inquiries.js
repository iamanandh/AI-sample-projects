import { Router } from 'express'
import { inquiries } from '../data/inquiries.js'
import { rentals } from '../data/rentals.js'
import { validateInquiry } from '../validation/inquiries.js'

export const inquiriesRouter = Router()

inquiriesRouter.get('/', (req, res) => {
  res.json(inquiries)
})

inquiriesRouter.post('/', (req, res) => {
  const { rentalId, name, email, moveInDate, occupants, message } = req.body
  const rental = rentals.find((item) => item.id === rentalId)
  const errors = validateInquiry({ rental, name, email, moveInDate, message })

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      error: 'Please fix the form fields.',
      errors,
    })
  }

  const inquiry = {
    id: `inquiry-${inquiries.length + 1}`,
    rentalId,
    rentalTitle: rental.title,
    name: name.trim(),
    email: email.trim(),
    moveInDate,
    occupants: Number(occupants),
    message: message.trim(),
  }

  inquiries.push(inquiry)

  res.status(201).json({
    message: 'Inquiry saved.',
    inquiry,
  })
})
