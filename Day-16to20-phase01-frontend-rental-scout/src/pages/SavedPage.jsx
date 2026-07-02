import PageHeader from '../components/PageHeader.jsx'
import RentalCard from '../components/RentalCard.jsx'
import StateMessage from '../components/StateMessage.jsx'

function SavedPage({ rentals, savedIds, onToggleSaved }) {
  const savedRentals = rentals.filter((rental) => savedIds.includes(rental.id))

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
