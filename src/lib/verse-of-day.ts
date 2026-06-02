import { getBibleChapter, getChapterUrl } from '@/lib/bible'

export type VerseOfDayEntry = {
  id: string
  referenceLabel: string
  bookSlug: string
  chapter: number
  verse: number
}

export type VerseOfDay = VerseOfDayEntry & {
  text: string
  href: string
}

const verseOfDayEntries: VerseOfDayEntry[] = [
  {
    id: 'votd-genesis-1-1',
    referenceLabel: 'Genesis 1:1',
    bookSlug: 'genesis',
    chapter: 1,
    verse: 1
  },
  {
    id: 'votd-proverbs-3-5',
    referenceLabel: 'Proverbs 3:5',
    bookSlug: 'proverbs',
    chapter: 3,
    verse: 5
  },
  {
    id: 'votd-isaiah-40-31',
    referenceLabel: 'Isaiah 40:31',
    bookSlug: 'isaiah',
    chapter: 40,
    verse: 31
  },
  {
    id: 'votd-psalms-23-1',
    referenceLabel: 'Psalms 23:1',
    bookSlug: 'psalms',
    chapter: 23,
    verse: 1
  },
  {
    id: 'votd-micah-6-8',
    referenceLabel: 'Micah 6:8',
    bookSlug: 'micah',
    chapter: 6,
    verse: 8
  },
  {
    id: 'votd-joshua-1-9',
    referenceLabel: 'Joshua 1:9',
    bookSlug: 'joshua',
    chapter: 1,
    verse: 9
  },
  {
    id: 'votd-deuteronomy-6-5',
    referenceLabel: 'Deuteronomy 6:5',
    bookSlug: 'deuteronomy',
    chapter: 6,
    verse: 5
  },
  {
    id: 'votd-isaiah-9-6',
    referenceLabel: 'Isaiah 9:6',
    bookSlug: 'isaiah',
    chapter: 9,
    verse: 6
  },
  {
    id: 'votd-jeremiah-29-11',
    referenceLabel: 'Jeremiah 29:11',
    bookSlug: 'jeremiah',
    chapter: 29,
    verse: 11
  },
  {
    id: 'votd-ecclesiastes-3-1',
    referenceLabel: 'Ecclesiastes 3:1',
    bookSlug: 'ecclesiastes',
    chapter: 3,
    verse: 1
  },
  {
    id: 'votd-john-3-16',
    referenceLabel: 'John 3:16',
    bookSlug: 'john',
    chapter: 3,
    verse: 16
  },
  {
    id: 'votd-romans-8-28',
    referenceLabel: 'Romans 8:28',
    bookSlug: 'romans',
    chapter: 8,
    verse: 28
  },
  {
    id: 'votd-philippians-4-13',
    referenceLabel: 'Philippians 4:13',
    bookSlug: 'philippians',
    chapter: 4,
    verse: 13
  },
  {
    id: 'votd-matthew-6-33',
    referenceLabel: 'Matthew 6:33',
    bookSlug: 'matthew',
    chapter: 6,
    verse: 33
  },
  {
    id: 'votd-galatians-5-22',
    referenceLabel: 'Galatians 5:22',
    bookSlug: 'galatians',
    chapter: 5,
    verse: 22
  },
  {
    id: 'votd-romans-12-2',
    referenceLabel: 'Romans 12:2',
    bookSlug: 'romans',
    chapter: 12,
    verse: 2
  },
  {
    id: 'votd-1-corinthians-13-4',
    referenceLabel: '1 Corinthians 13:4',
    bookSlug: '1-corinthians',
    chapter: 13,
    verse: 4
  },
  {
    id: 'votd-ephesians-2-8',
    referenceLabel: 'Ephesians 2:8',
    bookSlug: 'ephesians',
    chapter: 2,
    verse: 8
  },
  {
    id: 'votd-john-14-6',
    referenceLabel: 'John 14:6',
    bookSlug: 'john',
    chapter: 14,
    verse: 6
  },
  {
    id: 'votd-revelation-21-4',
    referenceLabel: 'Revelation 21:4',
    bookSlug: 'revelation',
    chapter: 21,
    verse: 4
  }
]

function getUtcDayOfYear(date: Date) {
  const year = date.getUTCFullYear()
  const month = date.getUTCMonth()
  const day = date.getUTCDate()
  const todayUtc = Date.UTC(year, month, day)
  const firstDayUtc = Date.UTC(year, 0, 1)

  return Math.floor((todayUtc - firstDayUtc) / 86400000) + 1
}

function getDailyEntry(date: Date) {
  const dayOfYear = getUtcDayOfYear(date)
  const index = (dayOfYear - 1) % verseOfDayEntries.length

  return {
    entry: verseOfDayEntries[index],
    index
  }
}

export function getVerseDeepLink(entry: VerseOfDayEntry) {
  return `${getChapterUrl(entry.bookSlug, entry.chapter)}#verse-${entry.verse}`
}

async function resolveVerseEntry(entry: VerseOfDayEntry): Promise<VerseOfDay> {
  const chapterData = await getBibleChapter(entry.bookSlug, entry.chapter)

  if (!chapterData) {
    throw new Error(`Verse of the day route is invalid for ${entry.referenceLabel}`)
  }

  const verseData = chapterData.chapter.verses.find((item) => item.number === entry.verse)

  if (!verseData) {
    throw new Error(`Verse of the day verse is missing for ${entry.referenceLabel}`)
  }

  return {
    ...entry,
    text: verseData.text,
    href: getVerseDeepLink(entry)
  }
}

export async function getVerseOfDayList(): Promise<VerseOfDay[]> {
  return Promise.all(verseOfDayEntries.map(resolveVerseEntry))
}

export async function getVerseOfDay(date = new Date()): Promise<VerseOfDay> {
  const verses = await getVerseOfDayList()
  const { index } = getDailyEntry(date)

  return verses[index]
}

export function getVerseOfDayEntries() {
  return verseOfDayEntries.slice()
}