# ClearBrief ✈️

### AI-Powered Aviation NOTAM Intelligence

> **The problem:** FAA Notices to Air Missions (NOTAMs) are written in dense, abbreviated shorthand that pilots must manually decode under pressure. Misread or missed NOTAMs are a documented contributing factor in aviation incidents. ClearBrief translates raw NOTAM text into scannable, prioritized hazard cards in real time.

![ClearBrief Dashboard](https://img.shields.io/badge/status-live%20demo-39D353?style=for-the-badge&labelColor=0B0E14)
![Built With](https://img.shields.io/badge/built%20with-Claude%20AI-EF4444?style=for-the-badge&labelColor=0B0E14)
![Next.js](https://img.shields.io/badge/Next.js-14-white?style=for-the-badge&labelColor=0B0E14)

---

## What It Does

A pilot or dispatcher enters an ICAO airport code (e.g. `KJFK`). ClearBrief fetches raw NOTAM data for that airport, sends it to Claude, and renders the parsed result as color-coded hazard cards — sorted by severity, written in plain English, designed for high-glare cockpit environments.

**Before ClearBrief:**
```
!JFK 04/015 KJFK ILS RWY 22L LOC U/S 2504050800-2504100800
```

**After ClearBrief:**
> 🔴 **CRITICAL — ILS Runway 22L Localizer Out of Service**
> The instrument landing system localizer for Runway 22L is out of service April 5–10. Pilots cannot fly a full ILS approach to Runway 22L during this period.

---

## Architecture

```
User enters ICAO code
        ↓
Next.js API Route (/app/api/notams/route.ts)
        ↓
Raw NOTAM text retrieved (FAA-format)
        ↓
Claude claude-sonnet-4-6 parses raw text → strict JSON schema
        ↓
Frontend renders severity-graded Hazard Cards
CRITICAL (red) · WARNING (amber) · CLEAR (green)
```

### Why Claude Instead of Regex?

NOTAMs are notoriously inconsistent. The FAA shorthand varies by facility, age, and issuing controller. A regex-based parser breaks on edge cases — and in aviation, edge cases cost lives.

Claude understands aviation context and intent, not just pattern matching. It can correctly classify `RWY 04L/22R CLSD` as CRITICAL and `CUSTOMS AND BORDER PROTECTION PROCEDURES IN EFFECT` as CLEAR without being explicitly programmed for every variant. The output is enforced as a strict typed JSON schema, giving us the reliability of structured data with the comprehension of a language model. This is the core architectural decision that makes ClearBrief work.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 App Router |
| Language | TypeScript |
| Styling | Tailwind CSS |
| AI | Anthropic Claude claude-sonnet-4-6 via `@anthropic-ai/sdk` |
| Deployment | Vercel |

---

## Demo Airports

| ICAO | Airport |
|------|---------|
| `KJFK` | John F. Kennedy International — New York |
| `KLGA` | LaGuardia Airport — New York |
| `KEWR` | Newark Liberty International — New Jersey |
| `KTEB` | Teterboro Airport — New Jersey |
| `KHPN` | Westchester County Airport — New York |
| `KLAX` | Los Angeles International — California |

---

## A Note on Data — Engineering Honesty

The live demo uses **realistic FAA-format mock NOTAM data** stored in `/data/mock-notams.ts`. This was a deliberate technical decision, not a shortcut.

**Why mock data:**
The FAA's official NOTAM API (`api.faa.gov`) requires account registration that was unavailable at build time due to a portal access issue. Two alternative public endpoints were evaluated and confirmed non-functional or deprecated as of April 2025.

**What is still real:**
The AI parsing layer is fully live. Claude receives raw NOTAM shorthand on every search request and returns structured JSON in real time. The transformation — from unreadable government text to plain English hazard cards — happens via actual API calls to Anthropic on every query. The intelligence is real, the data source is mocked.

**The live data path:**
Swapping in live data requires exactly one change — replacing the mock lookup in `route.ts` with a fetch call to the FAA API. The architecture is intentionally designed for this. The two most viable live data sources identified:

1. **FAA NOTAM API** — `api.faa.gov/notams/v1/notams?icao={ICAO}` — official source, free registration required, returns `traditionalMessage` field
2. **PreflightAPI** — `api.preflightapi.io/api/v1/notams/{ICAO}` — unofficial aggregator of FAA data, 5,000 free calls/month, no credit card required

---

## Local Setup

```bash
# 1. Clone and install
git clone https://github.com/yourusername/clearbrief
cd clearbrief
npm install

# 2. Add your Anthropic API key
touch .env.local
# Add: ANTHROPIC_API_KEY=sk-ant-your-key-here

# 3. Run
npm run dev
# Open http://localhost:3000
```

Get an Anthropic API key at [console.anthropic.com](https://console.anthropic.com)

---

## Project Structure

```
clearbrief/
├── app/
│   ├── api/notams/route.ts   # POST handler — data fetch + Claude parse
│   └── page.tsx              # Client UI — search + card grid
├── components/
│   ├── HazardCard.tsx        # Severity-colored NOTAM card
│   ├── SearchBar.tsx         # ICAO code input
│   └── LoadingState.tsx      # Skeleton loading state
├── data/
│   └── mock-notams.ts        # FAA-format NOTAM strings (6 airports)
├── types/
│   └── index.ts              # NotamItem + ApiResponse interfaces
└── CLAUDE.md                 # AI coding context file (see below)
```

---

## Built With Claude Code CLI

This project was built using [Claude Code](https://claude.ai/code), Anthropic's agentic CLI tool. The development workflow used a `CLAUDE.md` context file — a machine-readable briefing document that constrains Claude to the project architecture, prevents file sprawl, and enforces code style across isolated sessions. Each major feature was built in a fresh CLI session using a single precision prompt, keeping token usage minimal and output predictable.

This is the AI-native development workflow: not autocomplete, but a structured human-AI collaboration where the engineer makes architectural decisions and the AI executes implementation.

---

## Roadmap

- [ ] Live FAA API integration (one env variable swap)
- [ ] Sort hazard cards by severity automatically  
- [ ] Support multi-airport comparison view
- [ ] NOTAM expiry countdown timers
- [ ] Mobile-optimized cockpit mode (portrait, max contrast)

---

*Built as part of Pursuit's AI Native Developer Program*