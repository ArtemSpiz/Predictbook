import ContactOther from '@/app/components/Contact/ContactOther'
import type { Media } from '@/payload-types'

type Method = {
  id?: string | null
  icon?: Media | number | string | null
  title: string
  linkText: string
  link?: string | null
}

type Social = {
  id?: string | null
  icon?: Media | number | string | null
  link: string
}

type ContactMethodsBlockProps = {
  heading?: string | null
  methods?: Method[] | null
  socials?: Social[] | null
}

export function ContactMethodsBlockComponent({ block }: { block: ContactMethodsBlockProps }) {
  return (
    <ContactOther
      heading={block.heading ?? undefined}
      methods={block.methods ?? undefined}
      socials={block.socials ?? undefined}
    />
  )
}
