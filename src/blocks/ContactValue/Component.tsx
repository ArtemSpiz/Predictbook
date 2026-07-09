import ContactValue from '@/app/components/Contact/ContactValue'

type ContactValueBlockProps = {
  title?: string | null
  text?: string | null
  buttonText?: string | null
}

export function ContactValueBlockComponent({ block }: { block: ContactValueBlockProps }) {
  return (
    <ContactValue
      title={block.title ?? undefined}
      text={block.text ?? undefined}
      buttonText={block.buttonText ?? undefined}
    />
  )
}
