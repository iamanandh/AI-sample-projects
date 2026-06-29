import { useState } from 'react'
import PageHeader from '../components/PageHeader.jsx'
import RentalCard from '../components/RentalCard.jsx'
import StateMessage from '../components/StateMessage.jsx'

function BrowsePage({ rentals, savedIds, onToggleSaved }) {
  const [areaFilter, setAreaFilter] = useState('All')
  const [typeFilter, setTypeFilter] = useState('All')
  const [bedsFilter, setBedsFilter] = useState('All')
  const [maxPrice, setMaxPrice] = useState('2500')
  const [petFilter, setPetFilter] = useState('All')

  const areas = ['All', ...new Set(rentals.map((rental) => rental.area))]
  const types = ['All', ...new Set(rentals.map((rental) => rental.type))]
  const bedOptions = [...new Set(rentals.map((rental) => rental.beds))].sort()
  const filteredRentals = rentals.filter((rental) => {
    const matchesArea = areaFilter === 'All' || rental.area === areaFilter
    const matchesType = typeFilter === 'All' || rental.type === typeFilter
    const matchesBeds = bedsFilter === 'All' || rental.beds === Number(bedsFilter)
    const matchesPrice = maxPrice === '' || rental.price <= Number(maxPrice)
    const matchesPets =
      petFilter === 'All' ||
      (petFilter === 'Pet friendly' && rental.petFriendly) ||
      (petFilter === 'No pets needed' && !rental.petFriendly)

    return matchesArea && matchesType && matchesBeds && matchesPrice && matchesPets
  })

  function resetFilters() {
    setAreaFilter('All')
    setTypeFilter('All')
    setBedsFilter('All')
    setMaxPrice('2500')
    setPetFilter('All')
  }

  return (
    <>
      <PageHeader
        eyebrow="Week 4 React Router capstone"
        title="Find a rental worth visiting."
      />

      <section className="filters" aria-label="Rental filters">
        <label>
          Area
          <select value={areaFilter} onChange={(event) => setAreaFilter(event.target.value)}>
            {areas.map((area) => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </label>

        <label>
          Type
          <select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}>
            {types.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </label>

        <label>
          Bedrooms
          <select value={bedsFilter} onChange={(event) => setBedsFilter(event.target.value)}>
            <option value="All">All</option>
            {bedOptions.map((beds) => (
              <option key={beds} value={beds}>{beds} bed</option>
            ))}
          </select>
        </label>

        <label>
          Max price
          <input
            type="number"
            min="1000"
            step="100"
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
          />
        </label>

        <label>
          Pet option
          <select value={petFilter} onChange={(event) => setPetFilter(event.target.value)}>
            <option value="All">All</option>
            <option value="Pet friendly">Pet friendly</option>
            <option value="No pets needed">No pets needed</option>
          </select>
        </label>

        <button className="button secondary reset-button" type="button" onClick={resetFilters}>
          Reset filters
        </button>
      </section>

      <p className="result-count">
        Showing {filteredRentals.length} of {rentals.length} rentals
      </p>

      {filteredRentals.length > 0 ? (
        <section className="rental-grid">
          {filteredRentals.map((rental) => (
            <RentalCard
              key={rental.id}
              rental={rental}
              isSaved={savedIds.includes(rental.id)}
              onToggleSaved={onToggleSaved}
            />
          ))}
        </section>
      ) : (
        <StateMessage
          title="No rentals match these filters."
          action={
            <button className="button secondary" type="button" onClick={resetFilters}>
              Reset filters
            </button>
          }
        >
          Try a higher max price or choose All for area, type, bedrooms, and pet option.
        </StateMessage>
      )}
    </>
  )
}

export default BrowsePage
