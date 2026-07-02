function PageHeader({ eyebrow, title, children }) {
  return (
    <section className="page-heading">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      {children}
    </section>
  )
}

export default PageHeader
