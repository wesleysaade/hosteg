// CSS-only tooltip — works in both server and client components (no hooks)
export default function Tip({ text }: { text: string }) {
  if (!text) return null
  return (
    <span className="relative group/tip inline-flex items-center justify-center flex-shrink-0">
      <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-zinc-200 text-zinc-400 hover:bg-[#0EA5E9]/20 hover:text-[#0EA5E9] text-[9px] font-black cursor-help transition-colors select-none leading-none">
        ?
      </span>
      <span className="pointer-events-none absolute z-50 left-1/2 bottom-full mb-2 -translate-x-1/2 w-52 rounded-xl bg-zinc-900 text-white text-xs p-3 opacity-0 group-hover/tip:opacity-100 transition-opacity shadow-xl leading-relaxed whitespace-normal text-left">
        {text}
        <span className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-zinc-900" />
      </span>
    </span>
  )
}
