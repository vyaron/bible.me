import { createReadStream } from 'node:fs'
import { promises as fs } from 'node:fs'
import path from 'node:path'
import { Readable } from 'node:stream'

import { NextResponse } from 'next/server'

import { getHebrewAudioRootPath, getHebrewChapterAudio } from '@/lib/hebrew-audio'

type RouteContext = {
  params: Promise<{
    book: string
    chapter: string
  }>
}

const codePattern = /^[A-Z0-9]{3}$/

export const runtime = 'nodejs'

export async function GET(_request: Request, context: RouteContext) {
  const { book, chapter } = await context.params
  const normalizedBook = book.toUpperCase().trim()

  if (!codePattern.test(normalizedBook)) {
    return new NextResponse('Invalid book code', { status: 400 })
  }

  const chapterNumber = Number.parseInt(chapter, 10)

  if (!Number.isInteger(chapterNumber) || chapterNumber < 1 || chapterNumber > 999) {
    return new NextResponse('Invalid chapter number', { status: 400 })
  }

  const chapterAudio = await getHebrewChapterAudio(normalizedBook, chapterNumber)

  if (!chapterAudio) {
    return new NextResponse('Audio not found', { status: 404 })
  }

  const audioRoot = getHebrewAudioRootPath()
  const fullPath = path.resolve(audioRoot, chapterAudio.relativePath)

  if (!fullPath.startsWith(`${audioRoot}${path.sep}`)) {
    return new NextResponse('Invalid audio path', { status: 400 })
  }

  let fileStat

  try {
    fileStat = await fs.stat(fullPath)
  } catch {
    return new NextResponse('Audio not found', { status: 404 })
  }

  const stream = Readable.toWeb(createReadStream(fullPath)) as ReadableStream

  return new NextResponse(stream, {
    status: 200,
    headers: {
      'Content-Type': 'audio/mpeg',
      'Content-Length': String(fileStat.size),
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400'
    }
  })
}
