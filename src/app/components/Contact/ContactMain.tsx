import BlockTitle from '@/app/ui/BlockTitle'
import { Breadcrumbs } from '@/app/ui/Breadcrumbs'
import ContactCard from './ContactCard'

interface Props {
  title?: string
  subtitle?: string
}

export default function ContactMain({ title = 'Contact Us', subtitle }: Props) {
  return (
    <div className="flex flex-col gap-6 flex-1">
      <div className="flex flex-col gap-2">
        <Breadcrumbs items={[{ label: title }]} />
        <BlockTitle title={title} subtitle={subtitle} />
        <ContactCard />
      </div>
    </div>
  )
}
