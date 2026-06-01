# Bible.me App

Next.js Bible reader with chapter routes and optional chapter audio.

## Data sources

- Bible text: `data/en/bible-txt`
- Audio files: `data/en/audio`
- Hebrew source: `data/he/bible-txt/torahTeamimDB.json`
- Hebrew generated outputs: `data/he/bible-txt/index.json` and `data/he/bible-txt/books/*.he.json`
- Hebrew audio files: `data/he/audio`
- Hebrew audio generated output: `data/he/audio/index.json`
- Audio source attribution: https://www.open.bible/bibles/english-hosanna-audio-nt

## Scripts

- `npm run dev` runs the app in development mode.
- `npm run audio:build` scans `data/en/audio` and generates `data/en/audio/index.json`.
- `npm run hebrew:build` converts Torah Hebrew data into normalized files for chapter lookup.
- `npm run hebrew-audio:build` scans `data/he/audio` and generates `data/he/audio/index.json`.
- `npm run build` runs `prebuild` (audio + Hebrew text + Hebrew audio generation) and then builds Next.js.
- `npm run start` starts the production server.

## Audio routing

Chapter audio streams from:

- `/api/audio/[book]/[chapter]`

Examples:

- `/api/audio/MAT/1`
- `/api/audio/MRK/16`

If audio is missing for a chapter, the chapter page still renders and shows an unavailable state.

Original Hebrew audio streams from:

- `/api/audio/he/[book]/[chapter]`

Examples:

- `/api/audio/he/MAT/1`
- `/api/audio/he/MRK/16`

## Hebrew verses

- Chapter pages include an `Original Hebrew Verse` link.
- Torah books (Genesis, Exodus, Leviticus, Numbers, Deuteronomy) can render Hebrew verse text when available.
- Non-Torah books show a graceful unavailable message.

If Hebrew chapter audio exists for the current route, chapter pages also show a second player titled `Original hebrew audio`.
