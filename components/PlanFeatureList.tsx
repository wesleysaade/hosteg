'use client'
import { useState } from 'react'
import { CheckCircle, CaretDown } from '@phosphor-icons/react'
import Tip from './Tip'

export type PlanFeature = { text: string; tip?: string } | string

interface Props {
  features: PlanFeature[]
  threshold?: number
  popular?: boolean
}

export default function PlanFeatureList({ features, threshold = 5, popular }: Props) {
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? features : features.slice(0, threshold)
  const hiddenCount = features.length - threshold

  return (
    <ul className="space-y-2 flex-1">
      {visible.map((f, i) => {
        const text = typeof f === 'string' ? f : f.text
        const tip = typeof f === 'string' ? undefined : f.tip
        return (
          <li key={i} className="flex items-center gap-2 text-sm text-zinc-700 min-w-0">
            <CheckCircle
              size={14}
              weight="fill"
              className="text-[#0EA5E9] flex-shrink-0"
            />
            <span className="truncate flex-1 min-w-0">{text}</span>
            {tip && <Tip text={tip} />}
          </li>
        )
      })}

      {features.length > threshold && (
        <li>
          <button
            onClick={() => setExpanded((v) => !v)}
            className={`flex items-center gap-1 text-xs font-semibold mt-1 transition-colors ${
              popular
                ? 'text-[#0EA5E9] hover:text-[#0284C7]'
                : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <CaretDown
              size={11}
              weight="bold"
              className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            />
            {expanded ? 'Ver menos' : `Ver mais ${hiddenCount} recursos`}
          </button>
        </li>
      )}
    </ul>
  )
}
