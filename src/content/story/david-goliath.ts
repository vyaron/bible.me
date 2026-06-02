import type { Story } from '@/content/story/types'

export const davidGoliathStory: Story = {
  slug: 'david-goliath',
  title: 'David and Goliath',
  testament: 'OT',
  summary:
    'A young shepherd stands where armies tremble. David trusts God and defeats Goliath, showing courage born from faith.',
  heroMedia: {
    type: 'image',
    src: '/story-media/david-goliath/hero.png',
    alt: 'David facing Goliath',
    caption: 'Faith, not armor, defines David\'s victory.'
  },
  sources: [{ label: '1 Samuel 17:1-58', href: '/books/1-samuel/17' }],
  blocks: [
    {
      type: 'text',
      heading: 'Courage',
      body: 'David steps forward because he sees the battle as belonging to the Lord.'
    },
    {
      type: 'image',
      src: '/story-media/david-goliath/hero.png',
      alt: 'David with sling in battle',
      caption: 'A single stone changes the course of battle.'
    },
    {
      type: 'scripture',
      label: 'Read 1 Samuel 17',
      href: '/books/1-samuel/17',
      excerpt: 'The chapter contrasts fear with trust in God.'
    }
  ]
}
