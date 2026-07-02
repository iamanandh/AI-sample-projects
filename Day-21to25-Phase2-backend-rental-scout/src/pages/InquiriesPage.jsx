import PageHeader from '../components/PageHeader.jsx'
import StateMessage from '../components/StateMessage.jsx'

function InquiriesPage({ inquiries, isLoading, loadError }) {
  if (isLoading) {
    return (
      <StateMessage title="Loading inquiries...">
        Getting inquiry data from the Express API.
      </StateMessage>
    )
  }

  if (loadError) {
    return (
      <StateMessage tone="error" title="Could not load inquiries.">
        Start the backend with npm run server, then refresh the page.
      </StateMessage>
    )
  }

  return (
    <>
      <PageHeader eyebrow="Inquiry dashboard" title="Rental inquiries" />

      {inquiries.length > 0 ? (
        <section className="inquiry-list">
          {inquiries.map((inquiry) => (
            <article className="inquiry-card" key={inquiry.id}>
              <div>
                <p className="eyebrow">{inquiry.rentalTitle}</p>
                <h2>{inquiry.name}</h2>
                <p>{inquiry.email}</p>
              </div>
              <p>
                Move-in: {inquiry.moveInDate} - Occupants: {inquiry.occupants}
              </p>
              <p>{inquiry.message}</p>
            </article>
          ))}
        </section>
      ) : (
        <StateMessage title="No inquiries yet.">
          Send an inquiry from a rental detail page, then come back here.
        </StateMessage>
      )}
    </>
  )
}

export default InquiriesPage
