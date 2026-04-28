'use client'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import type { PageBlock } from '@/payload-types'

type Block = Extract<PageBlock, { blockType: 'stats-chart' }>

interface DataPoint {
  label: string
  value: number
}

interface Series {
  name: string
  color?: string
  dataPoints?: DataPoint[]
}

interface ChartCfg {
  type?: 'line' | 'bar' | 'area' | 'donut'
  xAxisLabel?: string
  yAxisLabel?: string
  series?: Series[]
}

interface StatItem {
  value: string
  label: string
}

const DEFAULT_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']

function buildChartData(chart: ChartCfg | undefined) {
  const series = chart?.series ?? []
  if (series.length === 0) return []
  const labels = series[0].dataPoints?.map((p) => p.label) ?? []
  return labels.map((label, i) => {
    const row: Record<string, string | number> = { label: label ?? '' }
    series.forEach((s) => {
      row[s.name ?? ''] = s.dataPoints?.[i]?.value ?? 0
    })
    return row
  })
}

function ChartView({ chart }: { chart: ChartCfg }) {
  const data = buildChartData(chart)
  const series = chart.series ?? []
  const colors = series.map(
    (s, i) => s.color ?? DEFAULT_COLORS[i % DEFAULT_COLORS.length],
  )

  if (chart.type === 'donut') {
    const flat = series.flatMap((s) =>
      (s.dataPoints ?? []).map((p) => ({ name: p.label, value: p.value ?? 0 })),
    )
    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie data={flat} dataKey="value" innerRadius={60} outerRadius={100} label>
            {flat.map((_, i) => (
              <Cell key={i} fill={colors[i % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    )
  }

  const Chart =
    chart.type === 'bar' ? BarChart : chart.type === 'area' ? AreaChart : LineChart

  return (
    <ResponsiveContainer width="100%" height={300}>
      <Chart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="label"
          label={{
            value: chart.xAxisLabel ?? '',
            position: 'insideBottom',
            offset: -5,
          }}
        />
        <YAxis
          label={{
            value: chart.yAxisLabel ?? '',
            angle: -90,
            position: 'insideLeft',
          }}
        />
        <Tooltip />
        <Legend />
        {series.map((s, i) => {
          const color = colors[i]
          if (chart.type === 'bar')
            return <Bar key={s.name ?? i} dataKey={s.name ?? ''} fill={color} />
          if (chart.type === 'area')
            return (
              <Area
                key={s.name ?? i}
                dataKey={s.name ?? ''}
                stroke={color}
                fill={color}
              />
            )
          return (
            <Line
              key={s.name ?? i}
              dataKey={s.name ?? ''}
              stroke={color}
              strokeWidth={2}
            />
          )
        })}
      </Chart>
    </ResponsiveContainer>
  )
}

export function StatsChartClient({ block }: { block: Block }) {
  const layout = (block.layout as string) ?? 'stats-and-chart'
  const stats = (block.stats ?? []) as StatItem[]
  const chart = (block.chart ?? {}) as ChartCfg

  return (
    <section className="px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {block.title && <h2 className="text-3xl font-bold mb-2">{block.title}</h2>}
        {block.description && <p className="text-gray-600 mb-8">{block.description}</p>}
        <div
          className={`grid gap-8 ${layout === 'stats-and-chart' ? 'md:grid-cols-2' : 'grid-cols-1'}`}
        >
          {layout !== 'chart-only' && stats.length > 0 && (
            <div className="space-y-6">
              {stats.map((s, i) => (
                <div key={i}>
                  <div className="text-3xl font-bold text-blue-600">{s.value}</div>
                  <div className="text-sm text-gray-600">{s.label}</div>
                </div>
              ))}
            </div>
          )}
          {layout !== 'stats-only' && (
            <div>
              <ChartView chart={chart} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
