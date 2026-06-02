export type Testament = 'OT' | 'NT'

export type StorySource = {
  label: string
  testament: Testament
  href: string
}

export type Story = {
  slug: string
  title: string
  summary: string
  images: string[]
  sources: StorySource[]
}

export const storyList: Story[] = [
  {
    slug: 'creation',
    title: 'Creation',
    summary:
      'God creates the heavens and the earth, bringing light, life, and order from chaos. This story frames human purpose and the goodness of creation.',
    images: ['/story/creation.svg', '/story/ai-texture.svg'],
    sources: [
      { label: 'Genesis 1:1-31', testament: 'OT', href: '/books/genesis/1' },
      { label: 'Genesis 2:1-3', testament: 'OT', href: '/books/genesis/2' }
    ]
  },
  {
    slug: 'noah-ark',
    title: 'Noah and the Ark',
    summary:
      'As violence fills the earth, Noah obeys God and builds the ark. Through judgment and mercy, a covenant future is preserved.',
    images: ['/story/noah-ark.svg', '/story/ai-texture.svg'],
    sources: [{ label: 'Genesis 6-9', testament: 'OT', href: '/books/genesis/6' }]
  },
  {
    slug: 'red-sea',
    title: 'Moses and the Red Sea',
    summary:
      'After the Exodus, Israel is trapped between Pharaoh and the sea. God parts the waters and leads his people into freedom.',
    images: ['/story/red-sea.svg', '/story/ai-texture.svg'],
    sources: [
      { label: 'Exodus 3:1-10', testament: 'OT', href: '/books/exodus/3' },
      { label: 'Exodus 12:1-42', testament: 'OT', href: '/books/exodus/12' },
      { label: 'Exodus 14:1-31', testament: 'OT', href: '/books/exodus/14' }
    ]
  },
  {
    slug: 'david-goliath',
    title: 'David and Goliath',
    summary:
      'A young shepherd stands where armies tremble. David trusts God and defeats Goliath, showing courage born from faith.',
    images: ['/story/david-goliath.svg', '/story/ai-texture.svg'],
    sources: [{ label: '1 Samuel 17:1-58', testament: 'OT', href: '/books/1-samuel/17' }]
  },
  {
    slug: 'birth-jesus',
    title: 'Birth of Jesus',
    summary:
      'Jesus is born in humility, announced to ordinary people and worshiped as Savior. The promise of hope enters history.',
    images: ['/story/birth-jesus.svg', '/story/ai-texture.svg'],
    sources: [
      { label: 'Matthew 1:18-25', testament: 'NT', href: '/books/matthew/1' },
      { label: 'Luke 2:1-20', testament: 'NT', href: '/books/luke/2' }
    ]
  },
  {
    slug: 'calm-storm',
    title: 'Jesus Calms the Storm',
    summary:
      'While the disciples panic in violent wind and waves, Jesus speaks peace over the sea. Fear gives way to awe.',
    images: ['/story/calm-storm.svg', '/story/ai-texture.svg'],
    sources: [
      { label: 'Matthew 8:23-27', testament: 'NT', href: '/books/matthew/8' },
      { label: 'Mark 4:35-41', testament: 'NT', href: '/books/mark/4' },
      { label: 'Luke 8:22-25', testament: 'NT', href: '/books/luke/8' }
    ]
  },
  {
    slug: 'prodigal-son',
    title: 'The Prodigal Son',
    summary:
      'A son wastes everything and comes home ashamed. The father runs to embrace him, revealing the heart of grace.',
    images: ['/story/prodigal-son.svg', '/story/ai-texture.svg'],
    sources: [{ label: 'Luke 15:11-32', testament: 'NT', href: '/books/luke/15' }]
  },
  {
    slug: 'resurrection-jesus',
    title: 'Death and Resurrection of Jesus',
    summary:
      'Jesus is crucified and buried, then rises on the third day. The resurrection anchors Christian hope and mission.',
    images: ['/story/resurrection-jesus.svg', '/story/ai-texture.svg'],
    sources: [
      { label: 'Matthew 27-28', testament: 'NT', href: '/books/matthew/27' },
      { label: 'Mark 15-16', testament: 'NT', href: '/books/mark/15' },
      { label: 'Luke 23-24', testament: 'NT', href: '/books/luke/23' },
      { label: 'John 19-20', testament: 'NT', href: '/books/john/19' }
    ]
  }
]

export function getStoryBySlug(slug: string) {
  return storyList.find((story) => story.slug === slug)
}
