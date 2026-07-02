import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import StateMessage from '../components/StateMessage.jsx'

function RentalDetailPage({ rentals, savedIds, onToggleSaved }) {
  const { rentalId } = useParams()
  // Later, this ID can be sent to a backend endpoint like /api/rentals/:rentalId.
  const rental = rentals.find((item) => item.id === rentalId)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    moveInDate: '',
    occupants: '1',
    message: '',
  })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(false)

  if (!rental) {
    return (
      <StateMessage
        tone="error"
        title="Rental not found."
        action={<Link className="button secondary" to="/">Back to browse</Link>}
      >
        The rental ID in the URL does not match the local rental list.
      </StateMessage>
    )
  }

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((currentData) => ({ ...currentData, [name]: value }))
    setErrors((currentErrors) => ({ ...currentErrors, [name]: '' }))
  }

  function handleSubmit(event) {
    event.preventDefault()
    const nextErrors = validateApplication(formData)

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      setSent(false)
      return
    }

    // Later, this form data can be posted to a backend application endpoint.
    setSent(true)
  }

  return (
    <section className="detail-layout">
      <div>
        <img className="detail-image" src={rental.image} alt={rental.title} />
        <p className="eyebrow">{rental.area}</p>
        <h1>{rental.title}</h1>
        <p className="detail-price">${rental.price}/mo - {rental.beds} bed - {rental.type}</p>
        <p>{rental.description}</p>
        <ul className="highlights">
          {rental.highlights.map((highlight) => (
            <li key={highlight}>{highlight}</li>
          ))}
        </ul>
        <button className="button" type="button" onClick={() => onToggleSaved(rental.id)}>
          {savedIds.includes(rental.id) ? 'Remove from saved' : 'Save rental'}
        </button>
      </div>

      {sent ? (
        <StateMessage
          tone="success"
          title={`Thanks, ${formData.name}.`}
          action={
            <button className="button secondary" type="button" onClick={() => setSent(false)}>
              Edit application
            </button>
          }
        >
          <p>
            Your inquiry for {rental.title} is saved in this frontend demo.
          </p>
        </StateMessage>
      ) : (
        <form className="inquiry-form" onSubmit={handleSubmit} noValidate>
          <h2>Inquiry / application form</h2>
          <label>
            Name
            <input name="name" value={formData.name} onChange={handleChange} />
            {errors.name && <span className="field-error">{errors.name}</span>}
          </label>
          <label>
            Email
            <input name="email" type="email" value={formData.email} onChange={handleChange} />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </label>
          <label>
            Move-in date
            <input
              name="moveInDate"
              type="date"
              value={formData.moveInDate}
              onChange={handleChange}
            />
            {errors.moveInDate && <span className="field-error">{errors.moveInDate}</span>}
          </label>
          <label>
            Occupants
            <select name="occupants" value={formData.occupants} onChange={handleChange}>
              <option value="1">1 occupant</option>
              <option value="2">2 occupants</option>
              <option value="3">3 occupants</option>
              <option value="4">4 occupants</option>
            </select>
          </label>
          <label>
            Message
            <textarea name="message" value={formData.message} onChange={handleChange} />
            {errors.message && <span className="field-error">{errors.message}</span>}
          </label>
          <button className="button" type="submit">Send application</button>
        </form>
      )}
    </section>
  )
}

function validateApplication(formData) {
  const nextErrors = {}
  const emailHasAtSymbol = formData.email.includes('@')

  if (formData.name.trim().length < 2) {
    nextErrors.name = 'Enter your name.'
  }

  if (!emailHasAtSymbol) {
    nextErrors.email = 'Enter a valid email.'
  }

  if (!formData.moveInDate) {
    nextErrors.moveInDate = 'Choose a move-in date.'
  }

  if (formData.message.trim().length < 10) {
    nextErrors.message = 'Write at least 10 characters.'
  }

  return nextErrors
}

export default RentalDetailPage
