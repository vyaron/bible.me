const STORAGE_KEY = 'bible-me:favorites'

export type FavoriteItem =
  | { type: 'book'; slug: string; name: string }
  | { type: 'chapter'; slug: string; book: string; number: number; label: string; href: string }
  | { type: 'verse'; book: string; chapter: number; verse: number; text: string; href: string }
  | { type: 'story'; slug: string; title: string }
  | { type: 'person'; id: string; name: string }

export function buildKey(item: FavoriteItem): string {
  switch (item.type) {
    case 'book':
      return `book:${item.slug}`
    case 'chapter':
      return `chapter:${item.slug}`
    case 'verse':
      return `verse:${item.book}-${item.chapter}-${item.verse}`
    case 'story':
      return `story:${item.slug}`
    case 'person':
      return `person:${item.id}`
  }
}

function readRaw(): FavoriteItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as FavoriteItem[]) : []
  } catch {
    return []
  }
}

function writeRaw(items: FavoriteItem[]) {
  if (typeof window === 'undefined') return
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function getFavorites(): FavoriteItem[] {
  return readRaw()
}

export function isFavorite(key: string): boolean {
  return readRaw().some((item) => buildKey(item) === key)
}

export function addFavorite(item: FavoriteItem) {
  const key = buildKey(item)
  const current = readRaw()
  if (current.some((existing) => buildKey(existing) === key)) return
  writeRaw([...current, item])
}

export function removeFavorite(key: string) {
  const current = readRaw()
  writeRaw(current.filter((item) => buildKey(item) !== key))
}
