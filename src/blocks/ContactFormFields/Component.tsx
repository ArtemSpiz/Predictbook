import ContactMain from '@/app/components/Contact/ContactMain'

type ContactFormFieldsBlockProps = {
  heading?: string | null
  subtitle?: string | null
  subjectOptions?: { label: string }[] | null
  nameLabel?: string | null
  emailLabel?: string | null
  subjectLabel?: string | null
  messageLabel?: string | null
  buttonText?: string | null
}

export function ContactFormFieldsBlockComponent({ block }: { block: ContactFormFieldsBlockProps }) {
  return (
    <ContactMain
      title={block.heading ?? undefined}
      subtitle={block.subtitle ?? undefined}
      nameLabel={block.nameLabel ?? undefined}
      emailLabel={block.emailLabel ?? undefined}
      subjectLabel={block.subjectLabel ?? undefined}
      messageLabel={block.messageLabel ?? undefined}
      subjectOptions={block.subjectOptions ?? undefined}
      buttonText={block.buttonText ?? undefined}
    />
  )
}
