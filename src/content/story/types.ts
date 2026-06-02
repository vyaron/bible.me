export type StorySource = {
  label: string
  href: string
  note?: string
}

export type StoryTestament = 'OT' | 'NT'

export type StoryImageBlock = {
  type: 'image'
  src: string
  alt: string
  caption?: string
}

export type StoryVideoBlock = {
  type: 'video'
  title: string
  src?: string
  embedUrl?: string
  caption?: string
  poster?: string
}

export type StoryTextBlock = {
  type: 'text'
  heading?: string
  body: string
}

export type StoryQuoteBlock = {
  type: 'quote'
  text: string
  attribution?: string
}

export type StoryScriptureBlock = {
  type: 'scripture'
  label: string
  href: string
  excerpt?: string
}

export type StoryMapBlock = {
  type: 'map'
  title: string
  center: {
    lat: number
    lng: number
  }
  zoom: number
  caption?: string
}

export type StoryBlock =
  | StoryImageBlock
  | StoryVideoBlock
  | StoryTextBlock
  | StoryQuoteBlock
  | StoryScriptureBlock
  | StoryMapBlock

export type StoryHeroMedia = StoryImageBlock | StoryVideoBlock

export type Story = {
  slug: string
  title: string
  testament: StoryTestament
  summary: string
  heroMedia: StoryHeroMedia
  sources: StorySource[]
  blocks: StoryBlock[]
}
