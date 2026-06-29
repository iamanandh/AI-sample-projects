import { useEffect, useState } from 'react'
import { weekendOptions } from './data/weekendOptions'
import './App.css'

function getStoredValue(key, fallbackValue) {
  const savedValue = localStorage.getItem(key)

  if (!savedValue) {
    return fallbackValue
  }

  try {
    return JSON.parse(savedValue)
  } catch {
    return fallbackValue
  }
}

function OptionCard({ option, isSaved, onToggleSaved }) {
  return (
    <article className="option-card">
      <div className="card-topline">
        <span>{option.category}</span>
        <span>{option.cost}</span>
      </div>
      <h3>{option.title}</h3>
      <p>{option.description}</p>
      <dl>
        <div>
          <dt>Area</dt>
          <dd>{option.area}</dd>
        </div>
        <div>
          <dt>Time</dt>
          <dd>{option.time}</dd>
        </div>
      </dl>
      <button
        type="button"
        className={isSaved ? 'saved-button' : 'primary-button'}
        onClick={() => onToggleSaved(option.id)}
      >
        {isSaved ? 'Saved' : 'Add to plan'}
      </button>
    </article>
  )
}

function PlanItem({ option, note, onUpdateNote }) {
  return (
    <article className="plan-item">
      <h3>{option.title}</h3>
      <p>
        {option.time} - {option.duration} hours
      </p>
      <label>
        Note
        <textarea
          value={note}
          onChange={(event) => onUpdateNote(option.id, event.target.value)}
          placeholder="Why do you want this in the plan?"
        />
      </label>
    </article>
  )
}

function App() {
  const [searchText, setSearchText] = useState('')
  const [category, setCategory] = useState('All')
  const [cost, setCost] = useState('All')
  const [time, setTime] = useState('All')
  const [sortBy, setSortBy] = useState('title')
  const [savedIds, setSavedIds] = useState(() => getStoredValue('city-weekend-plan', []))
  const [notesById, setNotesById] = useState(() => getStoredValue('city-weekend-notes', {}))

  useEffect(() => {
    localStorage.setItem('city-weekend-plan', JSON.stringify(savedIds))
  }, [savedIds])

  useEffect(() => {
    localStorage.setItem('city-weekend-notes', JSON.stringify(notesById))
  }, [notesById])

  const categories = ['All', ...new Set(weekendOptions.map((option) => option.category))]
  const costs = ['All', ...new Set(weekendOptions.map((option) => option.cost))]
  const times = ['All', ...new Set(weekendOptions.map((option) => option.time))]

  const filteredOptions = weekendOptions.filter((option) => {
    const matchesSearch = option.title
      .toLowerCase()
      .includes(searchText.toLowerCase())
    const matchesCategory = category === 'All' || option.category === category
    const matchesCost = cost === 'All' || option.cost === cost
    const matchesTime = time === 'All' || option.time === time

    return matchesSearch && matchesCategory && matchesCost && matchesTime
  })

  const visibleOptions = [...filteredOptions].sort((firstOption, secondOption) => {
    if (sortBy === 'duration') {
      return firstOption.duration - secondOption.duration
    }

    if (sortBy === 'time') {
      return firstOption.time.localeCompare(secondOption.time)
    }

    return firstOption.title.localeCompare(secondOption.title)
  })

  const savedOptions = weekendOptions.filter((option) => savedIds.includes(option.id))
  const totalHours = savedOptions.reduce((sum, option) => sum + option.duration, 0)

  function toggleSaved(id) {
    setSavedIds((currentIds) =>
      currentIds.includes(id)
        ? currentIds.filter((savedId) => savedId !== id)
        : [...currentIds, id],
    )
  }

  function updateNote(id, note) {
    setNotesById((currentNotes) => ({
      ...currentNotes,
      [id]: note,
    }))
  }

  function resetFilters() {
    setSearchText('')
    setCategory('All')
    setCost('All')
    setTime('All')
    setSortBy('title')
  }

  return (
    <main className="app">
      <header className="app-header">
        <div>
          <p className="eyebrow">Week 3 Day 11</p>
          <h1>City Weekend Planner</h1>
          <p className="intro">
            Explore local options, filter the list, and save a small weekend plan.
          </p>
        </div>
        <section className="summary" aria-label="Saved plan summary">
          <span>{savedOptions.length} saved</span>
          <span>{totalHours} hours</span>
        </section>
      </header>

      <section className="filters" aria-label="Weekend option filters">
        <label>
          Search
          <input
            type="search"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Try museum or lake"
          />
        </label>

        <label>
          Category
          <select value={category} onChange={(event) => setCategory(event.target.value)}>
            {categories.map((categoryName) => (
              <option key={categoryName} value={categoryName}>
                {categoryName}
              </option>
            ))}
          </select>
        </label>

        <label>
          Cost
          <select value={cost} onChange={(event) => setCost(event.target.value)}>
            {costs.map((costName) => (
              <option key={costName} value={costName}>
                {costName}
              </option>
            ))}
          </select>
        </label>

        <label>
          Time
          <select value={time} onChange={(event) => setTime(event.target.value)}>
            {times.map((timeName) => (
              <option key={timeName} value={timeName}>
                {timeName}
              </option>
            ))}
          </select>
        </label>

        <label>
          Sort
          <select value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
            <option value="title">Title</option>
            <option value="duration">Duration</option>
            <option value="time">Time</option>
          </select>
        </label>

        <button type="button" className="secondary-button" onClick={resetFilters}>
          Reset
        </button>
      </section>

      <div className="layout">
        <section className="options-section">
          <h2>Explore options</h2>
          <div className="option-grid">
            {visibleOptions.map((option) => {
              const isSaved = savedIds.includes(option.id)

              return (
                <OptionCard
                  key={option.id}
                  option={option}
                  isSaved={isSaved}
                  onToggleSaved={toggleSaved}
                />
              )
            })}
          </div>

          {visibleOptions.length === 0 && (
            <p className="empty-state">No options match these filters yet.</p>
          )}
        </section>

        <aside className="plan-panel">
          <h2>My plan</h2>
          {savedOptions.length === 0 ? (
            <p className="empty-state">Save an option to start your weekend plan.</p>
          ) : (
            <div className="plan-list">
              {savedOptions.map((option) => (
                <PlanItem
                  key={option.id}
                  option={option}
                  note={notesById[option.id] || ''}
                  onUpdateNote={updateNote}
                />
              ))}
            </div>
          )}
        </aside>
      </div>
    </main>
  )
}

export default App
