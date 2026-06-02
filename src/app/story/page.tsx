import type { Metadata } from 'next'

import { storyList } from '@/lib/story-data'

export const metadata: Metadata = {
  title: 'Greatest stories ever told',
  description: 'Explore Bible stories with short summaries, visuals, and direct scripture links.'
}

function StoryCard({
  title,
  href,
  summary,
  imageSrc,
  imageAlt
}: {
  title: string
  href: string
  summary: string
  imageSrc: string
  imageAlt: string
}) {
  return (
    <a className="story-card" href={href}>
      <img className="story-image" src={imageSrc} alt={imageAlt} />
      <div className="story-content">
        <strong>{title}</strong>
        <p>{summary}</p>
      </div>
    </a>
  )
}

export default function StoryPage() {
  const otStories = storyList.filter((story) => story.testament === 'OT')
  const ntStories = storyList.filter((story) => story.testament === 'NT')

  return (
    <>
      <section className="hero story-hero">
        <h1>Greatest stories ever told</h1>
        <p>
          Discover foundational Bible stories with rich visuals, curated summaries, and direct links to relevant
          scripture passages.
        </p>
      </section>

      <section className="panel reader">
        <div className="section-header">
          <div>
            <h2>Expolre Greatest Stories</h2>
          </div>
          <span className="badge">{storyList.length} stories</span>
        </div>

        <div className="section-header section">
          <div>
            <h2>Old Testament</h2>
            <p>Foundational narratives from Genesis through Judges and beyond.</p>
          </div>
          <span className="badge">{otStories.length} stories</span>
        </div>
        <div className="story-grid">
          {otStories.map((story) => (
            <StoryCard
              key={story.slug}
              title={story.title}
              href={`/story/${story.slug}`}
              summary={story.summary}
              imageSrc={story.heroMedia.type === 'image' ? story.heroMedia.src : story.heroMedia.poster ?? '/story-media/_shared/texture.svg'}
              imageAlt={story.heroMedia.type === 'image' ? story.heroMedia.alt : `${story.title} video preview`}
            />
          ))}
        </div>

        <div className="section-header section">
          <div>
            <h2>New Testament</h2>
            <p>Stories centered on Jesus and the gospel witness.</p>
          </div>
          <span className="badge">{ntStories.length} stories</span>
        </div>
        <div className="story-grid">
          {ntStories.map((story) => (
            <StoryCard
              key={story.slug}
              title={story.title}
              href={`/story/${story.slug}`}
              summary={story.summary}
              imageSrc={story.heroMedia.type === 'image' ? story.heroMedia.src : story.heroMedia.poster ?? '/story-media/_shared/texture.svg'}
              imageAlt={story.heroMedia.type === 'image' ? story.heroMedia.alt : `${story.title} video preview`}
            />
          ))}
        </div>
      </section>
    </>
  )
}
