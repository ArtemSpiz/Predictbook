import SponsoredCard from '@/app/components/Home/SponsoredCard'
import type { Media } from '@/payload-types'

type SponsoredCardBlockProps = {
  heading: string
  infoIcon?: number | string | Media | null
  sponsors?: { logo: number | string | Media }[] | null
  footerText?: string | null
}

export function SponsoredCardBlockComponent({ block }: { block: SponsoredCardBlockProps }) {
  return (
    <SponsoredCard
      heading={block.heading}
      infoIcon={block.infoIcon as Media | string | null | undefined}
      sponsors={(block.sponsors ?? []).map((s) => ({ logo: s.logo as Media | string }))}
      footerText={block.footerText}
    />
  )
}
