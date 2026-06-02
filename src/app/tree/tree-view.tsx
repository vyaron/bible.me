'use client'

import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'

import type { BibleTreePersonWithMention } from '@/lib/bible-tree/types'
import { FavoriteButton } from '@/app/components/favorite-button'

type BibleTreeViewProps = {
  persons: BibleTreePersonWithMention[]
}

type TreeGroup = {
  id: string
  type: 'single' | 'couple'
  personIds: string[]
}

type TreeLevel = {
  level: number
  groups: TreeGroup[]
}

type LineSegment = {
  key: string
  x1: number
  y1: number
  x2: number
  y2: number
}

type WikiData = {
  name: string
  description: string
  summary: string
  image: string | null
  url: string | null
}

const forcedTitlesByPersonId: Record<string, string> = {
  p6300: 'Saint Joseph',
  p6301: 'Mary, mother of Jesus',
  p6402: 'Jesus'
}

function getLevelFromId(person: BibleTreePersonWithMention) {
  if (typeof person.level === 'number') {
    return person.level
  }

  if (person.id === 'p10') {
    return 0
  }

  const parsed = Number.parseInt(person.id.slice(1, -2), 10)

  return Number.isInteger(parsed) ? parsed : 0
}

function getYearText(value: number | null) {
  if (value === null) {
    return '?'
  }

  if (value < 0) {
    return `${Math.abs(value)} BCE`
  }

  if (value > 0) {
    return `${value} CE`
  }

  return '0'
}

function getMotherColorClass(person: BibleTreePersonWithMention) {
  if (person.parentIds.includes('p2235') || person.id === 'p2235') return 'mother-leah'
  if (person.parentIds.includes('p2236') || person.id === 'p2236') return 'mother-rachel'
  if (person.parentIds.includes('p2237') || person.id === 'p2237') return 'mother-bilhah'
  if (person.parentIds.includes('p2238') || person.id === 'p2238') return 'mother-zilpah'
  if (person.parentIds.includes('p3367') || person.id === 'p3367') return 'mother-ahinoam'
  if (person.parentIds.includes('p3368') || person.id === 'p3368') return 'mother-abigail'
  if (person.parentIds.includes('p3369') || person.id === 'p3369') return 'mother-maacah'
  if (person.parentIds.includes('p3370') || person.id === 'p3370') return 'mother-haggith'
  if (person.parentIds.includes('p3372') || person.id === 'p3372') return 'mother-bathsheba'

  return ''
}

async function fetchWikiSummary(title: string) {
  const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`)

  if (!response.ok) {
    return null
  }

  const data = await response.json()

  if ((data.description || '').toLowerCase().includes('disambiguation')) {
    return null
  }

  return {
    name: data.title || title,
    description: data.description || 'Biblical figure',
    summary: data.extract || 'No summary available.',
    image: data.thumbnail?.source || data.originalimage?.source || null,
    url: data.content_urls?.desktop?.page || null
  } as WikiData
}

async function findWikiTitle(query: string) {
  const searchUrl =
    `https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&utf8=1&srlimit=5&srsearch=${encodeURIComponent(query)}`

  const response = await fetch(searchUrl)

  if (!response.ok) {
    return null
  }

  const data = await response.json()
  const result = (data?.query?.search || []).find((item: { title: string }) => !item.title.toLowerCase().includes('(disambiguation)'))

  return result?.title || null
}

async function getPersonWikiData(person: BibleTreePersonWithMention) {
  const candidates = [
    forcedTitlesByPersonId[person.id],
    `${person.name} (Bible)`,
    `${person.name} (biblical figure)`,
    person.name
  ].filter(Boolean) as string[]

  for (const candidate of candidates) {
    const summary = await fetchWikiSummary(candidate)

    if (summary) {
      return summary
    }

    const resolved = await findWikiTitle(candidate)

    if (!resolved) {
      continue
    }

    const resolvedSummary = await fetchWikiSummary(resolved)

    if (resolvedSummary) {
      return resolvedSummary
    }
  }

  return {
    name: person.name,
    description: 'Biblical figure',
    summary: `No reliable Wikipedia summary was found for ${person.name}.`,
    image: null,
    url: null
  } satisfies WikiData
}

export function BibleTreeView({ persons }: BibleTreeViewProps) {
  const searchParams = useSearchParams()
  const personFromQuery = searchParams.get('person')
  const [lines, setLines] = useState<LineSegment[]>([])
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null)
  const [wikiData, setWikiData] = useState<WikiData | null>(null)
  const [wikiLoading, setWikiLoading] = useState(false)

  const personById = useMemo(() => {
    return new Map(persons.map((person) => [person.id, person]))
  }, [persons])

  const levels = useMemo(() => {
    const grouped = new Map<number, BibleTreePersonWithMention[]>()

    for (const person of persons) {
      const level = getLevelFromId(person)
      const list = grouped.get(level) || []
      list.push(person)
      grouped.set(level, list)
    }

    const sorted = [...grouped.entries()].sort((left, right) => left[0] - right[0])

    return sorted.map(([level, levelPeople]) => {
      const byId = new Map(levelPeople.map((person) => [person.id, person]))
      const rendered = new Set<string>()
      const groups: TreeGroup[] = []

      for (const person of levelPeople) {
        if (rendered.has(person.id)) {
          continue
        }

        const spouseIds = person.spouseIds.filter((spouseId) => byId.has(spouseId) && !rendered.has(spouseId))

        if (spouseIds.length > 0) {
          const personIds = [person.id, ...spouseIds]
          personIds.forEach((id) => rendered.add(id))
          groups.push({
            id: personIds.join('__'),
            type: 'couple',
            personIds
          })
        } else {
          rendered.add(person.id)
          groups.push({
            id: person.id,
            type: 'single',
            personIds: [person.id]
          })
        }
      }

      return {
        level,
        groups
      } satisfies TreeLevel
    })
  }, [persons])

  useEffect(() => {
    const computeLines = () => {
      const shell = document.querySelector('.tree-shell') as HTMLElement | null

      if (!shell) {
        setLines([])
        return
      }

      const groupElements = shell.querySelectorAll<HTMLElement>('.tree-group')
      const shellRect = shell.getBoundingClientRect()

      const groupById = new Map<string, HTMLElement>()
      const groupMetaById = new Map<string, { personIds: string[] }>()
      const personToGroupId = new Map<string, string>()

      for (const element of groupElements) {
        const groupId = element.dataset.groupId
        const personIdsRaw = element.dataset.personIds || ''

        if (!groupId) {
          continue
        }

        const personIds = personIdsRaw.split(',').filter(Boolean)
        groupById.set(groupId, element)
        groupMetaById.set(groupId, { personIds })

        for (const personId of personIds) {
          personToGroupId.set(personId, groupId)
        }
      }

      const nextSegments: LineSegment[] = []
      const seen = new Set<string>()

      for (const [groupId, groupMeta] of groupMetaById.entries()) {
        const sourceElement = groupById.get(groupId)

        if (!sourceElement) {
          continue
        }

        const childrenGroupIds = new Set<string>()

        for (const personId of groupMeta.personIds) {
          const person = personById.get(personId)

          if (!person) {
            continue
          }

          for (const childId of person.childrenIds) {
            const childGroupId = personToGroupId.get(childId)

            if (childGroupId) {
              childrenGroupIds.add(childGroupId)
            }
          }
        }

        if (childrenGroupIds.size === 0) {
          continue
        }

        const sourceRect = sourceElement.getBoundingClientRect()
        const sourceX = sourceRect.left + sourceRect.width / 2 - shellRect.left
        const sourceY = sourceRect.bottom - shellRect.top

        const targetPoints = [...childrenGroupIds]
          .map((targetGroupId) => {
            const targetElement = groupById.get(targetGroupId)

            if (!targetElement) {
              return null
            }

            const targetRect = targetElement.getBoundingClientRect()

            return {
              key: `${groupId}->${targetGroupId}`,
              x: targetRect.left + targetRect.width / 2 - shellRect.left,
              y: targetRect.top - shellRect.top
            }
          })
          .filter(Boolean) as Array<{ key: string; x: number; y: number }>

        if (targetPoints.length === 0) {
          continue
        }

        if (targetPoints.length === 1) {
          const target = targetPoints[0]
          const key = `${target.key}:single`

          if (!seen.has(key)) {
            seen.add(key)
            nextSegments.push({
              key,
              x1: sourceX,
              y1: sourceY,
              x2: target.x,
              y2: target.y
            })
          }

          continue
        }

        const minX = Math.min(...targetPoints.map((point) => point.x))
        const maxX = Math.max(...targetPoints.map((point) => point.x))
        const minY = Math.min(...targetPoints.map((point) => point.y))
        const midY = sourceY + (minY - sourceY) / 2
        const branchX = (minX + maxX) / 2

        const trunkKey = `${groupId}:trunk`

        if (!seen.has(trunkKey)) {
          seen.add(trunkKey)
          nextSegments.push({
            key: trunkKey,
            x1: sourceX,
            y1: sourceY,
            x2: branchX,
            y2: midY
          })
        }

        const barKey = `${groupId}:bar`

        if (!seen.has(barKey)) {
          seen.add(barKey)
          nextSegments.push({
            key: barKey,
            x1: minX,
            y1: midY,
            x2: maxX,
            y2: midY
          })
        }

        for (const target of targetPoints) {
          const childKey = `${target.key}:branch`

          if (!seen.has(childKey)) {
            seen.add(childKey)
            nextSegments.push({
              key: childKey,
              x1: target.x,
              y1: midY,
              x2: target.x,
              y2: target.y
            })
          }
        }
      }

      setLines(nextSegments)
    }

    const animationFrame = window.requestAnimationFrame(computeLines)
    window.addEventListener('resize', computeLines)

    return () => {
      window.cancelAnimationFrame(animationFrame)
      window.removeEventListener('resize', computeLines)
    }
  }, [levels, personById])

  useEffect(() => {
    if (!personFromQuery || !personById.has(personFromQuery)) {
      return
    }

    setSelectedPersonId(personFromQuery)

    const animationFrame = window.requestAnimationFrame(() => {
      const personElement = document.querySelector<HTMLElement>(`[data-person-id="${personFromQuery}"]`)

      if (!personElement) {
        return
      }

      personElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      })
    })

    return () => {
      window.cancelAnimationFrame(animationFrame)
    }
  }, [personFromQuery, personById])

  useEffect(() => {
    if (!selectedPersonId) {
      setWikiData(null)
      setWikiLoading(false)
      return
    }

    const person = personById.get(selectedPersonId)

    if (!person) {
      return
    }

    let active = true
    setWikiLoading(true)

    getPersonWikiData(person)
      .then((result) => {
        if (!active) {
          return
        }

        setWikiData(result)
      })
      .catch(() => {
        if (!active) {
          return
        }

        setWikiData({
          name: person.name,
          description: 'Biblical figure',
          summary: `No reliable Wikipedia summary was found for ${person.name}.`,
          image: null,
          url: null
        })
      })
      .finally(() => {
        if (!active) {
          return
        }

        setWikiLoading(false)
      })

    return () => {
      active = false
    }
  }, [selectedPersonId, personById])

  const selectedPerson = selectedPersonId ? personById.get(selectedPersonId) : null
  const selectedMentionHref = selectedPerson?.firstMention
    ? `/books/${selectedPerson.firstMention.bookSlug}/${selectedPerson.firstMention.chapter}#verse-${selectedPerson.firstMention.verse}`
    : null

  return (
    <>
      <div className="tree-shell" aria-label="Bible family tree">
        <svg className="tree-connection-layer" aria-hidden="true">
          {lines.map((line) => (
            <line key={line.key} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} className="tree-connection-line" />
          ))}
        </svg>

        {levels.map((level) => (
          <div key={level.level} className="tree-row" data-level={level.level}>
            {level.groups.map((group) => (
              <div
                key={group.id}
                className={`tree-group ${group.type === 'couple' ? 'tree-couple' : 'tree-single'}`}
                data-group-id={group.id}
                data-person-ids={group.personIds.join(',')}
              >
                {group.personIds.map((personId) => {
                  const person = personById.get(personId)

                  if (!person) {
                    return null
                  }

                  const mentionHref = person.firstMention
                    ? `/books/${person.firstMention.bookSlug}/${person.firstMention.chapter}#verse-${person.firstMention.verse}`
                    : undefined

                  return (
                    <article key={person.id} className={`tree-person-card ${getMotherColorClass(person)}`} data-person-id={person.id}>
                      <button
                        type="button"
                        className="tree-person-trigger"
                        onClick={() => setSelectedPersonId(person.id)}
                        title={`${person.id} ${getYearText(person.yearBorn)} - ${getYearText(person.yearDied)}`}
                      >
                        <h3>{person.name}</h3>
                        {person.nameHe ? (
                          <p className="tree-hebrew-name" lang="he" dir="rtl">
                            {person.nameHe}
                          </p>
                        ) : null}
                      </button>

                      {mentionHref ? (
                        <a className="tree-mention-link" href={mentionHref}>
                          First mention: {person.firstMention?.bookName} {person.firstMention?.chapter}:{person.firstMention?.verse}
                        </a>
                      ) : (
                        <span className="tree-mention-missing">First mention unavailable</span>
                      )}
                    </article>
                  )
                })}
              </div>
            ))}
          </div>
        ))}
      </div>

      {selectedPerson ? (
        <div className="tree-modal-backdrop" role="dialog" aria-modal="true" onClick={() => setSelectedPersonId(null)}>
          <div className="tree-modal" onClick={(event) => event.stopPropagation()}>
            <div className="tree-modal-content">
              <button
                type="button"
                className="tree-modal-close"
                onClick={() => setSelectedPersonId(null)}
                aria-label="Close person details"
              >
                ×
              </button>
              <div className="tree-modal-body">
                {wikiLoading ? (
                  <p className="audio-note">Loading person details...</p>
                ) : (
                  <>
                    {wikiData?.image ? (
                      <div className="tree-modal-image-wrap">
                        <img className="tree-modal-image" src={wikiData.image} alt={wikiData.name} />
                      </div>
                    ) : null}
                    <div className="tree-modal-info">
                      <h2>{wikiData?.name || selectedPerson.name}</h2>
                      <p className="tree-modal-description">{wikiData?.description || 'Biblical figure'}</p>
                      <p>{wikiData?.summary || `No reliable Wikipedia summary was found for ${selectedPerson.name}.`}</p>
                      <div className="tree-modal-actions">
                        {selectedMentionHref ? (
                          <a className="tree-modal-link" href={selectedMentionHref}>
                            First mention: {selectedPerson.firstMention?.bookName} {selectedPerson.firstMention?.chapter}:
                            {selectedPerson.firstMention?.verse}
                          </a>
                        ) : null}
                        {wikiData?.url ? (
                          <a className="tree-modal-link" href={wikiData.url} target="_blank" rel="noreferrer">
                            Read more on Wikipedia
                          </a>
                        ) : null}
                        <FavoriteButton item={{ type: 'person', id: selectedPerson.id, name: selectedPerson.name }} />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
