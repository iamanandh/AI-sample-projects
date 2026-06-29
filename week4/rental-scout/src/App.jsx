import { Route, Routes } from 'react-router-dom'
import { useState } from 'react'
import Layout from './components/Layout.jsx'
import BrowsePage from './pages/BrowsePage.jsx'
import RentalDetailPage from './pages/RentalDetailPage.jsx'
import SavedPage from './pages/SavedPage.jsx'
import { rentals } from './data/rentals.js'
import './App.css'

function App() {
  // Later, saved IDs can come from a user account in a backend.
  const [savedIds, setSavedIds] = useState([])

  function toggleSaved(id) {
    setSavedIds((currentIds) =>
      currentIds.includes(id)
        ? currentIds.filter((savedId) => savedId !== id)
        : [...currentIds, id],
    )
  }

  return (
    <Routes>
      <Route element={<Layout savedCount={savedIds.length} />}>
        <Route
          path="/"
          element={
            <BrowsePage
              rentals={rentals}
              savedIds={savedIds}
              onToggleSaved={toggleSaved}
            />
          }
        />
        <Route
          path="/rentals/:rentalId"
          element={
            <RentalDetailPage
              rentals={rentals}
              savedIds={savedIds}
              onToggleSaved={toggleSaved}
            />
          }
        />
        <Route
          path="/saved"
          element={
            <SavedPage
              rentals={rentals}
              savedIds={savedIds}
              onToggleSaved={toggleSaved}
            />
          }
        />
      </Route>
    </Routes>
  )
}

export default App
