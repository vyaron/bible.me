import type { Story } from '@/content/story/types'

export const bindingIsaacStory: Story = {
  slug: 'binding-isaac',
  title: 'The Binding of Isaac (Akedat Yitzhak)',
  testament: 'OT',
  summary:
    'Abraham faces the ultimate test of faith when God commands him to sacrifice his son Isaac, only to stop him at the last moment.',
  heroMedia: {
    type: 'image',
    src: '/story-media/binding-isaac/hero.png',
    alt: 'Abraham and Isaac on the mountain',
    caption: 'A story of trust, obedience, and God\'s provision.'
  },
  sources: [{ label: 'Genesis 22', href: '/books/genesis/22' }],
  blocks: [
    {
      type: 'text',
      heading: 'The Test of Trust',
      body: 'God asks Abraham to offer Isaac on Mount Moriah. Abraham rises early and obeys, walking the path of surrender while trusting God\'s promise.'
    },
    {
      type: 'image',
      src: '/story-media/binding-isaac/hero.png',
      alt: 'Abraham and Isaac on the mountain',
      caption: 'A story of trust, obedience, and God\'s provision.'
    },    
    {
      type: 'quote',
      text: 'God himself will provide the lamb for the burnt offering, my son.',
      attribution: 'Genesis 22:8'
    },
    {
      type: 'text',
      heading: 'Provision and Promise',
      body: 'At the final moment, the angel of the Lord stops Abraham. A ram is provided instead, and the covenant promise is reaffirmed through Abraham\'s faith-filled obedience.'
    },
    {
      type: 'scripture',
      label: 'Read Genesis 22',
      href: '/books/genesis/22',
      excerpt: 'Follow the full account of Abraham, Isaac, and God\'s provision on the mountain.'
    }
  ]
}
