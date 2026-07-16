import type { Footer as FooterData } from '@/payload-types'
import type { SocialItem } from '@/app/ui/SocialLinks'
import { FooterBrand } from '@/app/components/Footer/FooterBrand'
import { FooterColumns } from '@/app/components/Footer/FooterColumns'
import { FooterBottom } from '@/app/components/Footer/FooterBottom'

export function Footer({ data, social }: { data: FooterData; social: SocialItem[] }) {
  return (
    <footer className="bg-ink">
      <div className="container-custom ">
        <div className="border-l border-r border-line-a08 px-6 py-12 md:px-12">
          <FooterBrand brandName={data.brandName} tagline={data.tagline} social={social} />
          <FooterColumns columns={data.columns ?? []} />
          <FooterBottom disclaimer={data.disclaimer} copyright={data.copyright} />
        </div>
      </div>
    </footer>
  )
}
