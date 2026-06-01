import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const appRoot = path.resolve(__dirname, '..')
const audioRoot = path.join(appRoot, 'data', 'en', 'audio')
const outputPath = path.join(audioRoot, 'index.json')
const sourceUrl = 'https://www.open.bible/bibles/english-hosanna-audio-nt'

const chapterFilePattern = /^([A-Z0-9]{3})_(\d{3})\.mp3$/i

const getBookDirectories = async () => {
  const entries = await fs.readdir(audioRoot, { withFileTypes: true })

  return entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name.toUpperCase())
    .sort((left, right) => left.localeCompare(right))
}

const buildBookIndex = async (bookCode) => {
  const bookDir = path.join(audioRoot, bookCode)
  const entries = await fs.readdir(bookDir, { withFileTypes: true })
  const files = {}

  for (const entry of entries) {
    if (!entry.isFile()) {
      continue
    }

    const match = entry.name.match(chapterFilePattern)

    if (!match) {
      continue
    }

    const fileCode = match[1].toUpperCase()

    if (fileCode !== bookCode) {
      throw new Error(`Unexpected book code in file ${entry.name}; expected ${bookCode}`)
    }

    const chapterNumber = Number.parseInt(match[2], 10)

    if (!Number.isInteger(chapterNumber) || chapterNumber < 1) {
      throw new Error(`Invalid chapter number in file ${entry.name}`)
    }

    const chapterKey = String(chapterNumber)

    if (files[chapterKey]) {
      throw new Error(`Duplicate chapter audio for ${bookCode} ${chapterNumber}`)
    }

    files[chapterKey] = `${bookCode}/${entry.name}`
  }

  const chapters = Object.keys(files)
    .map((value) => Number.parseInt(value, 10))
    .sort((left, right) => left - right)

  return {
    code: bookCode,
    chapterCount: chapters.length,
    chapters,
    files
  }
}

const run = async () => {
  const bookCodes = await getBookDirectories()
  const books = []

  for (const bookCode of bookCodes) {
    const bookIndex = await buildBookIndex(bookCode)

    if (bookIndex.chapterCount > 0) {
      books.push(bookIndex)
    }
  }

  const totalChapters = books.reduce((sum, book) => sum + book.chapterCount, 0)

  const manifest = {
    language: 'en',
    sourceUrl,
    generatedAt: new Date().toISOString(),
    bookCount: books.length,
    chapterCount: totalChapters,
    books
  }

  await fs.writeFile(outputPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8')

  console.log(`Generated audio index for ${books.length} books and ${totalChapters} chapters`)
  console.log(`Wrote ${path.relative(appRoot, outputPath)}`)
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
