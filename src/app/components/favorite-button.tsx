'use client'

import { useEffect, useState } from 'react'

import type { FavoriteItem } from '@/lib/favorite'
import { addFavorite, buildKey, isFavorite, removeFavorite } from '@/lib/favorite'

type FavoriteButtonProps = {
  item: FavoriteItem
  className?: string
}

export function FavoriteButton({ item, className }: FavoriteButtonProps) {
  const key = buildKey(item)
  const [liked, setLiked] = useState(false)

  useEffect(() => {
    setLiked(isFavorite(key))
  }, [key])

  const onToggle = (event: React.MouseEvent) => {
    event.preventDefault()
    event.stopPropagation()

    if (liked) {
      removeFavorite(key)
      setLiked(false)
    } else {
      addFavorite(item)
      setLiked(true)
    }
  }

  return (
    <button
      type="button"
      className={`favorite-btn${liked ? ' is-liked' : ''}${className ? ` ${className}` : ''}`}
      aria-label={liked ? 'Remove from favorites' : 'Add to favorites'}
      onClick={onToggle}
    >
      {liked ? '♥' : '♡'}
    </button>
  )
}
