import { readFile } from 'node:fs/promises'
import path from 'node:path'

export type HebrewVerse = {
  number: number
  numeral: string
  text: string
}

export type HebrewChapter = {
  number: number
  numeral: string
  verses: HebrewVerse[]
}

export type HebrewBook = {
  id: string
  code: string
  slug: string
  name: string
  hebrewName: string
  language: string
  source: {
    file: string
    format: string
    sourceUrl: string
  }
  stats: {
    chapters: number
    verses: number
  }
  chapters: HebrewChapter[]
}

export type HebrewIndexBook = {
  id: string
  code: string
  slug: string
  name: string
  hebrewName: string
  testament: 'OT' | 'NT'
  testamentOrder: number
  order: number
  chapters: number
  verses: number
  path: string
}

export type HebrewIndex = {
  id: string
  name: string
  language: string
  sourceFormat: string
  sourceUrl: string
  generatedAt: string
  bookCount: number
  stats: {
    chapters: number
    verses: number
  }
  books: HebrewIndexBook[]
}

export type HebrewChapterResult = {
  book: HebrewBook
  chapter: HebrewChapter
}

const emptyIndex: HebrewIndex = {
  id: 'torah-teamim-hebrew',
  name: 'Torah Teamim Hebrew',
  language: 'he',
  sourceFormat: 'json',
  sourceUrl: '',
  generatedAt: '',
  bookCount: 0,
  stats: {
    chapters: 0,
    verses: 0
  },
  books: []
}

const hebrewRoot = path.join(process.cwd(), 'data', 'he', 'bible-txt')
const hebrewIndexPath = path.join(hebrewRoot, 'index.json')
let hebrewIndexPromise: Promise<HebrewIndex> | undefined
const hebrewBookCache = new Map<string, Promise<HebrewBook>>()

const normalizeValue = (value: string) => value.trim().toLowerCase()

function loadJsonFile<T>(filePath: string) {
  return readFile(filePath, 'utf8').then((content) => JSON.parse(content) as T)
}

async function loadHebrewIndex() {
  if (!hebrewIndexPromise) {
    hebrewIndexPromise = loadJsonFile<HebrewIndex>(hebrewIndexPath).catch((error: NodeJS.ErrnoException) => {
      if (error?.code === 'ENOENT') {
        return emptyIndex
      }

      throw error
    })
  }

  return hebrewIndexPromise
}

async function findBook(bookCodeOrSlug: string) {
  const normalized = normalizeValue(bookCodeOrSlug)
  const index = await loadHebrewIndex()

  return index.books.find((book) => {
    return [book.code, book.slug, book.id].some((value) => normalizeValue(value) === normalized)
  })
}

async function loadHebrewBook(book: HebrewIndexBook) {
  if (!hebrewBookCache.has(book.id)) {
    hebrewBookCache.set(book.id, loadJsonFile<HebrewBook>(path.join(hebrewRoot, book.path)))
  }

  return hebrewBookCache.get(book.id) as Promise<HebrewBook>
}

export async function getHebrewChapter(bookCodeOrSlug: string, chapterNumber: number): Promise<HebrewChapterResult | undefined> {
  const bookEntry = await findBook(bookCodeOrSlug)

  if (!bookEntry) {
    return undefined
  }

  const book = await loadHebrewBook(bookEntry)
  const chapter = book.chapters.find((item) => item.number === chapterNumber)

  if (!chapter) {
    return undefined
  }

  return {
    book,
    chapter
  }
}

export async function getHebrewVerse(bookCodeOrSlug: string, chapterNumber: number, verseNumber: number) {
  const chapterResult = await getHebrewChapter(bookCodeOrSlug, chapterNumber)

  if (!chapterResult) {
    return undefined
  }

  return chapterResult.chapter.verses.find((verse) => verse.number === verseNumber)
}

export async function hasHebrewBook(bookCodeOrSlug: string) {
  const bookEntry = await findBook(bookCodeOrSlug)

  return Boolean(bookEntry)
}

export async function getHebrewIndex() {
  return loadHebrewIndex()
}
