'use client'

import React from 'react'
import CustomBtn from '@/app/ui/CustomBtn'

interface SummaryCardProps {
  title: string
  infoTitle: string
  info: string[]
  direction?: number
  active?: number
}

export default function SummaryCard({
  title,
  infoTitle,
  info,
  direction = 1,
  active = 0,
}: SummaryCardProps) {
  return (
    <div className="overflow-hidden border border-solid border-[#E1DDD5]">
      <div className="flex items-center justify-between border-b border-[#E1DDD5] bg-white p-4">
        <div className="text-xs uppercase text-black">{title}</div>
        <div className="text-xs text-[#5D554F]">Today · 20:00</div>
      </div>

      <div className="flex flex-col gap-4 overflow-hidden bg-[#E8E0D8] p-4">
        <div
          key={active}
          style={{ '--dir': direction } as React.CSSProperties}
          className="space-y-3 animate-info-in"
        >
          <div className="text-lg font-semibold">{infoTitle}</div>

          <ul className="space-y-2 pl-0 text-sm text-[#5D554F]">
            {info.map((item) => (
              <li key={item} className="flex gap-2">
                <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#221E1D]" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="max-md:hidden">
          <CustomBtn text={`Read ${title.toLowerCase()}`} center light />
        </div>
      </div>
    </div>
  )
}
