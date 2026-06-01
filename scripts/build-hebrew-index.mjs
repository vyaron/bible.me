import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const appRoot = path.resolve(__dirname, '..')
const sourcePath = path.join(appRoot, 'data', 'he', 'bible-txt', 'torahTeamimDB.json')
const outputRoot = path.join(appRoot, 'data', 'he', 'bible-txt')
const booksOutputDir = path.join(outputRoot, 'books')
const indexOutputPath = path.join(outputRoot, 'index.json')

const SOURCE_URL = 'https://www.mechon-mamre.org/p/pt/pt0.htm'

const BOOK_MAPPINGS = [
  { hebrewName: 'בראשית', code: 'GEN', id: 'OT-01-GEN', slug: 'genesis', name: 'Genesis', order: 1, testament: 'OT', testamentOrder: 1 },
  { hebrewName: 'שמות', code: 'EXO', id: 'OT-02-EXO', slug: 'exodus', name: 'Exodus', order: 2, testament: 'OT', testamentOrder: 2 },
  { hebrewName: 'ויקרא', code: 'LEV', id: 'OT-03-LEV', slug: 'leviticus', name: 'Leviticus', order: 3, testament: 'OT', testamentOrder: 3 },
  { hebrewName: 'במדבר', code: 'NUM', id: 'OT-04-NUM', slug: 'numbers', name: 'Numbers', order: 4, testament: 'OT', testamentOrder: 4 },
  { hebrewName: 'דברים', code: 'DEU', id: 'OT-05-DEU', slug: 'deuteronomy', name: 'Deuteronomy', order: 5, testament: 'OT', testamentOrder: 5 }
]

const GEMATRIA_VALUES = {
  א: 1,
  ב: 2,
  ג: 3,
  ד: 4,
  ה: 5,
  ו: 6,
  ז: 7,
  ח: 8,
  ט: 9,
  י: 10,
  כ: 20,
  ך: 20,
  ל: 30,
  מ: 40,
  ם: 40,
  נ: 50,
  ן: 50,
  ס: 60,
  ע: 70,
  פ: 80,
  ף: 80,
  צ: 90,
  ץ: 90,
  ק: 100,
  ר: 200,
  ש: 300,
  ת: 400
}

const cleanHebrewNumeral = (value) => {
  return value.replace(/[\u05F4\u05F3"'׳״\s]/g, '')
}

const parseHebrewNumeral = (value) => {
  const cleaned = cleanHebrewNumeral(value)

  if (!cleaned) {
    throw new Error(`Could not parse empty Hebrew numeral from value: ${value}`)
  }

  let result = 0

  for (const char of cleaned) {
    const numeralValue = GEMATRIA_VALUES[char]

    if (!numeralValue) {
      throw new Error(`Unsupported Hebrew numeral character: ${char} in ${value}`)
    }

    result += numeralValue
  }

  return result
}

const run = async () => {
  const raw = await fs.readFile(sourcePath, 'utf8')
  const sourceJson = JSON.parse(raw)

  await fs.mkdir(booksOutputDir, { recursive: true })

  const books = []
  let totalChapters = 0
  let totalVerses = 0

  for (const mapping of BOOK_MAPPINGS) {
    const sourceBook = sourceJson[mapping.hebrewName]

    if (!sourceBook || !Array.isArray(sourceBook.chapters)) {
      continue
    }

    const chapters = sourceBook.chapters.map((sourceChapter, chapterIndex) => {
      const chapterNumeral = String(sourceChapter.num || '').trim()
      const chapterNumber = chapterNumeral ? parseHebrewNumeral(chapterNumeral) : chapterIndex + 1
      const verses = Array.isArray(sourceChapter.verses) ? sourceChapter.verses : []
      const mappedVerses = []

      for (const sourceVerse of verses) {
        const verseNumeral = String(sourceVerse.num || '').trim()
        const verseText = String(sourceVerse.txt || '').trim()

        if (!verseNumeral) {
          const previousVerse = mappedVerses[mappedVerses.length - 1]

          if (previousVerse && verseText) {
            previousVerse.text = `${previousVerse.text} ${verseText}`.trim()
          }

          continue
        }

        mappedVerses.push({
          number: parseHebrewNumeral(verseNumeral),
          numeral: verseNumeral,
          text: verseText
        })
      }

      return {
        number: chapterNumber,
        numeral: chapterNumeral,
        verses: mappedVerses
      }
    })

    const verseCount = chapters.reduce((sum, chapter) => sum + chapter.verses.length, 0)
    const bookPath = `books/${mapping.id}.he.json`

    const outputBook = {
      id: mapping.id,
      code: mapping.code,
      slug: mapping.slug,
      name: mapping.name,
      hebrewName: mapping.hebrewName,
      testament: mapping.testament,
      testamentOrder: mapping.testamentOrder,
      order: mapping.order,
      language: 'he',
      source: {
        file: 'torahTeamimDB.json',
        format: 'json',
        sourceUrl: SOURCE_URL
      },
      stats: {
        chapters: chapters.length,
        verses: verseCount
      },
      chapters
    }

    await fs.writeFile(path.join(outputRoot, bookPath), `${JSON.stringify(outputBook, null, 2)}\n`, 'utf8')

    books.push({
      id: mapping.id,
      code: mapping.code,
      slug: mapping.slug,
      name: mapping.name,
      hebrewName: mapping.hebrewName,
      testament: mapping.testament,
      testamentOrder: mapping.testamentOrder,
      order: mapping.order,
      chapters: chapters.length,
      verses: verseCount,
      path: bookPath
    })

    totalChapters += chapters.length
    totalVerses += verseCount
  }

  const outputIndex = {
    id: 'torah-teamim-hebrew',
    name: 'Torah Teamim Hebrew',
    language: 'he',
    sourceFormat: 'json',
    generatedAt: new Date().toISOString(),
    sourceUrl: SOURCE_URL,
    bookCount: books.length,
    stats: {
      chapters: totalChapters,
      verses: totalVerses
    },
    books
  }

  await fs.writeFile(indexOutputPath, `${JSON.stringify(outputIndex, null, 2)}\n`, 'utf8')

  console.log(`Generated Hebrew index for ${books.length} books, ${totalChapters} chapters, ${totalVerses} verses`)
  console.log(`Wrote ${path.relative(appRoot, indexOutputPath)}`)
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
