import type { Story } from '@/content/story/types'

export const birthJesusStory: Story = {
  slug: 'birth-jesus',
  title: 'Birth of Jesus',
  testament: 'NT',
  summary:
    'Jesus is born in humility, announced to ordinary people and worshiped as Savior. The promise of hope enters history.',
  heroMedia: {
    type: 'image',
    src: '/story-media/birth-jesus/hero.svg',
    alt: 'Nativity scene',
    caption: 'The promised Savior arrives in humble circumstances.'
  },
  sources: [
    { label: 'Matthew 1:18-25', href: '/books/matthew/1' },
    { label: 'Luke 2:1-20', href: '/books/luke/2' }
  ],
  blocks: [
    {
      type: 'text',
      heading: 'Incarnation',
      body: 'God enters history in Jesus, bringing hope to ordinary people and all nations.'
    },
    {
      type: 'image',
      src: '/story-media/birth-jesus/scene-01.svg',
      alt: 'Shepherds at nativity',
      caption: 'Good news is announced to shepherds first.'
    },
    {
      type: 'quote',
      text: 'Today in the town of David a Savior has been born to you.',
      attribution: 'Luke 2:11'
    }
  ]
}
