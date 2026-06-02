import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import {
  getBibleChapter,
  getBibleChapterStaticParams,
  getBibleIndex,
  getChapterNavigation,
  getChapterUrl,
  getBookUrl
} from '@/lib/bible'
import { getEnglishChapterAudio, getHebrewChapterAudioFromManifest } from '@/lib/audio-manifest'
import { getHebrewChapter } from '@/lib/hebrew'
import { getSiteUrl, siteName } from '@/lib/site'

import { VerseDeepLinkHandler } from './verse-deep-link'

type ChapterPageProps = {
  params: Promise<{
    book: string
    chapter: string
  }>
}

export const dynamicParams = false

export async function generateStaticParams() {
  return getBibleChapterStaticParams()
}

export async function generateMetadata({ params }: ChapterPageProps): Promise<Metadata> {
  const { book: bookParam, chapter: chapterParam } = await params
  const chapterNumber = Number.parseInt(chapterParam, 10)
  const chapterData = await getBibleChapter(bookParam, chapterNumber)

  if (!chapterData) {
    return {
      title: 'Chapter not found'
    }
  }

  const { book, chapter } = chapterData

  return {
    title: `${book.name} ${chapter.number}`,
    description: `Read ${book.name} ${chapter.number} with ${chapter.verses.length} verses in a clean, SEO-friendly layout.`,
    alternates: {
      canonical: getChapterUrl(book.slug, chapter.number)
    },
    openGraph: {
      title: `${book.name} ${chapter.number} | ${siteName}`,
      description: `Read ${book.name} ${chapter.number} with ${chapter.verses.length} verses in a clean, SEO-friendly layout.`,
      url: getChapterUrl(book.slug, chapter.number),
      type: 'article'
    }
  }
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { book: bookParam, chapter: chapterParam } = await params
  const chapterNumber = Number.parseInt(chapterParam, 10)

  if (!Number.isInteger(chapterNumber) || chapterNumber < 1) {
    notFound()
  }

  const chapterData = await getBibleChapter(bookParam, chapterNumber)

  if (!chapterData) {
    notFound()
  }

  const { book, chapter } = chapterData
  const navigation = getChapterNavigation(book, chapter.number)
  const siteUrl = getSiteUrl()
  const allBooks = await getBibleIndex()
  const bookIndex = allBooks.books.find((item) => item.slug === book.slug)
  const chapterAudio = getEnglishChapterAudio(book.code, chapter.number)
  const hebrewChapterAudio = getHebrewChapterAudioFromManifest(book.code, chapter.number)
  const hebrewChapterData = await getHebrewChapter(book.code, chapter.number)
  const hebrewVerseMap = new Map(hebrewChapterData?.chapter.verses.map((verse) => [verse.number, verse]))

  return (
    <section className="panel reader">
      <VerseDeepLinkHandler />
      <div className="reader-top">
        <div className="reader-meta">
          <a href="/">Home</a> <span aria-hidden="true">/</span> <a href={getBookUrl(book.slug)}>{book.name}</a>
        </div>
        <div>
          <span className="badge">{book.testament === 'OT' ? 'Old Testament' : 'New Testament'}</span>
          <h1>
            {book.name} {chapter.number}
          </h1>
          <p>{chapter.verses.length} verses, set up for focused reading and sharing.</p>
        </div>
        <div className="reader-nav" aria-label="Chapter navigation">
          {navigation.previousHref ? <a href={navigation.previousHref}>Previous chapter</a> : <span>Start of book</span>}
          <a href={getBookUrl(book.slug)}>Chapter list</a>
          <a href="#original-hebrew-verse">Original Hebrew Verse</a>
          {navigation.nextHref ? <a href={navigation.nextHref}>Next chapter</a> : <span>End of book</span>}
        </div>
      </div>

      <article className="section">
        <div className="audio-block" aria-label="Chapter audio">
          <h2>
            Listen to this chapter <span className="language-badge">EN</span>
          </h2>
          {chapterAudio ? (
            <>
              <audio controls preload="none" className="audio-player" src={chapterAudio.streamUrl}>
                <p>Your browser does not support audio playback.</p>
              </audio>
              <p className="audio-note">
                Source: <a href={chapterAudio.sourceUrl}>English Hosanna Audio New Testament</a>
              </p>
            </>
          ) : (
            <p className="audio-note">Audio unavailable for this chapter.</p>
          )}
        </div>

        {hebrewChapterAudio ? (
          <div className="audio-block" aria-label="Original hebrew audio">
            <h2>
              Original hebrew audio <span className="language-badge">HE</span>
            </h2>
            <audio controls preload="none" className="audio-player" src={hebrewChapterAudio.streamUrl}>
              <p>Your browser does not support audio playback.</p>
            </audio>
          </div>
        ) : null}

        <div className="verse-list" aria-label={`${book.name} chapter ${chapter.number}`}>
          {chapter.verses.map((verse) => (
            <div key={verse.number} className="verse" id={`verse-${verse.number}`}>
              <a className="verse-number verse-number-link" href={`#verse-${verse.number}`}>
                {verse.number}
              </a>
              <div className="verse-body">
                <div className="verse-text">{verse.text}</div>
                {hebrewVerseMap.has(verse.number) ? (
                  <details className="hebrew-inline-toggle">
                    <summary
                      className="hebrew-inline-trigger"
                      aria-label={`Toggle Hebrew verse ${verse.number}`}
                      title="Original Hebrew Verse"
                    >
                      <span aria-hidden="true">{hebrewVerseMap.get(verse.number)?.numeral}</span>
                    </summary>
                    <div className="hebrew-inline-content" lang="he" dir="rtl">
                      {hebrewVerseMap.get(verse.number)?.text}
                    </div>
                  </details>
                ) : null}
              </div>
            </div>
          ))}
        </div>

      </article>

      <p className="footer-note">
        Canonical route: <a href={`${siteUrl}${getChapterUrl(book.slug, chapter.number)}`}>{siteUrl}{getChapterUrl(book.slug, chapter.number)}</a>
        {bookIndex ? ` • ${bookIndex.name}` : ''}
      </p>

      <div id="original-hebrew-verse" className="hebrew-inline-help">
        {hebrewChapterData ? (
          <div className="hebrew-block">
            <h2>Original Hebrew Chapter</h2>
            <p className="hebrew-note" dir="rtl" lang="he">
              {hebrewChapterData.book.hebrewName} פרק {hebrewChapterData.chapter.numeral}
            </p>
            <div className="hebrew-verse-list" dir="rtl" lang="he">
              {hebrewChapterData.chapter.verses.map((verse) => (
                <div key={verse.number} className="hebrew-verse-row">
                  <span className="hebrew-verse-number">{verse.numeral}</span>
                  <span className="hebrew-verse-text">{verse.text}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="hebrew-note">Hebrew not available for this book and chapter yet.</p>
        )}
      </div>
    </section>
  )
}
