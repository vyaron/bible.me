import type { Story } from '@/content/story/types'

export const prodigalSonStory: Story = {
  slug: 'prodigal-son',
  title: 'The Prodigal Son',
  testament: 'NT',
  summary:
    'A son wastes everything and comes home ashamed. The father runs to embrace him, revealing the heart of grace.',
  heroMedia: {
    type: 'image',
    src: '/story-media/prodigal-son/hero.svg',
    alt: 'Father embracing returning son',
    caption: 'Grace moves first toward the repentant.'
  },
  sources: [{ label: 'Luke 15:11-32', href: '/books/luke/15' }],
  blocks: [
    {
      type: 'text',
      heading: 'Grace',
      body: 'Jesus shows the Father\'s joy over repentance through a story of loss, return, and celebration.'
    },
    {
      type: 'image',
      src: '/story-media/prodigal-son/scene-01.svg',
      alt: 'Welcome celebration at home',
      caption: 'The returning son is welcomed with joy.'
    },
    {
      type: 'scripture',
      label: 'Read Luke 15',
      href: '/books/luke/15',
      excerpt: 'Three parables reveal heaven\'s joy over repentance.'
    }
  ]
}
