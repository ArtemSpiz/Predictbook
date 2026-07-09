import CustomBtn from '@/app/ui/CustomBtn'

interface Props {
  title?: string
  text?: string
  buttonText?: string
}

export default function ContactValue({
  title = '',
  text = '',
  buttonText = 'Suggest a topic',
}: Props) {
  return (
    <div className="border border-line p-6 flex flex-col gap-4">
      <div className="font-medium">{title}</div>
      <div className="text-sm text-muted">{text}</div>
      <CustomBtn text={buttonText} center />
    </div>
  )
}
