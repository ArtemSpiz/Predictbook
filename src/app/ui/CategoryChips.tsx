import { getCategoryStyle } from '@/app/lib/getCategoryStyle'

/** Single category chip. `className` carries the placement-specific layout so
 * the rendered class string stays identical to each original call site. */
export function CategoryChip({
  category,
  className = '',
}: {
  category: string
  className?: string
}) {
  return <div className={`${className} ${getCategoryStyle(category)}`}>{category}</div>
}

export function CategoryChips({
  categories,
  className = 'flex items-center gap-1',
  chipClassName = '',
}: {
  categories: string[]
  className?: string
  chipClassName?: string
}) {
  return (
    <div className={className}>
      {categories.map((category) => (
        <CategoryChip key={category} category={category} className={chipClassName} />
      ))}
    </div>
  )
}
