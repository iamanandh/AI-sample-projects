import { useState } from 'react'
import './App.css'

const movies = [
  {
    id: 1,
    title: 'Spider-Man: Into the Spider-Verse',
    genre: 'Animation',
    mood: 'Fun',
    year: 2018,
  },
  {
    id: 2,
    title: 'Knives Out',
    genre: 'Mystery',
    mood: 'Clever',
    year: 2019,
  },
  {
    id: 3,
    title: 'The Princess Bride',
    genre: 'Adventure',
    mood: 'Cozy',
    year: 1987,
  },
  {
    id: 4,
    title: 'Hidden Figures',
    genre: 'Drama',
    mood: 'Inspiring',
    year: 2016,
  },
  {
    id: 5,
    title: 'Uncharted',
    genre: 'Adventure',
    mood: 'Exciting',
    year: 2022,
  },
]

function MovieCard({ movie, isShortlisted, onToggleShortlist }) {
  return (
    <article className="movie-card">
      <div>
        <p className="movie-genre">{movie.genre}</p>
        <h2>{movie.title}</h2>
        <p>
          {movie.mood} mood - {movie.year}
        </p>
      </div>

      <button type="button" onClick={() => onToggleShortlist(movie.id)}>
        {isShortlisted ? 'Remove' : 'Shortlist'}
      </button>
    </article>
  )
}

function App() {
  const [searchText, setSearchText] = useState('')
  const [selectedGenre, setSelectedGenre] = useState('All')
  const [shortlist, setShortlist] = useState([])

  const genres = ['All', 'Animation', 'Mystery', 'Adventure', 'Drama']

  const visibleMovies = movies.filter((movie) => {
    const matchesSearch = movie.title
      .toLowerCase()
      .includes(searchText.toLowerCase())
    const matchesGenre =
      selectedGenre === 'All' || movie.genre === selectedGenre

    return matchesSearch && matchesGenre
  })

  function toggleShortlist(movieId) {
    const alreadySaved = shortlist.includes(movieId)

    if (alreadySaved) {
      setShortlist(shortlist.filter((id) => id !== movieId))
    } else {
      setShortlist([...shortlist, movieId])
    }
  }

  return (
    <main className="app">
      <section className="intro">
        <p className="eyebrow">Week 1 Day 04</p>
        <h1>Movie Night Planner</h1>
        <p>Browse movies, filter the list, and save your shortlist.</p>
      </section>

      <section className="controls" aria-label="Movie filters">
        <label>
          Search movies
          <input
            type="text"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Try Spider-Man"
          />
        </label>

        <label>
          Genre
          <select
            value={selectedGenre}
            onChange={(event) => setSelectedGenre(event.target.value)}
          >
            {genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section className="summary">
        <p>{visibleMovies.length} movie(s) found</p>
        <p>{shortlist.length} movie(s) shortlisted</p>
      </section>

      <section className="movie-list">
        {visibleMovies.length === 0 ? (
          <p className="empty-state">No movies match your search.</p>
        ) : (
          visibleMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isShortlisted={shortlist.includes(movie.id)}
              onToggleShortlist={toggleShortlist}
            />
          ))
        )}
      </section>
    </main>
  )
}

export default App
