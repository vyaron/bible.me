import { readFile } from 'node:fs/promises'
import path from 'node:path'

export type AudioBookIndex = {
  code: string
  chapterCount: number
  chapters: number[]
  files: Record<string, string>
}

export type AudioIndex = {
  language: string
  sourceUrl: string
  generatedAt: string
  bookCount: number
  chapterCount: number
  books: AudioBookIndex[]
}

export type ChapterAudio = {
  code: string
  chapter: number
  relativePath: string
  streamUrl: string
  sourceUrl: string
}

const emptyAudioIndex: AudioIndex = {
  language: 'en',
  sourceUrl: 'https://www.open.bible/bibles/english-hosanna-audio-nt',
  generatedAt: '',
  bookCount: 0,
  chapterCount: 0,
  books: []
}

const audioRoot = path.join(process.cwd(), 'data', 'en', 'audio')
const audioIndexPath = path.join(audioRoot, 'index.json')
let audioIndexPromise: Promise<AudioIndex> | undefined

const normalizeBookCode = (value: string) => value.trim().toUpperCase()

async function loadAudioIndex() {
  if (!audioIndexPromise) {
    audioIndexPromise = readFile(audioIndexPath, 'utf8')
      .then((content) => JSON.parse(content) as AudioIndex)
      .catch((error: NodeJS.ErrnoException) => {
        if (error?.code === 'ENOENT') {
          return emptyAudioIndex
        }

        throw error
      })
  }

  return audioIndexPromise
}

export function getAudioRootPath() {
  return audioRoot
}

export async function getAudioIndex() {
  return loadAudioIndex()
}

export async function hasBookAudio(bookCode: string) {
  const normalizedCode = normalizeBookCode(bookCode)
  const audioIndex = await loadAudioIndex()

  return audioIndex.books.some((book) => book.code === normalizedCode)
}

export async function getChapterAudio(bookCode: string, chapter: number): Promise<ChapterAudio | undefined> {
  const normalizedCode = normalizeBookCode(bookCode)
  const audioIndex = await loadAudioIndex()
  const bookAudio = audioIndex.books.find((book) => book.code === normalizedCode)

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
    streamUrl: `/api/audio/${normalizedCode}/${chapter}`,
    sourceUrl: audioIndex.sourceUrl || emptyAudioIndex.sourceUrl
  }
}
