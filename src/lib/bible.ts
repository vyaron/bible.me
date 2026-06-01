import { readFile } from 'node:fs/promises'
import path from 'node:path'

export type Testament = 'OT' | 'NT'

export type BibleIndexBook = {
  id: string
  code: string
  name: string
  slug: string
  testament: Testament
  testamentOrder: number
  order: number
  chapters: number
  verses: number
  path: string
}

export type BibleIndex = {
  id: string
  name: string
  language: string
  sourceFormat: string
  generatedAt: string
  bookCount: number
  stats: {
    chapters: number
    verses: number
  }
  books: BibleIndexBook[]
}

export type BibleVerse = {
  number: number
  text: string
}

export type BibleChapter = {
  number: number
  verses: BibleVerse[]
}

export type BibleBook = BibleIndexBook & {
  source: {
    file: string
    format: string
  }
  stats: {
    chapters: number
    verses: number
  }
  chapters: BibleChapter[]
}

const bibleDataRoot = path.join(process.cwd(), 'data', 'en', 'bible-txt')
const bibleIndexPath = path.join(bibleDataRoot, 'index.json')
let bibleIndexPromise: Promise<BibleIndex> | undefined
let bibleBookCache = new Map<string, Promise<BibleBook>>()

function loadJsonFile<T>(filePath: string): Promise<T> {
  return readFile(filePath, 'utf8').then((content) => JSON.parse(content) as T)
}

function assertBookIndex(value: BibleIndexBook): BibleIndexBook {
  const requiredStrings = [value.id, value.code, value.name, value.slug, value.testament, value.path]

  if (requiredStrings.some((item) => typeof item !== 'string' || item.length === 0)) {
    throw new Error(`Invalid Bible book index entry in ${bibleIndexPath}`)
  }

  if (!Number.isInteger(value.order) || !Number.isInteger(value.chapters) || !Number.isInteger(value.verses)) {
    throw new Error(`Invalid numeric fields in Bible book index entry for ${value.id}`)
  }

  return value
}

export async function getBibleIndex() {
  if (!bibleIndexPromise) {
    bibleIndexPromise = loadJsonFile<BibleIndex>(bibleIndexPath).then((index) => {
      if (!Array.isArray(index.books)) {
        throw new Error(`Bible index is missing a books array at ${bibleIndexPath}`)
      }

      return {
        ...index,
        books: index.books.map(assertBookIndex).sort((left, right) => left.order - right.order)
      }
    })
  }

  return bibleIndexPromise
}

export async function getBibleBooks() {
  const index = await getBibleIndex()

  return index.books
}

export async function findBibleBook(bookParam: string) {
  const normalized = bookParam.trim().toLowerCase()
  const books = await getBibleBooks()

  return books.find((book) => {
    return [book.id, book.code, book.slug].some((value) => value.toLowerCase() === normalized)
  })
}

async function loadBibleBook(book: BibleIndexBook) {
  if (!bibleBookCache.has(book.id)) {
    bibleBookCache.set(
      book.id,
      loadJsonFile<BibleBook>(path.join(bibleDataRoot, book.path)).then((bookJson) => {
        if (!Array.isArray(bookJson.chapters)) {
          throw new Error(`Bible book ${book.id} is missing chapters in ${book.path}`)
        }

        return bookJson
      })
    )
  }

  return bibleBookCache.get(book.id) as Promise<BibleBook>
}

export async function getBibleBook(bookParam: string) {
  const bookIndex = await findBibleBook(bookParam)

  if (!bookIndex) {
    return undefined
  }

  return loadBibleBook(bookIndex)
}

export async function getBibleChapter(bookParam: string, chapterNumber: number) {
  const book = await getBibleBook(bookParam)

  if (!book) {
    return undefined
  }

  const chapter = book.chapters.find((item) => item.number === chapterNumber)

  if (!chapter) {
    return undefined
  }

  return {
    book,
    chapter
  }
}

export function getBookUrl(slug: string) {
  return `/books/${slug}`
}

export function getChapterUrl(slug: string, chapterNumber: number) {
  return `/books/${slug}/${chapterNumber}`
}

export function groupBooksByTestament(books: BibleIndexBook[]) {
  return books.reduce<Record<Testament, BibleIndexBook[]>>(
    (groups, book) => {
      groups[book.testament].push(book)
      return groups
    },
    {
      OT: [],
      NT: []
    }
  )
}

export function getChapterNavigation(book: BibleBook, chapterNumber: number) {
  const previousChapter = chapterNumber > 1 ? chapterNumber - 1 : undefined
  const nextChapter = chapterNumber < book.chapters.length ? chapterNumber + 1 : undefined

  return {
    previousChapter,
    nextChapter,
    previousHref: previousChapter ? getChapterUrl(book.slug, previousChapter) : undefined,
    nextHref: nextChapter ? getChapterUrl(book.slug, nextChapter) : undefined
  }
}

export async function getBibleStaticParams() {
  const books = await getBibleBooks()

  return books.map((book) => ({
    book: book.slug
  }))
}

export async function getBibleChapterStaticParams() {
  const books = await getBibleBooks()
  const params: Array<{ book: string; chapter: string }> = []

  for (const book of books) {
    for (let chapter = 1; chapter <= book.chapters; chapter += 1) {
      params.push({
        book: book.slug,
        chapter: String(chapter)
      })
    }
  }

  return params
}
