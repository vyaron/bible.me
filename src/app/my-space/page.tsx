'use client'

import { useEffect, useState } from 'react'

import type { FavoriteItem } from '@/lib/favorite'
import { buildKey, getFavorites, removeFavorite } from '@/lib/favorite'

function itemHref(item: FavoriteItem): string {
  switch (item.type) {
    case 'book':
      return `/books/${item.slug}`
    case 'chapter':
      return item.href
    case 'verse':
      return item.href
    case 'story':
      return `/story/${item.slug}`
    case 'person':
      return `/tree?person=${item.id}`
  }
}

function itemLabel(item: FavoriteItem): string {
  switch (item.type) {
    case 'book':
      return item.name
    case 'chapter':
      return item.label
    case 'verse':
      return item.text.length > 80 ? `${item.text.slice(0, 80)}…` : item.text
    case 'story':
      return item.title
    case 'person':
      return item.name
  }
}

type GroupProps = {
  title: string
  items: FavoriteItem[]
  onRemove: (key: string) => void
}

function FavGroup({ title, items, onRemove }: GroupProps) {
  return (
    <div className="my-space-group">
      <h2 className="my-space-group-title">{title}</h2>
      {items.length === 0 ? (
        <p className="my-space-empty">No saved {title.toLowerCase()} yet.</p>
      ) : (
        <ul className="my-space-list">
          {items.map((item) => {
            const key = buildKey(item)
            return (
              <li key={key} className="my-space-item">
                <a className="my-space-item-link" href={itemHref(item)}>
                  {itemLabel(item)}
                </a>
                <button
                  type="button"
                  className="my-space-remove"
                  aria-label={`Remove ${itemLabel(item)} from favorites`}
                  onClick={() => onRemove(key)}
                >
                  ×
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export default function MySpacePage() {
  const [items, setItems] = useState<FavoriteItem[]>([])

  useEffect(() => {
    setItems(getFavorites())
  }, [])

  const onRemove = (key: string) => {
    removeFavorite(key)
    setItems(getFavorites())
  }

  const verses = items.filter((item) => item.type === 'verse')
  const stories = items.filter((item) => item.type === 'story')
  const books = items.filter((item) => item.type === 'book')
  const chapters = items.filter((item) => item.type === 'chapter')
  const people = items.filter((item) => item.type === 'person')

  return (
    <>
      <section className="hero my-space-hero">
        <h1>My Space</h1>
        <p>Your saved verses, stories, books, chapters and people.</p>
      </section>

      <section className="panel reader">
        <div className="my-space-content">
          <FavGroup title="Verses" items={verses} onRemove={onRemove} />
          <FavGroup title="Stories" items={stories} onRemove={onRemove} />
          <FavGroup title="Books" items={books} onRemove={onRemove} />
          <FavGroup title="Chapters" items={chapters} onRemove={onRemove} />
          <FavGroup title="People" items={people} onRemove={onRemove} />
        </div>
      </section>
    </>
  )
}
