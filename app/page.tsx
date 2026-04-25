'use client'

import { useState, useEffect } from 'react'
import SearchBar from '@/components/SearchBar'
import HazardCard from '@/components/HazardCard'
import LoadingState from '@/components/LoadingState'
import { NotamItem, ApiResponse } from '@/types/index'

export default function Home() {
  const [notams, setNotams] = useState<NotamItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [searched, setSearched] = useState(false)
  const [icao, setIcao] = useState('')

  const handleSearch = (code: string): void => {
    setLoading(true)
    setError('')
    setSearched(true)
    setIcao(code)

    fetch('/api/notams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ icao: code }),
    })
      .then(res => res.json())
      .then((data: ApiResponse) => {
        setNotams(data.notams)
      })
      .catch(() => {
        setError('Failed to load NOTAMs. Try again.')
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    handleSearch('KJFK')
  }, [])

  return (
    <div className="min-h-screen bg-[#0B0E14]">
      <div className="w-full px-6 py-4 border-b border-[#1F2937]">
        <span className="text-[#39D353] font-bold tracking-widest text-lg">CLEARBRIEF</span>
        <span className="text-[#6B7280] text-xs ml-3 inline">Aviation NOTAM Intelligence</span>
      </div>
      <div className="max-w-4xl mx-auto px-6 py-8">
        <SearchBar onSearch={handleSearch} />
        {loading && <div className="mt-8"><LoadingState /></div>}
        {error && <p className="text-[#EF4444] text-sm mt-8">{error}</p>}
        {notams.length > 0 && !loading && (
          <div className="mt-8">
            <p className="text-[#6B7280] text-xs mb-4 uppercase tracking-wider">
              {icao} — {notams.length} notices
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {notams.map(notam => (
                <HazardCard key={notam.id} notam={notam} />
              ))}
            </div>
          </div>
        )}
        {searched && !loading && notams.length === 0 && !error && (
          <p className="text-[#6B7280] text-sm mt-8">No NOTAMs found for this airport.</p>
        )}
      </div>
    </div>
  )
}
