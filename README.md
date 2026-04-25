# ClearBrief — Aviation NOTAM Intelligence

ClearBrief is a safety dashboard that translates raw FAA NOTAMs (Notices to Air Missions) into plain-English summaries that pilots can act on in seconds. NOTAMs are critical safety notices about runway closures, navigation aid outages, and airspace restrictions, but their terse coded format requires expert knowledge to decode quickly. ClearBrief solves this by feeding raw NOTAM text to Claude and returning structured, severity-ranked cards — turning opaque bureaucratic text into an immediate go/no-go picture before a flight.

## Architecture
- **Next.js App Router** — server-side route handler processes all AI requests; client component handles search state and card rendering
- **Claude AI parsing layer** — raw NOTAM strings are sent to Claude on every request, which returns a strict typed JSON array with severity classification and plain-English summaries
- **FAA-format NOTAM data** — realistic mock NOTAM strings keyed by ICAO code, representative of actual FAA NOTAM formatting conventions

## Why LLM parsing

NOTAMs follow no single consistent format — abbreviations, date encodings, and field ordering vary by facility and era, making regex-based parsing brittle and incomplete. Claude understands aviation context and intent, correctly interpreting shorthand like `RWY 04L CLSD` or `ILS U/S` even when surrounding fields are malformed or absent. The output is constrained to a strict typed JSON schema (`id`, `severity`, `category`, `title`, `plain_english`, `expires`, `raw`), giving the benefits of LLM comprehension with the reliability of structured data.

## Demo airports
- **KJFK** — John F. Kennedy International Airport, New York
- **KLGA** — LaGuardia Airport, New York
- **KEWR** — Newark Liberty International Airport, New Jersey
- **KTEB** — Teterboro Airport, New Jersey
- **KHPN** — Westchester County Airport, New York
- **KLAX** — Los Angeles International Airport, California

## Setup
```
npm install
```
Add `ANTHROPIC_API_KEY` to `.env.local`
```
npm run dev
```

## Stack
- Next.js 14
- TypeScript
- Tailwind CSS
- Anthropic Claude claude-sonnet-4-6
