'use client'

import { useMemo, useState } from 'react'

import type { VerseOfDay } from '@/lib/verse-of-day'

type VerseOfDayCardProps = {
  verses: VerseOfDay[]
}

function getUtcDayIndex(length: number) {
  const now = new Date()
  const year = now.getUTCFullYear()
  const month = now.getUTCMonth()
  const day = now.getUTCDate()
  const todayUtc = Date.UTC(year, month, day)
  const firstDayUtc = Date.UTC(year, 0, 1)
  const dayOfYear = Math.floor((todayUtc - firstDayUtc) / 86400000) + 1

  return (dayOfYear - 1) % length
}

export function VerseOfDayCard({ verses }: VerseOfDayCardProps) {
  const startIndex = useMemo(() => getUtcDayIndex(verses.length), [verses.length])
  const [currentIndex, setCurrentIndex] = useState(startIndex)
  const verse = verses[currentIndex]

  const onNextVerse = () => {
    setCurrentIndex((current) => (current + 1) % verses.length)
  }

  return (
    <section className="panel reader section verse-of-day" aria-labelledby="verse-of-day-title">
      <div className="section-header">
        <div>
          <h2 id="verse-of-day-title">Verse of the Day</h2>
          <p>One curated verse selected daily using UTC rotation.</p>
        </div>
        <span className="badge">{verse.referenceLabel}</span>
      </div>
      <blockquote className="verse-of-day-quote">
        <p>{verse.text}</p>
      </blockquote>
      <div className="verse-of-day-footer">
        <span className="muted">Jump directly to the verse anchor in the chapter view.</span>
        <div className="verse-of-day-actions">
          <button type="button" className="verse-of-day-button" onClick={onNextVerse}>
            Another verse
          </button>
          <a className="verse-of-day-link" href={verse.href}>
            Open verse
          </a>
        </div>
      </div>
    </section>
  )
}
