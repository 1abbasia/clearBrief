export default function LoadingState() {
  const card = (
    <div className="rounded-lg p-4 bg-[#111827] border-l-4 border-[#1F2937]">
      <div className="animate-pulse bg-[#1F2937] rounded h-4 w-3/4 mb-2" />
      <div className="animate-pulse bg-[#1F2937] rounded h-3 w-full mb-1" />
      <div className="animate-pulse bg-[#1F2937] rounded h-3 w-1/2" />
    </div>
  )

  return (
    <>
      {card}
      {card}
      {card}
    </>
  )
}
