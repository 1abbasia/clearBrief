# ClearBrief — NOTAM Safety Dashboard

## Session Rules — READ FIRST, FOLLOW EXACTLY
- Read ONLY files explicitly named in the current prompt
- Do NOT run ls, find, cat, tree, or explore project structure
- Do NOT read package.json, tsconfig, next.config, or node_modules
- Do NOT read files to "understand context" — this file IS your context
- Do NOT open any file not named in the current prompt
- Do NOT install packages not listed in the Stack section
- Do NOT add features not described in this file
- Do NOT refactor files from previous sessions
- Stop immediately after completing the tasks listed in the prompt

## Stack
Next.js 14 App Router · TypeScript · Tailwind CSS · @anthropic-ai/sdk

## File Map — every file in this project
/types/index.ts              — shared interfaces, nothing else
/data/mock-notams.ts         — raw NOTAM strings keyed by ICAO code
/app/api/notams/route.ts     — POST handler, mock lookup + Claude parse
/app/page.tsx                — client component, search + card grid
/components/HazardCard.tsx   — single card, severity-colored
/components/SearchBar.tsx    — ICAO input, uppercase, Enter to search
/components/LoadingState.tsx — 3 pulse skeleton cards

## Design — non-negotiable
- Background: #0B0E14
- Accent / headings: #39D353 (night-vision green)
- CRITICAL border + badge: #EF4444
- WARNING border + badge: #F59E0B
- CLEAR border + badge: #22C55E
- Card background: #111827
- Body text: #D1D5DB, muted: #6B7280
- Tailwind only. No CSS files. No inline style blocks.
- Dark mode only. No light mode toggle.

## Data Types — defined in /types/index.ts
interface NotamItem {
  id: string
  severity: 'CRITICAL' | 'WARNING' | 'CLEAR'
  category: string
  title: string
  plain_english: string
  expires: string
  raw: string
}

interface ApiResponse {
  icao: string
  notams: NotamItem[]
  fetched_at: string
}

## Data Strategy
Mock data lives in /data/mock-notams.ts as a TypeScript object:
  export default { KJFK: "raw string", KLAX: "raw string", ... }

The raw strings are realistic FAA-format NOTAM text.
Claude parses this raw text on every request — the AI work is real.
Supported airports: KJFK, KLGA, KEWR, KTEB, KHPN, KLAX

On unrecognized ICAO code return the inline FALLBACK — no crash.

Inline fallback (used in route.ts, no separate file):
[{ id:"fallback-1", severity:"WARNING", category:"System",
title:"Airport not in demo database",
plain_english:"This airport is not in the demo dataset. Try KJFK, KLGA, KEWR, KTEB, KHPN, or KLAX.",
expires:"N/A", raw:"" }]

## Environment Variables
ANTHROPIC_API_KEY — from console.anthropic.com — required

## Claude Parsing Prompt — paste verbatim into route.ts, do not rephrase
SYSTEM:
"You are an aviation safety parser. Return ONLY a raw JSON array. No markdown. No explanation. No code fences. Each element must match exactly: {id:string, severity:'CRITICAL'|'WARNING'|'CLEAR', category:string, title:string, plain_english:string, expires:string, raw:string}. Severity rules: CRITICAL=runway or taxiway closure, nav aid outage, airspace TFR. WARNING=construction, lighting issue, partial restriction. CLEAR=admin or procedural notice."

USER:
"Parse these NOTAMs for {ICAO}: {raw_text}"

## Code Rules
- One component per file, max 80 lines each
- No useEffect for data fetching — use route handlers only
- All interfaces imported from /types/index.ts
- process.env.ANTHROPIC_API_KEY only — never hardcode keys
- No animation libraries, no UI component libraries
- Server component by default — add 'use client' only when required
- TypeScript strict mode — no 'any' types