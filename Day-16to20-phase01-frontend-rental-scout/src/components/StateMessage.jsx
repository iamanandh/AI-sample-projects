function StateMessage({ tone = 'empty', title, children, action }) {
  return (
    <section className={`state-message ${tone}`}>
      <h2>{title}</h2>
      {children && <div className="state-body">{children}</div>}
      {action}
    </section>
  )
}

export default StateMessage
