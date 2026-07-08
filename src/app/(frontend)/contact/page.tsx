import ContactMain from '@/app/components/Contact/ContactMain'
import ContactOther from '@/app/components/Contact/ContactOther'
import ContactValue from '@/app/components/Contact/ContactValue'

export default function Contact() {
  return (
    <main className="container-custom">
      <div className="md:border-l md:border-r border-[#E1DDD5] p-6 flex gap-5 max-md:flex-col max-lg:p-0 max-lg:py-5">
        <div className=" flex flex-col gap-5 flex-1 md:border-r border-[#E1DDD5] md:pr-5 max-lg:pl-5 max-md:pl-0">
          <ContactMain />
        </div>
        <div className="flex flex-col gap-4 md:max-w-[300px]">
          <ContactOther />
          <ContactValue />
        </div>
      </div>
    </main>
  )
}
