import CustomBtn from '@/app/ui/CustomBtn'
import type { ContactPage } from '@/payload-types'

export default function ContactValue({ valueCard }: { valueCard?: ContactPage['valueCard'] }) {
  return (
    <div className="border border-line p-6 flex flex-col gap-4">
      <div className="font-medium">{valueCard?.title ?? 'Other ways to reach us'}</div>
      <div className="text-sm text-muted">
        {valueCard?.text ??
          'Your input helps us improve Predictbook and deliver better analysis.'}
      </div>
      <CustomBtn text={valueCard?.buttonText ?? 'Suggest a topic'} center />
    </div>
  )
}
