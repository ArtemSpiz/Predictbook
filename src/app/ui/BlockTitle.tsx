interface BlockTitleProps {
  title: string
  subtitle: string
}

export default function BlockTitle({ title, subtitle }: BlockTitleProps) {
  return (
    <div>
      <div className="font-semibold text-2xl max-md:text-lg">{title}</div>
      <div className="text-sm text-[#5D554F]">{subtitle}</div>
    </div>
  )
}
