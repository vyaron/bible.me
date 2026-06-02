import type { Metadata } from 'next'

import { getBibleTreeData } from '@/lib/bible-tree/data'

import { BibleTreeView } from './tree-view'

export const metadata: Metadata = {
  title: 'Bible Tree',
  description: 'Explore the biblical genealogy tree with first-mention scripture links and Wikipedia context.'
}

export default async function TreePage() {
  const treeData = await getBibleTreeData()

  return (
    <>
      <section className="hero">
        <p className="hero-kicker">Genealogy</p>
        <h1>Bible Tree</h1>
        <p>
          Explore lineage across Scripture. Click a person for quick context, and jump to the first book chapter where
          they are mentioned.
        </p>
      </section>

      <section className="panel reader tree-panel">
        <div className="section-header">
          <div>
            <h2>Family Tree</h2>
            <p>Imported from bible-tree and mapped to first mention chapter links in bible.me.</p>
          </div>
          <span className="badge">{treeData.personCount} people</span>
        </div>

        <p className="audio-note tree-stats">
          {treeData.matchedCount} with mention links • {treeData.personCount - treeData.matchedCount} unmatched
        </p>

        <BibleTreeView persons={treeData.persons} />
      </section>
    </>
  )
}
