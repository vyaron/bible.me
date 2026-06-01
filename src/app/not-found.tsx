export default function NotFound() {
  return (
    <section className="panel reader">
      <div className="reader-top">
        <span className="badge">404</span>
        <h1>Page not found</h1>
        <p>The requested book or chapter could not be found in the Bible data set.</p>
        <div className="reader-nav">
          <a href="/">Return home</a>
        </div>
      </div>
    </section>
  )
}
