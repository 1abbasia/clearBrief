'use client'

import { useState } from 'react'

export default function SearchBar({ onSearch }: { onSearch: (icao: string) => void }) {
  const [value, setValue] = useState('')

  function handleSearch() {
    if (value.trim()) onSearch(value.trim())
  }

  return (
    <div className="flex">
      <input
        className="bg-[#0B0E14] text-white border border-[#39D353] rounded-l-lg px-4 py-2 w-full focus:outline-none text-sm"
        placeholder="Enter ICAO code (e.g. KJFK)"
        value={value}
        onChange={(e) => setValue(e.target.value.toUpperCase())}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
      />
      <button
        className="bg-[#39D353] text-[#0B0E14] font-bold px-4 py-2 rounded-r-lg text-sm"
        onClick={handleSearch}
      >
        SEARCH
      </button>
    </div>
  )
}
