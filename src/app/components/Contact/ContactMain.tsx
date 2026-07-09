import BlockTitle from '@/app/ui/BlockTitle'
import { Breadcrumbs } from '@/app/ui/Breadcrumbs'
import ContactCard, { type SubjectOption } from './ContactCard'

interface Props {
  title?: string
  subtitle?: string
  nameLabel?: string
  emailLabel?: string
  subjectLabel?: string
  messageLabel?: string
  subjectOptions?: SubjectOption[]
  buttonText?: string
}

export default function ContactMain({
  title = 'Contact Us',
  subtitle,
  nameLabel,
  emailLabel,
  subjectLabel,
  messageLabel,
  subjectOptions,
  buttonText,
}: Props) {
  return (
    <div className="flex flex-col gap-6 flex-1">
      <div className="flex flex-col gap-2">
        <Breadcrumbs items={[{ label: title }]} />
        <BlockTitle title={title} subtitle={subtitle} />
        <ContactCard
          nameLabel={nameLabel}
          emailLabel={emailLabel}
          subjectLabel={subjectLabel}
          messageLabel={messageLabel}
          subjectOptions={subjectOptions}
          buttonText={buttonText}
        />
      </div>
    </div>
  )
}
