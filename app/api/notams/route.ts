import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import mockNotams from '@/data/mock-notams'

const FALLBACK: NotamItem[] = [
  {
    id: 'fallback-1',
    severity: 'WARNING',
    category: 'System',
    title: 'Airport not in demo database',
    plain_english:
      'This airport is not in the demo dataset. Try KJFK, KLGA, KEWR, KTEB, KHPN, or KLAX.',
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

    const rawText = mockNotams[icao.toUpperCase()]
    if (!rawText) {
      return NextResponse.json({
        icao,
        notams: FALLBACK,
        fetched_at: new Date().toISOString(),
      })
    }

    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system:
        "You are an aviation safety parser. Return ONLY a raw JSON array. No markdown. No explanation. No code fences. Each element must match exactly: {id:string, severity:'CRITICAL'|'WARNING'|'CLEAR', category:string, title:string, plain_english:string, expires:string, raw:string}. Severity rules: CRITICAL=runway or taxiway closure, nav aid outage, airspace TFR. WARNING=construction, lighting issue, partial restriction. CLEAR=admin or procedural notice.",
      messages: [
        {
          role: 'user',
          content: `Parse these NOTAMs for ${icao}: ${rawText}`,
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
