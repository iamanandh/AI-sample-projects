import { useState } from 'react'
import './App.css'

function App() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [ticketType, setTicketType] = useState('General')
  const [message, setMessage] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    if (name.trim() === '' || email.trim() === '') {
      setMessage('Please enter your name and email.')
      return
    }

    setMessage(`RSVP saved for ${name}.`)
  }

  function handleReset() {
    setName('')
    setEmail('')
    setTicketType('General')
    setMessage('')
  }

  return (
    <main className="app">
      <section className="intro">
        <p className="eyebrow">React Week 1 Day 03</p>
        <h1>Workshop RSVP</h1>
        <p>Type in the form and watch the attendee pass update live.</p>
      </section>

      <section className="workspace">
        <form className="signup-form" onSubmit={handleSubmit}>
          <h2>Signup Form</h2>

          <label>
            Attendee name
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Example: Meena"
            />
          </label>

          <label>
            Email
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="meena@example.com"
            />
          </label>

          <label>
            Ticket type
            <select
              value={ticketType}
              onChange={(event) => setTicketType(event.target.value)}
            >
              <option>General</option>
              <option>Student</option>
              <option>VIP</option>
              <option>Workshop + Lunch</option>
            </select>
          </label>

          {message && <p className="message">{message}</p>}

          <div className="actions">
            <button type="submit">Save RSVP</button>
            <button type="button" className="secondary" onClick={handleReset}>
              Reset
            </button>
          </div>
        </form>

        <article className="ticket-preview">
          <p className="ticket-label">Attendee Pass</p>
          <h2>{name || 'Your Name'}</h2>
          <p>{email || 'your@email.com'}</p>
          <span>{ticketType} Ticket</span>
        </article>
      </section>
    </main>
  )
}

export default App
