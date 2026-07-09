import type { Metadata } from 'next'
import ContactMain from '@/app/components/Contact/ContactMain'
import ContactOther from '@/app/components/Contact/ContactOther'
import ContactValue from '@/app/components/Contact/ContactValue'
import { getContactPageContent } from '@/utilities/getPageContent'
import { localeAlternates } from '@/utilities/metadataAlternates'

export async function generateMetadata(): Promise<Metadata> {
  const content = await getContactPageContent()
  return {
    title: content?.title ?? 'Contact Us',
    description: content?.subtitle ?? undefined,
    ...localeAlternates('contact'),
  }
}

export default async function Contact() {
  const content = await getContactPageContent()
  return (
    <main className="container-custom">
      <div className="md:border-l md:border-r border-line p-6 flex gap-5 max-md:flex-col max-lg:p-0 max-lg:py-5">
        <div className=" flex flex-col gap-5 flex-1 md:border-r border-line md:pr-5 max-lg:pl-5 max-md:pl-0">
          <ContactMain title={content?.title ?? undefined} subtitle={content?.subtitle ?? undefined} />
        </div>
        <div className="flex flex-col gap-4 md:max-w-[300px]">
          <ContactOther methods={content?.methods} socials={content?.socials} />
          <ContactValue valueCard={content?.valueCard} />
        </div>
      </div>
    </main>
  )
}
