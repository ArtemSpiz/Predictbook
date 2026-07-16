import React from 'react'

type StatItem = {
  value: string
  label: string
  description?: string | null
}

type StatsBlockProps = {
  title?: string | null
  stats: StatItem[]
}

export const StatsBlockComponent: React.FC<StatsBlockProps> = ({ title, stats }) => {
  return (
    <div className="bg-[#E8DFD8] p-4 my-3 flex gap-4 max-md:flex-col">
      {title && <div className="text-xl font-medium text-ink text-nowrap">{title}</div>}

      <div className="grid grid-cols-2 gap-4">
        {stats?.map((stat, index) => (
          <div key={index}>
            <div className="text-3xl text-[#75511799] mb-2 max-md:text-lg">{stat.value}</div>
            <div className="text-lg font-medium text-ink  mb-1 max-md:text-base">{stat.label}</div>
            {stat.description && (
              <div className="text-base text-ink leading-snug">{stat.description}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default StatsBlockComponent
