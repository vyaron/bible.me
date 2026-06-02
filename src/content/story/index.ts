import { birthJesusStory } from '@/content/story/birth-jesus'
import { bindingIsaacStory } from '@/content/story/binding-isaac'
import { burningBushStory } from '@/content/story/burning-bush'
import { calmStormStory } from '@/content/story/calm-storm'
import { creationStory } from '@/content/story/creation'
import { davidGoliathStory } from '@/content/story/david-goliath'
import { josephBrothersStory } from '@/content/story/joseph-brothers'
import { noahArkStory } from '@/content/story/noah-ark'
import { prodigalSonStory } from '@/content/story/prodigal-son'
import { redSeaStory } from '@/content/story/red-sea'
import { resurrectionJesusStory } from '@/content/story/resurrection-jesus'
import { samsonDelilahStory } from '@/content/story/samson-delilah'

import type { Story } from '@/content/story/types'

export type {
  Story,
  StoryBlock,
  StoryHeroMedia,
  StoryImageBlock,
  StoryMapBlock,
  StoryQuoteBlock,
  StoryScriptureBlock,
  StorySource,
  StoryTestament,
  StoryTextBlock,
  StoryVideoBlock
} from '@/content/story/types'

export const storyList: Story[] = [
  creationStory,
  noahArkStory,
  bindingIsaacStory,
  josephBrothersStory,
  burningBushStory,
  redSeaStory,
  davidGoliathStory,
  samsonDelilahStory,
  birthJesusStory,
  calmStormStory,
  prodigalSonStory,
  resurrectionJesusStory
]

export function getStoryBySlug(slug: string) {
  return storyList.find((story) => story.slug === slug)
}
