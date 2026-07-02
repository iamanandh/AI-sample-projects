import { useState } from 'react'
import './App.css'

const starterBooks = [
  {
    id: 1,
    title: 'Atomic Habits',
    author: 'James Clear',
    status: 'reading',
    notes: 'Read one chapter after dinner.',
  },
  {
    id: 2,
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    status: 'queued',
    notes: 'Start this on the weekend.',
  },
]

function App() {
  const [books, setBooks] = useState(starterBooks)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [filter, setFilter] = useState('all')

  const readingCount = books.filter((book) => book.status === 'reading').length
  const finishedCount = books.filter((book) => book.status === 'finished').length
  const visibleBooks =
    filter === 'all' ? books : books.filter((book) => book.status === filter)

  function handleAddBook(event) {
    event.preventDefault()

    if (title.trim() === '' || author.trim() === '') {
      return
    }

    const newBook = {
      id: Date.now(),
      title: title.trim(),
      author: author.trim(),
      status: 'queued',
      notes: '',
    }

    setBooks([...books, newBook])
    setTitle('')
    setAuthor('')
  }

  function handleDeleteBook(id) {
    setBooks(books.filter((book) => book.id !== id))
  }

  function handleToggleStatus(id) {
    setBooks(
      books.map((book) => {
        if (book.id !== id) {
          return book
        }

        return { ...book, status: getNextStatus(book.status) }
      }),
    )
  }

  function handleUpdateNotes(id, notes) {
    setBooks(
      books.map((book) => {
        if (book.id !== id) {
          return book
        }

        return { ...book, notes: notes }
      }),
    )
  }

  function getNextStatus(status) {
    if (status === 'queued') {
      return 'reading'
    }

    if (status === 'reading') {
      return 'finished'
    }

    return 'queued'
  }

  return (
    <main className="app">
      <section className="header">
        <div>
          <p className="eyebrow">Week 2 React practice</p>
          <h1>Reading Queue</h1>
          <p className="intro">Add books, track status, and slowly build your queue.</p>
        </div>

        <div className="stats" aria-label="Reading queue counts">
          <span>{books.length} total</span>
          <span>{readingCount} reading</span>
          <span>{finishedCount} finished</span>
        </div>
      </section>

      <form className="book-form" onSubmit={handleAddBook}>
        <label>
          Book title
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Example: Deep Work"
          />
        </label>

        <label>
          Author
          <input
            value={author}
            onChange={(event) => setAuthor(event.target.value)}
            placeholder="Example: Cal Newport"
          />
        </label>

        <button type="submit">Add book</button>
      </form>

      <section className="filters" aria-label="Filter books by status">
        <button
          type="button"
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All
        </button>
        <button
          type="button"
          className={filter === 'queued' ? 'active' : ''}
          onClick={() => setFilter('queued')}
        >
          Queued
        </button>
        <button
          type="button"
          className={filter === 'reading' ? 'active' : ''}
          onClick={() => setFilter('reading')}
        >
          Reading
        </button>
        <button
          type="button"
          className={filter === 'finished' ? 'active' : ''}
          onClick={() => setFilter('finished')}
        >
          Finished
        </button>
      </section>

      <section className="book-list" aria-label="Books in your reading queue">
        {visibleBooks.map((book) => (
          <article className="book-card" key={book.id}>
            <div>
              <p className={`status status-${book.status}`}>{book.status}</p>
              <h2>{book.title}</h2>
              <p>by {book.author}</p>
              <label className="notes-field">
                Notes
                <textarea
                  value={book.notes}
                  onChange={(event) => handleUpdateNotes(book.id, event.target.value)}
                  placeholder="Add a short note..."
                />
              </label>
            </div>

            <div className="actions">
              <button type="button" onClick={() => handleToggleStatus(book.id)}>
                Mark {getNextStatus(book.status)}
              </button>
              <button type="button" className="danger" onClick={() => handleDeleteBook(book.id)}>
                Remove
              </button>
            </div>
          </article>
        ))}

        {visibleBooks.length === 0 && (
          <p className="empty-message">No books match this filter yet.</p>
        )}
      </section>
    </main>
  )
}

export default App
