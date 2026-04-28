import type { Block } from 'payload'

export const StatsChart: Block = {
  slug: 'stats-chart',
  imageURL: '/blocks/stats-chart.png',
  imageAltText: 'Chart with statistical callouts',
  admin: { group: 'Data & Stats' },
  fields: [
    { name: 'title', type: 'text' },
    { name: 'description', type: 'textarea' },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'stats-and-chart',
      options: [
        { label: 'Stats + Chart', value: 'stats-and-chart' },
        { label: 'Chart only', value: 'chart-only' },
        { label: 'Stats only', value: 'stats-only' },
      ],
    },
    {
      name: 'stats',
      type: 'array',
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', required: true },
        { name: 'animateCounter', type: 'checkbox', defaultValue: true },
      ],
    },
    {
      name: 'chart',
      type: 'group',
      fields: [
        {
          name: 'type',
          type: 'select',
          defaultValue: 'line',
          options: [
            { label: 'Line', value: 'line' },
            { label: 'Bar', value: 'bar' },
            { label: 'Area', value: 'area' },
            { label: 'Donut', value: 'donut' },
          ],
        },
        { name: 'xAxisLabel', type: 'text' },
        { name: 'yAxisLabel', type: 'text' },
        {
          name: 'series',
          type: 'array',
          fields: [
            { name: 'name', type: 'text', required: true },
            {
              name: 'color',
              type: 'text',
              admin: { description: 'Hex color, e.g. #3b82f6' },
            },
            {
              name: 'dataPoints',
              type: 'array',
              fields: [
                { name: 'label', type: 'text', required: true },
                { name: 'value', type: 'number', required: true },
              ],
            },
          ],
        },
      ],
    },
  ],
}
