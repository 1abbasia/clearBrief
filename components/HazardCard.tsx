import { NotamItem } from '@/types/index'

const borderColor = { CRITICAL: '#EF4444', WARNING: '#F59E0B', CLEAR: '#22C55E' }

export default function HazardCard({ notam }: { notam: NotamItem }) {
  const color = borderColor[notam.severity]

  return (
    <div
      className="rounded-lg p-4 bg-[#111827] border-l-4"
      style={{ borderColor: color }}
    >
      <div className="flex items-center justify-between">
        <span className="text-white font-semibold text-sm flex-1">{notam.title}</span>
        <span
          className="ml-2 px-2 py-0.5 text-xs font-bold rounded text-[#0B0E14]"
          style={{ backgroundColor: color }}
        >
          {notam.severity}
        </span>
      </div>
      <p className="text-[#D1D5DB] text-sm mt-2">{notam.plain_english}</p>
      <div className="flex justify-between text-[#6B7280] text-xs mt-2">
        <span>{notam.category}</span>
        <span>{notam.expires}</span>
      </div>
    </div>
  )
}
