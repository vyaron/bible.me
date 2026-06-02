'use client'

import { useEffect, useRef } from 'react'

const HIGHLIGHT_CLASS = 'verse-deep-link-active'
const HIGHLIGHT_DURATION_MS = 4200

function parseDeepLinkedVerse() {
  const hashMatch = window.location.hash.match(/^#verse-(\d+)$/)

  if (hashMatch) {
    const fromHash = Number.parseInt(hashMatch[1], 10)

    if (Number.isInteger(fromHash) && fromHash > 0) {
      return fromHash
    }
  }

  const verseParam = new URLSearchParams(window.location.search).get('verse')

  if (!verseParam) {
    return undefined
  }

  const fromQuery = Number.parseInt(verseParam, 10)

  if (Number.isInteger(fromQuery) && fromQuery > 0) {
    return fromQuery
  }

  return undefined
}

export function VerseDeepLinkHandler() {
  const timeoutRef = useRef<number | null>(null)
  const activeElementRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const clearActiveHighlight = () => {
      if (timeoutRef.current !== null) {
        window.clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }

      if (activeElementRef.current) {
        activeElementRef.current.classList.remove(HIGHLIGHT_CLASS)
        activeElementRef.current = null
      }
    }

    const handleDeepLink = () => {
      const verseNumber = parseDeepLinkedVerse()

      if (!verseNumber) {
        return
      }

      const verseElement = document.getElementById(`verse-${verseNumber}`)

      if (!verseElement) {
        return
      }

      clearActiveHighlight()
      verseElement.scrollIntoView({ behavior: 'smooth', block: 'center' })
      verseElement.classList.add(HIGHLIGHT_CLASS)
      activeElementRef.current = verseElement

      timeoutRef.current = window.setTimeout(() => {
        verseElement.classList.remove(HIGHLIGHT_CLASS)

        if (activeElementRef.current === verseElement) {
          activeElementRef.current = null
        }

        timeoutRef.current = null
      }, HIGHLIGHT_DURATION_MS)
    }

    const rafId = window.requestAnimationFrame(handleDeepLink)
    window.addEventListener('hashchange', handleDeepLink)

    return () => {
      window.cancelAnimationFrame(rafId)
      window.removeEventListener('hashchange', handleDeepLink)
      clearActiveHighlight()
    }
  }, [])

  return null
}
