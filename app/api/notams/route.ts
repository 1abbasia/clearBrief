import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'

const FALLBACK: NotamItem[] = [
  {
    id: 'fallback-1',
    severity: 'WARNING',
    category: 'System',
    title: 'Live data unavailable',
    plain_english: 'Could not reach FAA API. Verify airport code and retry.',
    expires: 'N/A',
    raw: '',
  },
]

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

export async function POST(request: NextRequest): Promise<NextResponse> {
  let icao = ''
  try {
    const body = await request.json()
    icao = body.icao as string

    const faaRes = await fetch(
      `https://api.faa.gov/notams/v1/notams?icao=${icao}&pageSize=30`,
      {
        headers: {
          Authorization: `Bearer ${process.env.FAA_API_KEY}`,
        },
      }
    )

    if (!faaRes.ok) throw new Error('FAA fetch failed')

    const faaData = await faaRes.json()
    const items: { traditionalMessage?: string }[] = faaData.items ?? []
    const raw_text = items
      .map((item) => item.traditionalMessage ?? '')
      .filter(Boolean)
      .join('\n')

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system:
        "You are an aviation safety parser. Return ONLY a raw JSON array. No markdown. No explanation. No code fences. Each element must match exactly: {id:string, severity:'CRITICAL'|'WARNING'|'CLEAR', category:string, title:string, plain_english:string, expires:string, raw:string}. Severity rules: CRITICAL=runway or taxiway closure, nav aid outage, airspace TFR. WARNING=construction, lighting issue, partial restriction. CLEAR=admin or procedural notice.",
      messages: [
        {
          role: 'user',
          content: `Parse these NOTAMs for ${icao}: ${raw_text}`,
        },
      ],
    })

    const text =
      message.content[0].type === 'text' ? message.content[0].text : ''
    const notams: NotamItem[] = JSON.parse(text)

    const response: ApiResponse = {
      icao,
      notams,
      fetched_at: new Date().toISOString(),
    }

    return NextResponse.json(response)
  } catch {
    const response: ApiResponse = {
      icao,
      notams: FALLBACK,
      fetched_at: new Date().toISOString(),
    }
    return NextResponse.json(response)
  }
}
