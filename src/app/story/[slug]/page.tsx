import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { AppMap } from '@/app/components/app-map'
import { getStoryBySlug, storyList } from '@/lib/story-data'

function isAllowedEmbedUrl(url: string) {
  try {
    const parsedUrl = new URL(url)
    const allowedHosts = new Set(['youtube.com', 'www.youtube.com', 'youtu.be', 'vimeo.com', 'www.vimeo.com', 'player.vimeo.com'])
    return allowedHosts.has(parsedUrl.hostname)
  } catch {
    return false
  }
}

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

  return (
    <section className="panel reader story-detail">
      <div className="reader-top">
        <div className="reader-meta">
          <a href="/">Home</a> <span aria-hidden="true">/</span> <a href="/story">Story</a>
        </div>
        <h1>{story.title}</h1>
        <p>{story.summary}</p>
      </div>

      <div className="story-blocks">
        {story.blocks.map((block, index) => {
          const key = `${story.slug}-${index}`

          if (block.type === 'image') {
            return (
              <figure key={key} className="story-block story-block-image">
                <img className="story-image" src={block.src} alt={block.alt} />
                {block.caption ? <figcaption>{block.caption}</figcaption> : null}
              </figure>
            )
          }

          if (block.type === 'video') {
            return (
              <section key={key} className="story-block story-block-video">
                <h2>{block.title}</h2>
                {block.embedUrl && isAllowedEmbedUrl(block.embedUrl) ? (
                  <div className="story-video-frame">
                    <iframe
                      src={block.embedUrl}
                      title={block.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  </div>
                ) : null}
                {block.src ? (
                  <video className="story-video-player" controls preload="metadata" poster={block.poster}>
                    <source src={block.src} />
                    Your browser does not support the video tag.
                  </video>
                ) : null}
                {block.caption ? <p className="story-block-caption">{block.caption}</p> : null}
              </section>
            )
          }

          if (block.type === 'quote') {
            return (
              <blockquote key={key} className="story-block story-block-quote">
                <p>{block.text}</p>
                {block.attribution ? <cite>{block.attribution}</cite> : null}
              </blockquote>
            )
          }

          if (block.type === 'scripture') {
            return (
              <section key={key} className="story-block story-block-scripture">
                <h2>{block.label}</h2>
                {block.excerpt ? <p>{block.excerpt}</p> : null}
                <a className="verse-of-day-link" href={block.href}>
                  Open passage
                </a>
              </section>
            )
          }

          if (block.type === 'map') {
            return (
              <section key={key} className="story-block story-block-map">
                <h2>{block.title}</h2>
                <AppMap center={block.center} zoom={block.zoom} markerLabel={block.title} className="story-map" />
                {block.caption ? <p className="story-block-caption">{block.caption}</p> : null}
              </section>
            )
          }

          return (
            <section key={key} className="story-block story-block-text">
              {block.heading ? <h2>{block.heading}</h2> : null}
              <p>{block.body}</p>
            </section>
          )
        })}
      </div>

      <div className="story-source-grid section">
        <div className="audio-block">
          <h2>Relevant Sources</h2>
          <ul className="story-source-list">
            {story.sources.map((source) => (
              <li key={`${story.slug}-${source.label}`}>
                <a href={source.href}>{source.label}</a>
                {source.note ? <span className="story-source-note"> {source.note}</span> : null}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
