type AppMapProps = {
  center: {
    lat: number
    lng: number
  }
  zoom: number
  markerLabel?: string
  className?: string
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function getDeltaByZoom(zoom: number) {
  if (zoom >= 13) {
    return 0.08
  }

  if (zoom >= 11) {
    return 0.18
  }

  if (zoom >= 9) {
    return 0.4
  }

  return 1.2
}

export function AppMap({ center, zoom, markerLabel, className }: AppMapProps) {
  const safeZoom = clamp(zoom, 3, 18)
  const delta = getDeltaByZoom(safeZoom)

  const left = center.lng - delta
  const right = center.lng + delta
  const bottom = center.lat - delta
  const top = center.lat + delta

  const bbox = `${left}%2C${bottom}%2C${right}%2C${top}`
  const marker = `${center.lat}%2C${center.lng}`
  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${marker}`
  const viewUrl = `https://www.openstreetmap.org/?mlat=${center.lat}&mlon=${center.lng}#map=${safeZoom}/${center.lat}/${center.lng}`

  return (
    <figure className={className}>
      <div className="app-map-shell">
        <iframe
          src={embedUrl}
          title={markerLabel ?? 'Location map'}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <figcaption className="app-map-caption">
        <a href={viewUrl} target="_blank" rel="noreferrer">
          Open in OpenStreetMap
        </a>
      </figcaption>
    </figure>
  )
}
