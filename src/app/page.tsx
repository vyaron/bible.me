import type { Metadata } from 'next'

import { getBibleIndex, groupBooksByTestament, getBookUrl } from '@/lib/bible'
import { storyList } from '@/lib/story-data'
import { getVerseOfDayList } from '@/lib/verse-of-day'

import { VerseOfDayCard } from './verse-of-day-card'

export const metadata: Metadata = {
  title: 'Bible reading home',
  description: 'Browse every Bible book by testament and open any chapter in a clean reader.'
}

export default async function HomePage() {
  const bibleIndex = await getBibleIndex()
  const groupedBooks = groupBooksByTestament(bibleIndex.books)
  const versesOfDay = await getVerseOfDayList()

  return (
    <>
      <section className="hero home-hero">
        <h1>Rooted in Scripture. Alive in Every Story</h1>
      </section>

      <VerseOfDayCard verses={versesOfDay} />

      <section className="panel reader section home-stories-panel">
        <div className="section-header">
          <div>
            <h2>Greatest Stories Ever Told</h2>
            <p>Explore Bible great stories with summaries, visuals, and source links.</p>
          </div>
          <span className="badge">{storyList.length} stories</span>
        </div>
        <a className="home-panel-action" href="/story">
          Explore Bible Great Stories
        </a>
      </section>

      <section className="panel reader section home-tree-panel">
        <div className="section-header">
          <div>
            <h2>Bible Tree</h2>
            <p>Explore genealogy and jump to first-mention chapters.</p>
          </div>
        </div>
        <a className="home-panel-action" href="/tree">
          Open Bible Tree
        </a>
      </section>

      <section className="panel reader home-ot-panel">
        <div className="section-header">
          <div>
            <h2>Old Testament</h2>
            <p>Genesis through Malachi.</p>
          </div>
          <span className="badge">{groupedBooks.OT.length} books</span>
        </div>
        <div className="book-grid">
          {groupedBooks.OT.map((book) => (
            <a key={book.id} className="book-card" href={getBookUrl(book.slug)}>
              <strong>{book.name}</strong>
              <small>{book.chapters} chapters</small>
              <div className="details">
                <span>{book.verses.toLocaleString()} verses</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="panel reader section home-nt-panel">
        <div className="section-header">
          <div>
            <h2>New Testament</h2>
            <p>Matthew through Revelation.</p>
          </div>
          <span className="badge">{groupedBooks.NT.length} books</span>
        </div>
        <div className="book-grid">
          {groupedBooks.NT.map((book) => (
            <a key={book.id} className="book-card" href={getBookUrl(book.slug)}>
              <strong>{book.name}</strong>
              <small>{book.chapters} chapters</small>
              <div className="details">
                <span>{book.verses.toLocaleString()} verses</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      <footer className="panel reader section home-footer" aria-label="Bible content summary">
        <p className="home-footer-copy">
          Explore the Bible Your Way — Listen, Learn, and Discover.
        </p>
        <div className="stats home-footer-stats">
          <div className="stat">
            <strong>{bibleIndex.bookCount}</strong>
            <span>Books</span>
          </div>
          <div className="stat">
            <strong>{bibleIndex.stats.chapters.toLocaleString()}</strong>
            <span>Chapters</span>
          </div>
          <div className="stat">
            <strong>{bibleIndex.stats.verses.toLocaleString()}</strong>
            <span>Verses</span>
          </div>
        </div>
      </footer>
    </>
  )
}
