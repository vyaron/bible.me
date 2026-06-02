import type { Story } from '@/content/story/types'

export const creationStory: Story = {
  slug: 'creation',
  title: 'Creation',
  testament: 'OT',
  summary:
    'God creates the heavens and the earth, bringing light, life, and order from chaos. This story frames human purpose and the goodness of creation.',
  heroMedia: {
    type: 'image',
    src: '/story-media/creation/hero.svg',
    alt: 'Creation of earth and sky',
    caption: 'In the beginning, God created the heavens and the earth.'
  },
  sources: [
    { label: 'Genesis 1:1-31', href: '/books/genesis/1' },
    { label: 'Genesis 2:1-3', href: '/books/genesis/2' }
  ],
  blocks: [
    {
      type: 'text',
      heading: 'Beginning',
      body: 'Creation begins with God bringing order, light, and life. Humanity is formed with purpose and dignity.'
    },
    {
      type: 'image',
      src: '/story-media/creation/scene-01.svg',
      alt: 'Creation illustration with sky and earth',
      caption: 'Light enters darkness as creation unfolds.'
    },
    {
      type: 'quote',
      text: 'God saw all that he had made, and it was very good.',
      attribution: 'Genesis 1:31'
    },
    {
      type: 'scripture',
      label: 'Read Genesis 1',
      href: '/books/genesis/1',
      excerpt: 'The first chapter captures creation day by day.'
    }
  ]
}
