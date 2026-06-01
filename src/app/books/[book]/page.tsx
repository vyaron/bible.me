import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import {
  getBibleBook,
  getBibleStaticParams,
  getBookUrl,
  getChapterUrl,
  getChapterNavigation
} from '@/lib/bible'
import { siteName } from '@/lib/site'

type BookPageProps = {
  params: Promise<{
    book: string
  }>
}

export async function generateStaticParams() {
  return getBibleStaticParams()
}

export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  const { book: bookParam } = await params
  const book = await getBibleBook(bookParam)

  if (!book) {
    return {
      title: 'Book not found'
    }
  }

  const chapterCount = book.chapters.length

  return {
    title: book.name,
    description: `Read ${book.name}, which contains ${chapterCount} chapters and ${book.stats.verses.toLocaleString()} verses.`,
    alternates: {
      canonical: getBookUrl(book.slug)
    },
    openGraph: {
      title: `${book.name} | ${siteName}`,
      description: `Read ${book.name}, which contains ${chapterCount} chapters and ${book.stats.verses.toLocaleString()} verses.`,
      url: getBookUrl(book.slug),
      type: 'article'
    }
  }
}

export default async function BookPage({ params }: BookPageProps) {
  const { book: bookParam } = await params
  const book = await getBibleBook(bookParam)

  if (!book) {
    notFound()
  }

  const chapterNavigation = getChapterNavigation(book, 1)

  return (
    <section className="panel reader">
      <div className="reader-top">
        <span className="badge">{book.testament === 'OT' ? 'Old Testament' : 'New Testament'}</span>
        <div>
          <h1>{book.name}</h1>
          <p className="reader-meta">
            {book.chapters.length} chapters • {book.stats.verses.toLocaleString()} verses
          </p>
        </div>
        <div className="reader-nav" aria-label="Book navigation">
          <a href="/">Back to home</a>
          <a href={getChapterUrl(book.slug, 1)}>Start reading</a>
          {chapterNavigation.nextHref ? <a href={chapterNavigation.nextHref}>Chapter 2</a> : null}
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <div>
            <h2>Chapters</h2>
            <p>Open any chapter in a crawlable route.</p>
          </div>
        </div>
        <div className="chapter-grid">
          {book.chapters.map((chapter) => (
            <a key={chapter.number} className="chapter-pill" href={getChapterUrl(book.slug, chapter.number)}>
              Chapter {chapter.number}
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
