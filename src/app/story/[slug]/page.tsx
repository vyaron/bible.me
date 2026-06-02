import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getStoryBySlug, storyList } from '@/lib/story-data'

type StoryDetailPageProps = {
  params: Promise<{
    slug: string
  }>
}

export const dynamicParams = false

export async function generateStaticParams() {
  return storyList.map((story) => ({ slug: story.slug }))
}

export async function generateMetadata({ params }: StoryDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const story = getStoryBySlug(slug)

  if (!story) {
    return {
      title: 'Story not found'
    }
  }

  return {
    title: story.title,
    description: story.summary
  }
}

export default async function StoryDetailPage({ params }: StoryDetailPageProps) {
  const { slug } = await params
  const story = getStoryBySlug(slug)

  if (!story) {
    notFound()
  }

  const otSource = story.sources.filter((source) => source.testament === 'OT')
  const ntSource = story.sources.filter((source) => source.testament === 'NT')

  return (
    <section className="panel reader story-detail">
      <div className="reader-top">
        <div className="reader-meta">
          <a href="/">Home</a> <span aria-hidden="true">/</span> <a href="/story">Story</a>
        </div>
        <h1>{story.title}</h1>
        <p>{story.summary}</p>
      </div>

      <div className="story-image-grid">
        {story.images.map((image, index) => (
          <img key={`${story.slug}-${image}`} className="story-image" src={image} alt={`${story.title} visual ${index + 1}`} />
        ))}
      </div>

      <div className="story-source-grid section">
        <div className="audio-block">
          <h2>Old Testament Source</h2>
          {otSource.length > 0 ? (
            <ul className="story-source-list">
              {otSource.map((source) => (
                <li key={`${story.slug}-${source.label}`}>
                  <a href={source.href}>{source.label}</a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="audio-note">No OT source for this story.</p>
          )}
        </div>

        <div className="audio-block">
          <h2>New Testament Source</h2>
          {ntSource.length > 0 ? (
            <ul className="story-source-list">
              {ntSource.map((source) => (
                <li key={`${story.slug}-${source.label}`}>
                  <a href={source.href}>{source.label}</a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="audio-note">No NT source for this story.</p>
          )}
        </div>
      </div>
    </section>
  )
}
