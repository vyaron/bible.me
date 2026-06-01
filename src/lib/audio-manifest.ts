import enAudioIndex from '../../data/en/audio/index.json'
import heAudioIndex from '../../data/he/audio/index.json'

type AudioBookIndex = {
  code: string
  chapterCount: number
  chapters: number[]
  files: Record<string, string>
}

type AudioIndex = {
  language: string
  sourceUrl?: string
  generatedAt: string
  bookCount: number
  chapterCount: number
  books: AudioBookIndex[]
}

type ChapterAudio = {
  code: string
  chapter: number
  streamUrl: string
  sourceUrl?: string
}

const englishAudioIndex = enAudioIndex as AudioIndex
const hebrewAudioIndex = heAudioIndex as AudioIndex

const normalizeBookCode = (value: string) => value.trim().toUpperCase()

function getChapterAudio(index: AudioIndex, bookCode: string, chapterNumber: number, streamPrefix: string): ChapterAudio | undefined {
  const normalizedBookCode = normalizeBookCode(bookCode)
  const bookAudio = index.books.find((book) => book.code === normalizedBookCode)

  if (!bookAudio) {
    return undefined
  }

  const chapterKey = String(chapterNumber)

  if (!bookAudio.files[chapterKey]) {
    return undefined
  }

  return {
    code: normalizedBookCode,
    chapter: chapterNumber,
    streamUrl: `${streamPrefix}/${normalizedBookCode}/${chapterNumber}`,
    sourceUrl: index.sourceUrl || undefined
  }
}

export function getEnglishChapterAudio(bookCode: string, chapterNumber: number) {
  return getChapterAudio(englishAudioIndex, bookCode, chapterNumber, '/api/audio')
}

export function getHebrewChapterAudioFromManifest(bookCode: string, chapterNumber: number) {
  return getChapterAudio(hebrewAudioIndex, bookCode, chapterNumber, '/api/audio/he')
}
