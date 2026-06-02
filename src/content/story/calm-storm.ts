import type { Story } from '@/content/story/types'

export const calmStormStory: Story = {
  slug: 'calm-storm',
  title: 'Jesus Calms the Storm',
  testament: 'NT',
  summary:
    'While the disciples panic in violent wind and waves, Jesus speaks peace over the sea. Fear gives way to awe.',
  heroMedia: {
    type: 'image',
    src: '/story-media/calm-storm/hero.svg',
    alt: 'Boat in a storm with Jesus and disciples',
    caption: 'Jesus brings peace in the middle of fear.'
  },
  sources: [
    { label: 'Matthew 8:23-27', href: '/books/matthew/8' },
    { label: 'Mark 4:35-41', href: '/books/mark/4' },
    { label: 'Luke 8:22-25', href: '/books/luke/8' }
  ],
  blocks: [
    {
      type: 'text',
      heading: 'Authority Over Creation',
      body: 'The storm reveals both the disciples\' fear and Jesus\' authority as He commands wind and waves.'
    },
    {
      type: 'video',
      title: 'Story visual (video)',
      embedUrl: 'https://player.vimeo.com/video/76979871',
      caption: 'Example embedded story media block for richer storytelling.',
      poster: '/story-media/calm-storm/scene-01.svg'
    },
    {
      type: 'image',
      src: '/story-media/calm-storm/scene-01.svg',
      alt: 'Calm sea after storm',
      caption: 'At Jesus\' word, the sea becomes still.'
    }
  ]
}
