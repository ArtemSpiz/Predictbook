import BlockTitle from '@/app/ui/BlockTitle'
import { Breadcrumbs } from '@/app/ui/Breadcrumbs'
import ContactCard from './ContactCard'

export default function ContactMain() {
  return (
    <div className="flex flex-col gap-6 flex-1">
      <div className="flex flex-col gap-2">
        <Breadcrumbs items={[{ label: 'Contact Us' }]} />
        <BlockTitle
          title="Contact Us"
          subtitle="Have a question, feedback, or partnership inquiry?We'd love to hear from you. Fill out the form below and our team will get back to you as soon as possible."
        />
        <ContactCard />
      </div>
    </div>
  )
}
