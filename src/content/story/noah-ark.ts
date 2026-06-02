import type { Story } from '@/content/story/types'

export const noahArkStory: Story = {
  slug: 'noah-ark',
  title: 'Noah and the Ark',
  testament: 'OT',
  summary:
    'As violence fills the earth, Noah obeys God and builds the ark. Through judgment and mercy, a covenant future is preserved.',
  heroMedia: {
    type: 'image',
    src: '/story-media/noah-ark/hero.svg',
    alt: 'Noah ark floating above flood waters',
    caption: 'Noah trusts and obeys in a generation of chaos.'
  },
  sources: [{ label: 'Genesis 6-9', href: '/books/genesis/6' }],
  blocks: [
    {
      type: 'text',
      heading: 'Obedience Under Pressure',
      body: 'Noah follows God when everyone else ignores Him. The ark becomes a sign of obedience and rescue.'
    },
    {
      type: 'image',
      src: '/story-media/noah-ark/scene-01.svg',
      alt: 'Ark and rainbow after flood',
      caption: 'A rainbow marks God\'s covenant promise.'
    },
    {
      type: 'scripture',
      label: 'Read Genesis 6',
      href: '/books/genesis/6',
      excerpt: 'The account opens with Noah finding favor with God.'
    }
  ]
}
