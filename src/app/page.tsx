import type { Metadata } from 'next'

import { getBibleIndex, groupBooksByTestament, getBookUrl } from '@/lib/bible'
import { siteName } from '@/lib/site'
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
        <p className="hero-kicker">{siteName}</p>
        <h1>Read the Bible with a simple path to every chapter.</h1>
        <p>
          Browse the whole canon by book, jump directly to a chapter, and keep your place with routes
          that are easy to share and easy to index.
        </p>
        <div className="stats" aria-label="Bible content summary">
          <div className="stat">
            <strong>{bibleIndex.bookCount}</strong>
            <span>Books</span>
          </div>
          <div className="stat">
            <strong>{bibleIndex.stats.chapters}</strong>
            <span>Chapters</span>
          </div>
          <div className="stat">
            <strong>{bibleIndex.stats.verses.toLocaleString()}</strong>
            <span>Verses</span>
          </div>
        </div>
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
          <span className="badge">new</span>
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
                <span>{book.code}</span>
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
                <span>{book.code}</span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </>
  )
}
