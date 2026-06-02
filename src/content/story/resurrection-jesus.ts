import type { Story } from '@/content/story/types'

export const resurrectionJesusStory: Story = {
  slug: 'resurrection-jesus',
  title: 'Death and Resurrection of Jesus',
  testament: 'NT',
  summary:
    'Jesus is crucified and buried, then rises on the third day. The resurrection anchors Christian hope and mission.',
  heroMedia: {
    type: 'image',
    src: '/story-media/resurrection-jesus/hero.svg',
    alt: 'Empty tomb at sunrise',
    caption: 'The empty tomb announces new life and hope.'
  },
  sources: [
    { label: 'Matthew 27-28', href: '/books/matthew/27' },
    { label: 'Mark 15-16', href: '/books/mark/15' },
    { label: 'Luke 23-24', href: '/books/luke/23' },
    { label: 'John 19-20', href: '/books/john/19' }
  ],
  blocks: [
    {
      type: 'text',
      heading: 'Victory',
      body: 'The cross and resurrection stand at the center of the gospel: sin is judged, death is defeated, and hope is restored.'
    },
    {
      type: 'image',
      src: '/story-media/resurrection-jesus/scene-01.svg',
      alt: 'Stone rolled away from tomb',
      caption: 'The stone is rolled away and the tomb is empty.'
    },
    {
      type: 'quote',
      text: 'He is not here; he has risen, just as he said.',
      attribution: 'Matthew 28:6'
    }
  ]
}
