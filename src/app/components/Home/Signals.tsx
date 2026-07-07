'use client'

import { useEffect, useRef, useState } from 'react'

type SignalsProps = {
  children: React.ReactNode
}

const options = ['Show', 'Hide']

export default function Signals({ children }: SignalsProps) {
  const [show, setShow] = useState(true)

  const active = show ? 0 : 1

  const btnRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [sliderStyle, setSliderStyle] = useState({ left: 0, width: 0 })

  useEffect(() => {
    const el = btnRefs.current[active]
    if (el) {
      setSliderStyle({ left: el.offsetLeft, width: el.offsetWidth })
    }
  }, [active])

  return (
    <div>
      <div className="md:hidden">
        <div className="flex items-start justify-between gap-4 mb-3">
          <div>
            <div className="font-semibold text-lg mb-1">Signals</div>
            <div className="text-[#5D554F] text-sm">
              Track emerging trends before they become headlines
            </div>
          </div>

          <div className="relative flex rounded-xl bg-white border border-solid border-[#E1DDD5] gap-1 shrink-0 h-fit">
            <span
              className="absolute top-0 bottom-1 h-full rounded-lg bg-[#221E1D] shadow-sm transition-all duration-350 ease-[cubic-bezier(0.16,1,0.3,1)]"
              style={{ left: sliderStyle.left, width: sliderStyle.width }}
            />
            {options.map((label, i) => (
              <button
                key={label}
                ref={(el) => {
                  btnRefs.current[i] = el
                }}
                type="button"
                onClick={() => setShow(i === 0)}
                className={`relative z-10 px-4 py-2 rounded-lg text-sm bg-transparent transition-colors duration-300 ${
                  active === i ? 'text-[#F7F6F5]' : 'text-[#5D554F]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div
        className={`flex flex-col gap-5 overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out md:!max-h-none md:!opacity-100 ${
          show ? 'max-h-[3000px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        {children}
      </div>
    </div>
  )
}
