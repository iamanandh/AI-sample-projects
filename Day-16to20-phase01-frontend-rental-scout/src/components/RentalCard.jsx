import { Link } from 'react-router-dom'

function RentalCard({ rental, isSaved, onToggleSaved }) {
  return (
    <article className="rental-card">
      <img src={rental.image} alt={rental.title} />
      <div className="card-body">
        <div>
          <p className="eyebrow">{rental.area}</p>
          <h2>{rental.title}</h2>
          <p>{rental.beds} bed - {rental.type} - ${rental.price}/mo</p>
          <p>{rental.petFriendly ? 'Pet friendly' : 'No pets listed'}</p>
        </div>
        <div className="card-actions">
          <Link className="button secondary" to={`/rentals/${rental.id}`}>View details</Link>
          <button className="button" type="button" onClick={() => onToggleSaved(rental.id)}>
            {isSaved ? 'Saved' : 'Save'}
          </button>
        </div>
      </div>
    </article>
  )
}

export default RentalCard
