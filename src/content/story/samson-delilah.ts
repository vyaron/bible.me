import type { Story } from '@/content/story/types'

export const samsonDelilahStory: Story = {
  slug: 'samson-delilah',
  title: 'Samson and Delilah',
  testament: 'OT',
  summary:
    'Set in the Shephelah and Philistine borderlands, Samson\'s story combines divine calling, violent conflict, betrayal, and a final act in Gaza.',
  heroMedia: {
    type: 'image',
    src: '/story-media/samson-delilah/Ancient_History_Timeline_of_Gaza.png',
    alt: 'Ancient history timeline of Gaza',
    caption: 'Geography and power centers help frame Samson\'s conflict with Philistine Gaza.'
  },
  sources: [
    { label: 'Judges 13', href: '/books/judges/13', note: 'Birth, calling, and Nazirite identity' },
    { label: 'Judges 14', href: '/books/judges/14', note: 'Timnah, lion, riddle, and conflict' },
    { label: 'Judges 15', href: '/books/judges/15', note: 'Retaliation and victory at Lehi' },
    { label: 'Judges 16', href: '/books/judges/16', note: 'Gaza gates, Delilah, and temple collapse' }
  ],
  blocks: [
    {
      type: 'video',
      title: 'Samson and Delilah (video)',
      embedUrl: 'https://www.youtube.com/embed/tSsu8WZE1o4',
      caption: 'Video reference provided for this story.',
      poster: '/story-media/samson-delilah/Ancient_History_Timeline_of_Gaza.png'
    },
    {
      type: 'text',
      heading: 'Story Overview',
      body: 'The story of Samson is a complex narrative of heroism and betrayal, primarily set in the borderlands of the Shephelah and the Philistine coastal plain. Samson, from the tribe of Dan, judged Israel for twenty years during ongoing conflict with the Philistines.'
    },
    {
      type: 'text',
      heading: 'Life and Early Exploits',
      body: 'Samson was born in Zorah to a previously barren woman after an angel announced his birth. Dedicated as a Nazirite from the womb, he was not to cut his hair, drink wine, or touch the dead. On the way to Timnah, he killed a lion with his bare hands, later found honey in the carcass, and used that moment for a wedding riddle. After betrayals, he retaliated by burning Philistine grain with foxes and torches, and later killed one thousand Philistines at Lehi with a donkey\'s jawbone.'
    },
    {
      type: 'image',
      src: '/story-media/samson-delilah/Ancient_History_Timeline_of_Gaza.png',
      alt: 'Ancient history timeline of Gaza and surrounding region',
      caption: 'Gaza was one of the five major Philistine cities at the center of Samson\'s final acts.'
    },
    {
      type: 'text',
      heading: 'The Gates of Gaza',
      body: 'In Gaza, Samson was surrounded by enemies waiting at the city gate to kill him at dawn. At midnight he tore up the gate doors and posts and carried them to a hill facing Hebron, a dramatic display of strength and defiance.'
    },
    {
      type: 'map',
      title: 'Map: Nahal Sorek',
      center: {
        lat: 31.768,
        lng: 34.95
      },
      zoom: 10,
      caption: 'Nahal Sorek and its surrounding valleys sit in the Shephelah frontier region tied to Samson\'s narrative.'
    },
    {
      type: 'text',
      heading: 'Betrayal by Delilah',
      body: 'Samson\'s downfall came through Delilah in the Valley of Sorek. Philistine lords offered her silver to discover the secret of his strength. After three failed attempts, Samson revealed his Nazirite hair vow. While he slept on her lap, his seven braids were shaved and his strength left him.'
    },
    {
      type: 'text',
      heading: 'Final Destruction in Gaza',
      body: 'Captured, blinded, and imprisoned in Gaza, Samson was eventually brought into a temple of Dagon to entertain the crowd. Standing between the two central pillars, he prayed for strength one final time, pushed the pillars apart, and collapsed the temple, killing himself and many Philistine leaders.'
    },
    {
      type: 'quote',
      text: 'Sovereign Lord, remember me. Please, God, strengthen me just once more.',
      attribution: 'Judges 16:28'
    },
    {
      type: 'text',
      heading: 'Historical and Cultural Context',
      body: 'The Philistines are often linked to Sea Peoples who settled the southern coast of Canaan and formed a five-city network: Gaza, Ashdod, Ashkelon, Gath, and Ekron. The Shephelah was a natural frontier between coast and highlands, where neither side held complete control. Samson\'s story became a major theme in Western art, including notable works by Rubens, Rembrandt, and Gustave Dore.'
    },
    {
      type: 'scripture',
      label: 'Read Judges 13-16',
      href: '/books/judges/13',
      excerpt: 'Follow the full arc from Samson\'s birth and Nazirite calling to betrayal and the final collapse in Gaza.'
    }
  ]
}
