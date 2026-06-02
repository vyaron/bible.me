import type { Metadata } from 'next'

import { storyList } from '@/lib/story-data'

export const metadata: Metadata = {
  title: 'Greatest stories ever told',
  description: 'Explore Bible stories with short summaries, visuals, and direct scripture links.'
}

export default function StoryPage() {
  return (
    <>
      <section className="hero">
        <p className="hero-kicker">Explore Stories</p>
        <h1>Greatest stories ever told</h1>
        <p>
          Discover eight foundational Bible stories from the Old and New Testaments, each with summary, imagery,
          and direct links to source passages.
        </p>
      </section>

      <section className="panel reader">
        <div className="section-header">
          <div>
            <h2>Bible Great Stories</h2>
            <p>Start with these curated stories across OT and NT.</p>
          </div>
          <span className="badge">8 stories</span>
        </div>

        <div className="story-grid">
          {storyList.map((story) => (
            <a key={story.slug} className="story-card" href={`/story/${story.slug}`}>
              <img className="story-image" src={story.images[0]} alt={`${story.title} illustration`} />
              <div className="story-content">
                <strong>{story.title}</strong>
                <p>{story.summary}</p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </>
  )
}
