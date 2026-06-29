import { Route, Routes } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Layout from './components/Layout.jsx'
import BrowsePage from './pages/BrowsePage.jsx'
import InquiriesPage from './pages/InquiriesPage.jsx'
import RentalDetailPage from './pages/RentalDetailPage.jsx'
import SavedPage from './pages/SavedPage.jsx'
import './App.css'

function App() {
  const [rentals, setRentals] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [inquiries, setInquiries] = useState([])
  const [inquiriesLoading, setInquiriesLoading] = useState(true)
  const [inquiriesError, setInquiriesError] = useState('')
  // Later, saved IDs can come from a user account in a backend.
  const [savedIds, setSavedIds] = useState([])

  useEffect(() => {
    async function loadRentals() {
      try {
        const response = await fetch('http://localhost:4000/api/rentals')

        if (!response.ok) {
          throw new Error('The rentals API did not respond correctly.')
        }

        const data = await response.json()
        setRentals(data)
        setLoadError('')
      } catch (error) {
        setLoadError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    loadRentals()
  }, [])

  useEffect(() => {
    async function loadInquiries() {
      try {
        const response = await fetch('http://localhost:4000/api/inquiries')

        if (!response.ok) {
          throw new Error('The inquiries API did not respond correctly.')
        }

        const data = await response.json()
        setInquiries(data)
        setInquiriesError('')
      } catch (error) {
        setInquiriesError(error.message)
      } finally {
        setInquiriesLoading(false)
      }
    }

    loadInquiries()
  }, [])

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
              isLoading={isLoading}
              loadError={loadError}
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
              isLoading={isLoading}
              loadError={loadError}
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
              isLoading={isLoading}
              loadError={loadError}
              savedIds={savedIds}
              onToggleSaved={toggleSaved}
            />
          }
        />
        <Route
          path="/inquiries"
          element={
            <InquiriesPage
              inquiries={inquiries}
              isLoading={inquiriesLoading}
              loadError={inquiriesError}
            />
          }
        />
      </Route>
    </Routes>
  )
}

export default App
