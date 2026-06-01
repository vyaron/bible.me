import type { MetadataRoute } from 'next'

import { getBibleIndex, getChapterUrl, getBookUrl } from '@/lib/bible'
import { getSiteUrl } from '@/lib/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const bibleIndex = await getBibleIndex()
  const siteUrl = getSiteUrl()
  const generatedAt = new Date(bibleIndex.generatedAt)

  return [
    {
      url: `${siteUrl}/`,
      lastModified: generatedAt,
      changeFrequency: 'weekly',
      priority: 1
    },
    ...bibleIndex.books.flatMap((book) => {
      const bookUrl = `${siteUrl}${getBookUrl(book.slug)}`
      const chapterUrls = Array.from({ length: book.chapters }, (_, index) => {
        const chapterNumber = index + 1

        return {
          url: `${siteUrl}${getChapterUrl(book.slug, chapterNumber)}`,
          lastModified: generatedAt,
          changeFrequency: 'weekly' as const,
          priority: 0.8
        }
      })

      return [
        {
          url: bookUrl,
          lastModified: generatedAt,
          changeFrequency: 'weekly' as const,
          priority: 0.9
        },
        ...chapterUrls
      ]
    })
  ]
}
