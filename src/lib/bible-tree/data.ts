import { readFile } from 'node:fs/promises'
import path from 'node:path'

import type {
  BibleTreeMentionsPayload,
  BibleTreeNodeGroup,
  BibleTreePersonWithMention,
  BibleTreePersonsPayload
} from '@/lib/bible-tree/types'

const treeDataRoot = path.join(process.cwd(), 'data', 'en', 'bible-tree')
const personsPath = path.join(treeDataRoot, 'persons.json')
const mentionsPath = path.join(treeDataRoot, 'mentions.json')

let personsPromise: Promise<BibleTreePersonsPayload> | undefined
let mentionsPromise: Promise<BibleTreeMentionsPayload> | undefined

function loadJsonFile<T>(filePath: string): Promise<T> {
  return readFile(filePath, 'utf8').then((content) => JSON.parse(content) as T)
}

async function getPersonsPayload() {
  if (!personsPromise) {
    personsPromise = loadJsonFile<BibleTreePersonsPayload>(personsPath)
  }

  return personsPromise
}

async function getMentionsPayload() {
  if (!mentionsPromise) {
    mentionsPromise = loadJsonFile<BibleTreeMentionsPayload>(mentionsPath)
  }

  return mentionsPromise
}

export async function getBibleTreeData() {
  const [personsPayload, mentionsPayload] = await Promise.all([getPersonsPayload(), getMentionsPayload()])

  const persons: BibleTreePersonWithMention[] = personsPayload.persons.map((person) => ({
    ...person,
    firstMention: mentionsPayload.mentions[person.id] ?? undefined
  }))

  return {
    generatedAt: mentionsPayload.generatedAt,
    personCount: personsPayload.personCount,
    matchedCount: mentionsPayload.matchedCount,
    persons
  }
}

export function groupBibleTreeNodesByLevel(persons: BibleTreePersonWithMention[]) {
  const byLevel = new Map<number, BibleTreePersonWithMention[]>()

  for (const person of persons) {
    const level = person.level ?? 0
    const items = byLevel.get(level) || []
    items.push(person)
    byLevel.set(level, items)
  }

  return [...byLevel.entries()]
    .sort((left, right) => left[0] - right[0])
    .map(([level, items]) => ({
      level,
      persons: items
    }))
}

export function buildBibleTreeNodeGroups(levelPeople: BibleTreePersonWithMention[]) {
  const byId = new Map(levelPeople.map((person) => [person.id, person]))
  const rendered = new Set<string>()
  const groups: BibleTreeNodeGroup[] = []

  for (const person of levelPeople) {
    if (rendered.has(person.id)) {
      continue
    }

    const spouseIdsAtLevel = (person.spouseIds || []).filter((spouseId) => byId.has(spouseId) && !rendered.has(spouseId))

    if (spouseIdsAtLevel.length > 0) {
      const ids = [person.id, ...spouseIdsAtLevel]
      ids.forEach((id) => rendered.add(id))

      groups.push({
        id: ids.join('__'),
        type: 'couple',
        personIds: ids
      })
      continue
    }

    rendered.add(person.id)
    groups.push({
      id: person.id,
      type: 'single',
      personIds: [person.id]
    })
  }

  return groups
}

export function getBibleTreeMentionHref(person: BibleTreePersonWithMention) {
  if (!person.firstMention) {
    return undefined
  }

  return `/books/${person.firstMention.bookSlug}/${person.firstMention.chapter}#verse-${person.firstMention.verse}`
}
