import { promises as fs } from 'node:fs'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const appRoot = path.resolve(__dirname, '..')

const sourceUrl = 'https://raw.githubusercontent.com/vyaron/bible-tree/main/js/services/person.service.js'
const outputDir = path.join(appRoot, 'data', 'en', 'bible-tree')
const outputPath = path.join(outputDir, 'persons.json')

const personConstPattern = /const\s+(p\d+)\s*=\s*\{/g

function readBalancedObjectLiteral(source, objectStartIndex) {
  let cursor = objectStartIndex
  let depth = 0
  let quote = null
  let escaped = false

  while (cursor < source.length) {
    const char = source[cursor]

    if (quote) {
      if (escaped) {
        escaped = false
      } else if (char === '\\') {
        escaped = true
      } else if (char === quote) {
        quote = null
      }

      cursor += 1
      continue
    }

    if (char === '"' || char === '\'' || char === '`') {
      quote = char
      cursor += 1
      continue
    }

    if (char === '{') {
      depth += 1
    } else if (char === '}') {
      depth -= 1

      if (depth === 0) {
        return source.slice(objectStartIndex, cursor + 1)
      }
    }

    cursor += 1
  }

  throw new Error('Unterminated object literal while parsing bible-tree source data')
}

function parsePersonDefinitions(source) {
  const personByConstName = new Map()

  for (const match of source.matchAll(personConstPattern)) {
    const constName = match[1]
    const objectStart = source.indexOf('{', match.index)

    if (objectStart < 0) {
      continue
    }

    const objectLiteral = readBalancedObjectLiteral(source, objectStart)
    const person = vm.runInNewContext(`(${objectLiteral})`)

    if (!person?.id || typeof person.id !== 'string') {
      throw new Error(`Invalid person object for ${constName}`)
    }

    personByConstName.set(constName, {
      id: person.id,
      name: person.name,
      nameHe: person.nameHe ?? null,
      yearBorn: typeof person.yearBorn === 'number' || person.yearBorn === null ? person.yearBorn : null,
      yearDied: typeof person.yearDied === 'number' || person.yearDied === null ? person.yearDied : null,
      spouseIds: Array.isArray(person.spouseIds) ? person.spouseIds : [],
      parentIds: Array.isArray(person.parentIds) ? person.parentIds : [],
      childrenIds: Array.isArray(person.childrenIds) ? person.childrenIds : []
    })
  }

  const mapAnchor = 'const personById = {'
  const mapStart = source.indexOf(mapAnchor)

  if (mapStart < 0) {
    throw new Error('Unable to locate personById map in source')
  }

  const mapObjectStart = source.indexOf('{', mapStart)
  const mapObjectLiteral = readBalancedObjectLiteral(source, mapObjectStart)
  const orderedKeys = [...mapObjectLiteral.matchAll(/\b(p\d+)\b/g)].map((entry) => entry[1])

  const seen = new Set()
  const persons = []

  for (const key of orderedKeys) {
    if (seen.has(key)) {
      continue
    }

    const person = personByConstName.get(key)

    if (!person) {
      throw new Error(`Missing person definition for ${key} referenced in personById map`)
    }

    seen.add(key)

    const level = person.id === 'p10' ? 0 : Number.parseInt(person.id.slice(1, -2), 10)

    persons.push({
      ...person,
      level: Number.isInteger(level) ? level : null
    })
  }

  return persons
}

async function run() {
  const response = await fetch(sourceUrl)

  if (!response.ok) {
    throw new Error(`Failed to fetch bible-tree source: ${response.status} ${response.statusText}`)
  }

  const source = await response.text()
  const persons = parsePersonDefinitions(source)

  await fs.mkdir(outputDir, { recursive: true })

  const payload = {
    sourceRepo: 'https://github.com/vyaron/bible-tree',
    sourceFile: 'js/services/person.service.js',
    generatedAt: new Date().toISOString(),
    personCount: persons.length,
    persons
  }

  await fs.writeFile(outputPath, `${JSON.stringify(payload, null, 2)}\n`, 'utf8')

  console.log(`Imported ${persons.length} people from bible-tree`) 
  console.log(`Wrote ${path.relative(appRoot, outputPath)}`)
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : error)
  process.exit(1)
})
