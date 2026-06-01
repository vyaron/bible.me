import { readFile } from 'node:fs/promises'
import path from 'node:path'

export type HebrewAudioBookIndex = {
  code: string
  chapterCount: number
  chapters: number[]
  files: Record<string, string>
}

export type HebrewAudioIndex = {
  language: string
  sourceUrl: string
  generatedAt: string
  bookCount: number
  chapterCount: number
  books: HebrewAudioBookIndex[]
}

export type HebrewChapterAudio = {
  code: string
  chapter: number
  relativePath: string
  streamUrl: string
  sourceUrl?: string
}

const emptyHebrewAudioIndex: HebrewAudioIndex = {
  language: 'he',
  sourceUrl: '',
  generatedAt: '',
  bookCount: 0,
  chapterCount: 0,
  books: []
}

const hebrewAudioRoot = path.join(process.cwd(), 'data', 'he', 'audio')
const hebrewAudioIndexPath = path.join(hebrewAudioRoot, 'index.json')
let hebrewAudioIndexPromise: Promise<HebrewAudioIndex> | undefined

const normalizeBookCode = (value: string) => value.trim().toUpperCase()

async function loadHebrewAudioIndex() {
  if (!hebrewAudioIndexPromise) {
    hebrewAudioIndexPromise = readFile(hebrewAudioIndexPath, 'utf8')
      .then((content) => JSON.parse(content) as HebrewAudioIndex)
      .catch((error: NodeJS.ErrnoException) => {
        if (error?.code === 'ENOENT') {
          return emptyHebrewAudioIndex
        }

        throw error
      })
  }

  return hebrewAudioIndexPromise
}

export function getHebrewAudioRootPath() {
  return hebrewAudioRoot
}

export async function getHebrewAudioIndex() {
  return loadHebrewAudioIndex()
}

export async function getHebrewChapterAudio(bookCode: string, chapter: number): Promise<HebrewChapterAudio | undefined> {
  const normalizedCode = normalizeBookCode(bookCode)
  const index = await loadHebrewAudioIndex()
  const bookAudio = index.books.find((book) => book.code === normalizedCode)

  if (!bookAudio) {
    return undefined
  }

  const chapterKey = String(chapter)
  const relativePath = bookAudio.files[chapterKey]

  if (!relativePath) {
    return undefined
  }

  return {
    code: normalizedCode,
    chapter,
    relativePath,
    streamUrl: `/api/audio/he/${normalizedCode}/${chapter}`,
    sourceUrl: index.sourceUrl || undefined
  }
}
