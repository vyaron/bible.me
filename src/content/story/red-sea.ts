import type { Story } from '@/content/story/types'

export const redSeaStory: Story = {
  slug: 'red-sea',
  title: 'Moses and the Red Sea',
  testament: 'OT',
  summary:
    'After the Exodus, Israel is trapped between Pharaoh and the sea. God parts the waters and leads his people into freedom.',
  heroMedia: {
    type: 'image',
    src: '/story-media/red-sea/hero.png',
    alt: 'Sea parting for Israel',
    caption: 'God makes a way where there seems to be none.'
  },
  sources: [
    { label: 'Exodus 3:1-10', href: '/books/exodus/3' },
    { label: 'Exodus 12:1-42', href: '/books/exodus/12' },
    { label: 'Exodus 14:1-31', href: '/books/exodus/14' }
  ],
  blocks: [
    {
      type: 'text',
      heading: 'Deliverance',
      body: 'God leads Israel out of slavery and through impossible circumstances by His power.'
    },
    {
      type: 'image',
      src: '/story-media/red-sea/hero.png',
      alt: 'Israel crossing between walls of water',
      caption: 'The sea opens and the people cross on dry ground.'
    },
    {
      type: 'quote',
      text: 'The Lord will fight for you; you need only to be still.',
      attribution: 'Exodus 14:14'
    }
  ]
}
