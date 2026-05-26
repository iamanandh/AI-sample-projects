import { useEffect, useState } from 'react'
import './App.css'

const starterRecipes = [
  {
    id: 1,
    title: 'Tomato Rice',
    category: 'Lunch',
    time: '25 minutes',
    notes: 'Tomato, rice, onion, and basic spices',
    isFavorite: true,
  },
  {
    id: 2,
    title: 'Banana Pancakes',
    category: 'Breakfast',
    time: '15 minutes',
    notes: 'Banana, flour, milk, and honey',
    isFavorite: false,
  },
]

const categories = ['All', 'Breakfast', 'Lunch', 'Dinner', 'Snack']

function App() {
  const [recipes, setRecipes] = useState(() => {
    const savedRecipes = localStorage.getItem('recipe-box-recipes')

    if (savedRecipes) {
      return JSON.parse(savedRecipes)
    }

    return starterRecipes
  })
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('Breakfast')
  const [time, setTime] = useState('')
  const [notes, setNotes] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false)

  useEffect(() => {
    localStorage.setItem('recipe-box-recipes', JSON.stringify(recipes))
  }, [recipes])

  const visibleRecipes = recipes.filter((recipe) => {
    const matchesCategory =
      activeCategory === 'All' || recipe.category === activeCategory
    const matchesFavorite = !showFavoritesOnly || recipe.isFavorite

    return matchesCategory && matchesFavorite
  })

  const favoriteCount = recipes.filter((recipe) => recipe.isFavorite).length

  function handleAddRecipe(event) {
    event.preventDefault()

    if (!title.trim() || !time.trim()) {
      return
    }

    const newRecipe = {
      id: Date.now(),
      title: title.trim(),
      category,
      time: time.trim(),
      notes: notes.trim(),
      isFavorite: false,
    }

    setRecipes([newRecipe, ...recipes])
    setTitle('')
    setTime('')
    setNotes('')
    setCategory('Breakfast')
  }

  function toggleFavorite(recipeId) {
    const updatedRecipes = recipes.map((recipe) => {
      if (recipe.id === recipeId) {
        return { ...recipe, isFavorite: !recipe.isFavorite }
      }

      return recipe
    })

    setRecipes(updatedRecipes)
  }

  function deleteRecipe(recipeId) {
    setRecipes(recipes.filter((recipe) => recipe.id !== recipeId))
  }

  function resetRecipes() {
    setRecipes(starterRecipes)
    setActiveCategory('All')
    setShowFavoritesOnly(false)
  }

  return (
    <main className="app-shell">
      <section className="page-header">
        <p className="eyebrow">Week 2 Day 09</p>
        <h1>Recipe Box</h1>
        <p>Add recipes, organize them by category, and save favorites.</p>
      </section>

      <section className="summary-grid" aria-label="Recipe summary">
        <div>
          <span>{recipes.length}</span>
          <p>Total recipes</p>
        </div>
        <div>
          <span>{favoriteCount}</span>
          <p>Favorites</p>
        </div>
      </section>

      <section className="workspace">
        <form className="recipe-form" onSubmit={handleAddRecipe}>
          <h2>Add a recipe</h2>

          <label>
            Recipe name
            <input
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="Example: Veg noodles"
            />
          </label>

          <label>
            Category
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              {categories.slice(1).map((categoryName) => (
                <option key={categoryName} value={categoryName}>
                  {categoryName}
                </option>
              ))}
            </select>
          </label>

          <label>
            Cooking time
            <input
              type="text"
              value={time}
              onChange={(event) => setTime(event.target.value)}
              placeholder="Example: 20 minutes"
            />
          </label>
          <label>
            Notes or ingredients
            <input
              type="text"
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              placeholder="Example: tomato, onion, rice"
            />
          </label>

          <button type="submit">Add recipe</button>
        </form>

        <section className="recipe-panel">
          <div className="panel-top">
            <h2>Saved recipes</h2>
            <button type="button" className="secondary" onClick={resetRecipes}>
              Reset
            </button>
          </div>

          <div className="filters">
            {categories.map((categoryName) => (
              <button
                key={categoryName}
                type="button"
                className={activeCategory === categoryName ? 'active' : ''}
                onClick={() => setActiveCategory(categoryName)}
              >
                {categoryName}
              </button>
            ))}
          </div>

          <label className="favorite-filter">
            <input
              type="checkbox"
              checked={showFavoritesOnly}
              onChange={(event) => setShowFavoritesOnly(event.target.checked)}
            />
            Show favorites only
          </label>

          <div className="recipe-list">
            {visibleRecipes.length === 0 ? (
              <p className="empty-state">No recipes match this filter yet.</p>
            ) : (
              visibleRecipes.map((recipe) => (
                <article className="recipe-card" key={recipe.id}>
                  <div>
                    <p className="category">{recipe.category}</p>
                    <h3>{recipe.title}</h3>
                    <p>{recipe.time}</p>
                    {recipe.notes && <p>{recipe.notes}</p>}
                  </div>

                  <div className="card-actions">
                    <button
                      type="button"
                      onClick={() => toggleFavorite(recipe.id)}
                    >
                      {recipe.isFavorite ? 'Favorited' : 'Favorite'}
                    </button>
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => deleteRecipe(recipe.id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </section>
    </main>
  )
}

export default App
