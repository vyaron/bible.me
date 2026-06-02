import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import {
  getBibleBook,
  getBibleStaticParams,
  getBookUrl,
  getChapterUrl
} from '@/lib/bible'
import { siteName } from '@/lib/site'

function toHebrewNumeral(value: number) {
  const specialCases: Record<number, string> = {
    15: 'טו',
    16: 'טז'
  }

  if (specialCases[value]) {
    return specialCases[value]
  }

  const values = [
    [400, 'ת'],
    [300, 'ש'],
    [200, 'ר'],
    [100, 'ק'],
    [90, 'צ'],
    [80, 'פ'],
    [70, 'ע'],
    [60, 'ס'],
    [50, 'נ'],
    [40, 'מ'],
    [30, 'ל'],
    [20, 'כ'],
    [10, 'י'],
    [9, 'ט'],
    [8, 'ח'],
    [7, 'ז'],
    [6, 'ו'],
    [5, 'ה'],
    [4, 'ד'],
    [3, 'ג'],
    [2, 'ב'],
    [1, 'א']
  ] as const

  let remaining = value
  let result = ''

  for (const [numericValue, letter] of values) {
    while (remaining >= numericValue) {
      result += letter
      remaining -= numericValue
    }
  }

  return result
}

type BookPageProps = {
  params: Promise<{
    book: string
  }>
}

export const dynamicParams = false

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

  return (
    <section className="panel reader">
      <div className="reader-top">
        <div>
          <h1>{book.name}</h1>
          <p className="reader-meta">
            {book.chapters.length} chapters • {book.stats.verses.toLocaleString()} verses
          </p>
        </div>
      </div>

      <div className="section">
        <div className="section-header">
          <div>
            <h2>Chapters</h2>
          </div>
        </div>
        <div className="chapter-grid">
          {book.chapters.map((chapter) => (
            <a key={chapter.number} className="chapter-pill" href={getChapterUrl(book.slug, chapter.number)}>
              {chapter.number} | {toHebrewNumeral(chapter.number)}
            </a>
          ))}
        </div>
      </div>

      <figure className="book-footer-art">
        <img src={book.testament === 'OT' ? '/img/OT.png' : '/img/NT.png'} alt="" />
        <figcaption className="book-footer-art-label">{book.testament === 'OT' ? 'Old Testament' : 'New Testament'}</figcaption>
      </figure>
    </section>
  )
}
