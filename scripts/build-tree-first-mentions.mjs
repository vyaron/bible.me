import { promises as fs } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const appRoot = path.resolve(__dirname, '..')
const bibleRoot = path.join(appRoot, 'data', 'en', 'bible-txt')
const treeRoot = path.join(appRoot, 'data', 'en', 'bible-tree')

const personsPath = path.join(treeRoot, 'persons.json')
const bibleIndexPath = path.join(bibleRoot, 'index.json')
const outputPath = path.join(treeRoot, 'mentions.json')

const matcherOverrides = {
  p6299: {
    allOf: ['jacob', 'father of joseph']
  },
  p6300: {
    allOf: ['joseph', 'mary']
  },
  p6301: {
    anyOf: ['mary']
  },
  p6402: {
    anyOf: ['jesus']
  }
}

const aliasByPersonId = {
  p2026: ['abram', 'abraham'],
  p2029: ['sarai', 'sarah'],
  p3471: ['solomon'],
  p6300: ['joseph'],
  p6301: ['mary', 'virgin mary'],
  p6402: ['jesus', 'jesus christ']
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function normalize(value) {
  return value.toLowerCase()
}

function toWordMatcher(term) {
  return new RegExp(`\\b${escapeRegex(term)}\\b`, 'i')
}

function buildMatchers(person) {
  const aliases = new Set(aliasByPersonId[person.id] || [])

  if (person.name) {
    aliases.add(person.name)
  }

  if (person.name === 'Nahor II') {
    aliases.add('nahor')
  }

  const candidates = [...aliases]
    .map((item) => normalize(item))
    .map((item) => item.replace(/\s+ii$/i, '').trim())
    .filter((item) => item.length >= 3)

  const unique = [...new Set(candidates)]

  return unique.map((term) => ({
    term,
    regex: toWordMatcher(term)
  }))
}

function chapterText(chapter) {
  return chapter.verses.map((verse) => verse.text).join(' ').toLowerCase()
}

function matchesOverride(text, override) {
  if (!override) {
    return true
  }

  if (override.allOf && !override.allOf.every((term) => text.includes(term))) {
    return false
  }

  if (override.anyOf && !override.anyOf.some((term) => text.includes(term))) {
    return false
  }

  return true
}

async function readJson(filePath) {
  const content = await fs.readFile(filePath, 'utf8')
  return JSON.parse(content)
}

async function run() {
  const personsPayload = await readJson(personsPath)
  const bibleIndex = await readJson(bibleIndexPath)
  const books = bibleIndex.books.sort((left, right) => left.order - right.order)

  const mentions = {}

  for (const person of personsPayload.persons) {
    const patterns = buildMatchers(person)
    const override = matcherOverrides[person.id]
    let firstMatch = null

    if (patterns.length === 0) {
      mentions[person.id] = null
      continue
    }

    for (const book of books) {
      const bookPath = path.join(bibleRoot, book.path)
      const bookJson = await readJson(bookPath)

      for (const chapter of bookJson.chapters) {
        const chapterFullText = chapterText(chapter)

        if (!matchesOverride(chapterFullText, override)) {
          continue
        }

        const matchedVerse = chapter.verses.find((verse) => {
          const verseText = normalize(verse.text)

          return patterns.some((pattern) => pattern.regex.test(verseText))
        })

        if (!matchedVerse) {
          continue
        }

        const matchedPattern = patterns.find((pattern) => pattern.regex.test(normalize(matchedVerse.text)))

        firstMatch = {
          bookCode: book.code,
          bookSlug: book.slug,
          bookName: book.name,
          chapter: chapter.number,
          verse: matchedVerse.number,
          reason: matchedPattern?.term || person.name
        }
        break
      }

      if (firstMatch) {
        break
      }
    }

    mentions[person.id] = firstMatch
  }

  const unmatched = Object.entries(mentions).filter((entry) => entry[1] === null).length

  const payload = {
    generatedAt: new Date().toISOString(),
    source: {
      personsPath: path.relative(appRoot, personsPath),
      bibleIndexPath: path.relative(appRoot, bibleIndexPath)
    },
    personCount: personsPayload.persons.length,
    matchedCount: personsPayload.persons.length - unmatched,
    unmatchedCount: unmatched,
    mentions
  }

  await fs.mkdir(treeRoot, { recursive: true })
  await fs.writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')

  console.log(`Generated first-mention index for ${payload.matchedCount}/${payload.personCount} people`) 
  console.log(`Wrote ${path.relative(appRoot, outputPath)}`)
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
