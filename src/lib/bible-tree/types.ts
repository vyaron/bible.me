export type BibleTreePerson = {
  id: string
  name: string
  nameHe: string | null
  yearBorn: number | null
  yearDied: number | null
  spouseIds: string[]
  parentIds: string[]
  childrenIds: string[]
  level: number | null
}

export type FirstMention = {
  bookCode: string
  bookSlug: string
  bookName: string
  chapter: number
  verse: number
  reason: string
}

export type BibleTreePersonWithMention = BibleTreePerson & {
  firstMention?: FirstMention
}

export type BibleTreePersonsPayload = {
  sourceRepo: string
  sourceFile: string
  generatedAt: string
  personCount: number
  persons: BibleTreePerson[]
}

export type BibleTreeMentionsPayload = {
  generatedAt: string
  source: {
    personsPath: string
    bibleIndexPath: string
  }
  personCount: number
  matchedCount: number
  unmatchedCount: number
  mentions: Record<string, FirstMention | null>
}

export type BibleTreeNodeGroup = {
  id: string
  type: 'single' | 'couple'
  personIds: string[]
}
