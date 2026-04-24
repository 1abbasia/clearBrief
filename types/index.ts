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
