import ContactOther from '@/app/components/Contact/ContactOther'
import { getSocialLinks } from '@/utilities/getSiteSettings'
import type { Media } from '@/payload-types'

type Method = {
  id?: string | null
  icon?: Media | number | string | null
  title: string
  linkText: string
  link?: string | null
}

type ContactMethodsBlockProps = {
  heading?: string | null
  methods?: Method[] | null
  socialsHeading?: string | null
}

export async function ContactMethodsBlockComponent({ block }: { block: ContactMethodsBlockProps }) {
  const social = await getSocialLinks()
  const socials = social.map((s) => ({ icon: s.icon, link: s.url ?? '' }))
  return (
    <ContactOther
      heading={block.heading ?? undefined}
      methods={block.methods ?? undefined}
      socials={socials}
      socialsHeading={block.socialsHeading ?? undefined}
    />
  )
}
