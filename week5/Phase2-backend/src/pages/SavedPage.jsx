import PageHeader from '../components/PageHeader.jsx'
import RentalCard from '../components/RentalCard.jsx'
import StateMessage from '../components/StateMessage.jsx'

function SavedPage({ rentals, isLoading, loadError, savedIds, onToggleSaved }) {
  const savedRentals = rentals.filter((rental) => savedIds.includes(rental.id))

  if (isLoading) {
    return (
      <StateMessage title="Loading saved rentals...">
        Getting the rental list from the Express API.
      </StateMessage>
    )
  }

  if (loadError) {
    return (
      <StateMessage tone="error" title="Could not load saved rentals.">
        Start the backend with npm run server, then refresh the page.
      </StateMessage>
    )
  }

  return (
    <>
      <PageHeader eyebrow="Saved rentals" title="Your shortlist" />

      {savedRentals.length > 0 ? (
        <section className="rental-grid">
          {savedRentals.map((rental) => (
            <RentalCard
              key={rental.id}
              rental={rental}
              isSaved={true}
              onToggleSaved={onToggleSaved}
            />
          ))}
        </section>
      ) : (
        <StateMessage title="No saved rentals yet.">
          Save rentals from the browse page to build your shortlist.
        </StateMessage>
      )}
    </>
  )
}

export default SavedPage
